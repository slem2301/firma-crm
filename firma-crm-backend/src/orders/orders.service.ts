import { Injectable, Logger } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { GetAllOrdersDto } from "./dto/get-all-orders.dto";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) { }

  private normalizeStringIds(input?: Array<number | string | null | undefined>): string[] {
    if (!Array.isArray(input)) return [];
    return input
      .filter((v): v is number | string => v !== null && v !== undefined)
      .map((v) => String(v))
      .filter((v) => v.length > 0);
  }

  private buildWhere(dto: GetAllOrdersDto): Prisma.OrderWhereInput {
    const search = dto.search?.trim() || "";

    const from = dto.period?.from ? new Date(dto.period.from) : undefined;
    const to = dto.period?.to ? new Date(dto.period.to) : undefined;

    const dateField = dto.withRouteDate ? "routeDate" : "date";

    const filters = dto.filters ?? {
      countryIds: [],
      typeIds: [],
      dealerIds: [],
      statusIds: [],
      productTypeIds: [],
    };

    const countryIds = this.normalizeStringIds(filters.countryIds);
    const typeIds = this.normalizeStringIds(filters.typeIds);
    const dealerIds = this.normalizeStringIds(filters.dealerIds);
    const statusIds = this.normalizeStringIds(filters.statusIds);
    const productTypeIds = this.normalizeStringIds(filters.productTypeIds);

    const where: Prisma.OrderWhereInput = {
      ...(countryIds.length ? { countryId: { in: countryIds } } : {}),
      ...(typeIds.length ? { typeId: { in: typeIds } } : {}),
      ...(dealerIds.length ? { dealerId: { in: dealerIds } } : {}),
      ...(statusIds.length ? { statusId: { in: statusIds } } : {}),
      ...(productTypeIds.length ? { productTypeId: { in: productTypeIds } } : {}),

      ...(search
        ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { project: { contains: search, mode: "insensitive" } },
            { phones: { contains: search, mode: "insensitive" } },
          ],
        }
        : {}),
    };

    // ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
    // если period задан — фильтруем по date/routeDate,
    // но для строк где date/routeDate = NULL — фильтруем по createdAt
    if (from && to) {
      (where as any).OR = [
        ...((where as any).OR ?? []),
        { [dateField]: { gte: from, lte: to } },
        { AND: [{ [dateField]: null }, { createdAt: { gte: from, lte: to } }] },
      ];
    }

    return where;
  }

  private buildOrderBy(dto: GetAllOrdersDto): Prisma.OrderOrderByWithRelationInput {
    const dir: Prisma.SortOrder = dto.sort?.value === "ASC" ? "asc" : "desc";
    const dateField = dto.withRouteDate ? "routeDate" : "date";

    switch (dto.sort?.key) {
      case "date":
        // ⚠️ если date/routeDate NULL, сортируем запасным вариантом по createdAt
        // Prisma не умеет “coalesce” в orderBy, поэтому делаем просто createdAt как дефолт при пустых датах.
        return ({ [dateField]: dir } as any);

      case "order_id":
        return { orderNumber: dir };

      case "phones":
        return { phones: dir };

      case "price":
        return { total: dir };

      default:
        return ({ [dateField]: "desc" } as any);
    }
  }

  async getAll(dto: GetAllOrdersDto) {
    const take = dto.pagination?.itemsPerPage ?? 25;
    const page = dto.pagination?.page ?? 1;
    const skip = (page - 1) * take;

    const where = this.buildWhere(dto);
    const orderBy = this.buildOrderBy(dto);

    // ✅ полезный лог (чтобы видеть, что реально прилетает с фронта)
    this.logger.log(`getAll dto=${JSON.stringify(dto)}`);

    const [total, orders, sums] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),

      this.prisma.order.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          currency: { select: { symbol: true, code: true } },
          products: true,
          country: { select: { id: true, name: true } },
          type: { select: { id: true, name: true } },
          dealer: { select: { id: true, name: true } },
          status: { select: { id: true, name: true } },
          productType: { select: { id: true, name: true } },
        },
      }),

      this.prisma.order.aggregate({
        where,
        _sum: {
          kickback: true,
          dealerKickback: true,
        },
      }),
    ]);

    this.logger.log(`getAll result total=${total} returned=${orders.length}`);

    const hasMore = skip + take < total;

    const normalized = (orders as any[]).map((o) => {
      const phonesStr = Array.isArray(o.phones) ? o.phones.join(",") : o.phones ?? "";

      return {
        ...o,

        // 🔒 гарантируем структуру, как на старом беке
        currency: o.currency ?? {
          symbol: "",
          code: "",
        },

        // ✅ чтобы фронт не менять (alias'ы как в старом беке)
        order_id: o.orderNumber,
        price: o.total ?? 0,
        otkat: o.kickback ?? 0,
        dealerOtkat: o.dealerKickback ?? 0,
        date_route: o.routeDate ?? null,
        phones: phonesStr,
      };
    });

    return {
      orders: normalized,
      total,
      hasMore,
      totalOtkat: sums?._sum?.kickback ?? 0,
      totalDealerOtkat: sums?._sum?.dealerKickback ?? 0,
    };
  }
}
