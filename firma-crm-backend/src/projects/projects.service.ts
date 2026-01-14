import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { GetProjectsDto } from "./dto/get-projects.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) { }

    private normalizeStringIds(input?: Array<number | string | null | undefined>): string[] {
        if (!Array.isArray(input)) return [];
        return input
            .filter((v): v is number | string => v !== null && v !== undefined)
            .map((v) => String(v))
            .filter((v) => v.length > 0);
    }

    async getAll(dto: GetProjectsDto) {
        const take = dto.pagination?.itemsPerPage ?? 50;
        const page = dto.pagination?.page ?? 1;
        const skip = (page - 1) * take;

        const search = (dto.search ?? "").trim();

        const filters = dto.filters ?? {};
        const countryIds = this.normalizeStringIds(filters.countryIds);
        const productTypeIds = this.normalizeStringIds(filters.productTypeIds);

        const where: any = {
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { domain: { contains: search, mode: "insensitive" } },
                        { url: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}),
            ...(countryIds.length ? { countryId: { in: countryIds } } : {}),
            ...(productTypeIds.length ? { productTypeId: { in: productTypeIds } } : {}),
        };

        const [total, projects] = await this.prisma.$transaction([
            this.prisma.project.count({ where }),
            this.prisma.project.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    country: { select: { id: true, name: true } },
                    productType: { select: { id: true, name: true } },
                },
            }),
        ]);

        return {
            projects,
            total,
            hasMore: skip + take < total,
        };
    }

    async create(dto: CreateProjectDto) {
        const project = await this.prisma.project.create({
            data: {
                name: dto.name,
                domain: dto.domain ?? null,
                url: dto.url ?? null,
                isTesting: dto.isTesting ?? false,
                autoPhoneMode: dto.autoPhoneMode ?? false,
                randomRedirect: dto.randomRedirect ?? false,
                countryId: dto.countryId ?? null,
                productTypeId: dto.productTypeId ?? null,
            },
            include: {
                country: { select: { id: true, name: true } },
                productType: { select: { id: true, name: true } },
            },
        });

        return { project };
    }

    async getById(id: string) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                country: { select: { id: true, name: true } },
                productType: { select: { id: true, name: true } },
            },
        });

        return { project };
    }

    async update(id: string, dto: UpdateProjectDto) {
        try {
            const project = await this.prisma.project.update({
                where: { id },
                data: {
                    name: dto.name,
                    domain: dto.domain,
                    url: dto.url,
                    isTesting: dto.isTesting,
                    autoPhoneMode: dto.autoPhoneMode,
                    randomRedirect: dto.randomRedirect,
                    countryId: dto.countryId,
                    productTypeId: dto.productTypeId,
                },
                include: {
                    country: { select: { id: true, name: true } },
                    productType: { select: { id: true, name: true } },
                },
            });

            return { project };
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
                throw new NotFoundException(`Project ${id} not found`);
            }
            throw e;
        }
    }


    async remove(id: string) {
        await this.prisma.project.delete({ where: { id } });
        return { ok: true };
    }

    // заглушка под фронт, чтобы не падал
    async getStatisticks(_: any) {
        return {
            // подстроим позже под то, что реально рисует statisticks page
            data: [],
        };
    }
}
