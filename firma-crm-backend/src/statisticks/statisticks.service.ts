import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GetCommonStatisticksDto } from "./dto/common.dto";
import { GetProjectsStatisticksDto } from "./dto/projects.dto";


function normalizeIds(ids?: any[]) {
    return (ids ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v) && v > 0)
        .map(String);
}
function buildOrderWhere(dto: GetCommonStatisticksDto) {
    const from = new Date(dto.period.from);
    const to = new Date(dto.period.to);

    const where: any = {
        OR: [
            { date: { gte: from, lt: to } },
            { date: null, createdAt: { gte: from, lt: to } },
        ],
    };

    const countryIds = normalizeIds(dto.filter?.countryIds);
    if (countryIds.length) where.countryId = { in: countryIds };

    const productIds = normalizeIds(dto.filter?.productIds);
    if (productIds.length) where.productTypeId = { in: productIds };

    return { where, from, to, countryIds, productIds };
}

@Injectable()
export class StatisticksService {
    constructor(private readonly prisma: PrismaService) { }

    async getCommon(dto: GetCommonStatisticksDto) {
        const { where, from, to, countryIds, productIds } = buildOrderWhere(dto);

        // фильтр для Lead и AdSpend (чтобы совпадал с фронтовыми фильтрами)
        const leadWhere: any = {
            createdAt: { gte: from, lt: to },
        };

        const spendWhere: any = {
            date: { gte: from, lt: to },
        };

        if (countryIds.length) {
            leadWhere.countryId = { in: countryIds };
            spendWhere.countryId = { in: countryIds };
        }

        if (productIds.length) {
            leadWhere.productTypeId = { in: productIds };
            spendWhere.productTypeId = { in: productIds };
        }

        const [
            ordersCount,
            ordersAgg,
            projectsCount,

            // статусы заказов
            statuses,
            orderId,
            preorderId,
            repeatId,

            // заявки
            leadsTotal,
            leadsBySource,

            // расходы
            spendAgg,
        ] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.aggregate({
                where,
                _sum: { total: true, kickback: true, dealerKickback: true },
            }),
            this.prisma.project.count({
                where: {
                    createdAt: { gte: from, lt: to },
                    ...(countryIds.length ? { countryId: { in: countryIds } } : {}),
                    ...(productIds.length ? { productTypeId: { in: productIds } } : {}),
                },
            }),

            this.prisma.order.groupBy({
                by: ["statusId"],
                where,
                _count: { _all: true },
            }),
            this.prisma.orderStatus.findFirst({ where: { name: "ORDER" }, select: { id: true } }),
            this.prisma.orderStatus.findFirst({ where: { name: "PREORDER" }, select: { id: true } }),
            this.prisma.orderStatus.findFirst({ where: { name: "REPEAT" }, select: { id: true } }),

            this.prisma.lead.count({ where: leadWhere }),
            this.prisma.lead.groupBy({
                by: ["source"],
                where: leadWhere,
                _count: { _all: true },
            }),

            this.prisma.adSpend.aggregate({
                where: spendWhere,
                _sum: { amount: true, supposed: true },
            }),
        ]);

        // --- статусы заказов ---
        const statusMap = new Map<string, number>();
        statuses.forEach((s) => statusMap.set(s.statusId ?? "null", s._count._all));

        const zakaz = orderId?.id ? statusMap.get(orderId.id) ?? 0 : 0;
        const pred = preorderId?.id ? statusMap.get(preorderId.id) ?? 0 : 0;
        const povtor = repeatId?.id ? statusMap.get(repeatId.id) ?? 0 : 0;

        // --- заявки по источникам ---
        const leadsSourceMap = new Map<string, number>();
        leadsBySource.forEach((x) => leadsSourceMap.set(String(x.source), x._count._all));

        const yandex = leadsSourceMap.get("YANDEX") ?? 0;
        const google = leadsSourceMap.get("GOOGLE") ?? 0;
        const other = leadsSourceMap.get("OTHER") ?? 0;

        // --- расходы ---
        const expense = spendAgg._sum.amount ?? 0;
        const supposed = spendAgg._sum.supposed ?? 0;

        // --- деньги / cost ---
        const total = ordersAgg._sum.total ?? 0;
        const kickback = ordersAgg._sum.kickback ?? 0;
        const dealerKickback = ordersAgg._sum.dealerKickback ?? 0;

        // твой текущий earn оставляю как есть (из заказов), не трогаю
        const earn = total - dealerKickback - kickback;

        // requestCost: расход / количество заявок
        const requestCost = leadsTotal ? expense / leadsTotal : 0;

        // orderCost: лучше расход / количество заказов (это обычно "стоимость заказа" из рекламы)
        // если хочешь оставить старую формулу — скажи, я сделаю отдельным полем
        const orderCost = ordersCount ? expense / ordersCount : 0;

        return {
            // если projectsCount пока не нужен фронту — можешь не возвращать, но я оставлю комментом
            // projects: projectsCount,

            requests: {
                total: leadsTotal,
                yandex,
                google,
                other,
                calls: 0, // позже сделаем Call таблицу/сокеты
            },
            orders: {
                total: ordersCount,
                zakaz,
                pred,
                povtor,
            },
            expenses: {
                earn,
                expense,
                supposed,
                requestCost,
                orderCost,
            },
        };
    }



    async getProjects(dto: GetProjectsStatisticksDto) {
        const from = new Date(dto.period.from);
        const to = new Date(dto.period.to);

        // Project пока без isActive — поэтому:
        // - либо игнорируем dto.isActive
        // - либо добавляем поле в Prisma (лучше, но отдельной миграцией)
        const whereProject: any = {
            createdAt: { gte: from, lt: to },
        };

        if (dto.search?.trim()) {
            const s = dto.search.trim();
            whereProject.OR = [
                { name: { contains: s, mode: "insensitive" } },
                { domain: { contains: s, mode: "insensitive" } },
                { url: { contains: s, mode: "insensitive" } },
            ];
        }

        const countryIds = normalizeIds(dto.filter?.countryIds);
        if (countryIds.length) whereProject.countryId = { in: countryIds };

        const productIds = normalizeIds(dto.filter?.productIds);
        if (productIds.length) whereProject.productTypeId = { in: productIds };

        const projects = await this.prisma.project.findMany({
            where: whereProject,
            orderBy: { createdAt: "desc" },
            include: {
                country: true,
                productType: true,
            },
            take: 200,
        });

        return {
            period: { from, to },
            projects: projects.map((p) => ({
                id: p.id,
                name: p.name,
                url: p.url,
                domain: p.domain,
                isTesting: p.isTesting,
                createdAt: p.createdAt,
                country: p.country?.name ?? null,
                productType: p.productType?.name ?? null,
            })),
            total: projects.length,
        };
    }

    async getCalls(dto: any) {
        return { total: 0, byDay: [] };
    }

}
