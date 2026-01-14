// price.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GetAllPriceDto } from "./dto/get-all-price.dto";

@Injectable()
export class PriceService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(dto: GetAllPriceDto) {
        if (!dto) throw new BadRequestException("Body is required");

        const page = Math.max(1, dto.pagination?.page ?? 1);
        const take = Math.min(200, Math.max(1, dto.pagination?.itemsPerPage ?? 20));
        const skip = (page - 1) * take;

        const search = (dto.search ?? "").trim();
        let version = Number(dto.version ?? 0);

        if (version <= 0) {
            const last = await this.prisma.priceVersion.findFirst({
                orderBy: { version: "desc" },
                select: { version: true },
            });
            version = last?.version ?? 1;
        }

        // сорт: фронт шлёт "ASC"/"DESC" (у тебя defaultValue: "ASC")
        const sortKey = dto.sort?.key ?? "product_id";
        const sortValueRaw = String(dto.sort?.value ?? "ASC").toLowerCase();
        const sortDir = sortValueRaw === "desc" ? "desc" : "asc";

        const where: any = {
            version: { version }, // предполагаю связь PriceRow -> PriceVersion как version
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { product_id: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}),
        };

        // filters.productTypeIds — у тебя сейчас в модели PriceRow этого поля нет.
        // Поэтому пока игнорируем, либо добавишь поле позже.

        const [prices, total] = await this.prisma.$transaction([
            this.prisma.priceRow.findMany({
                where,
                skip,
                take,
                orderBy: { [sortKey]: sortDir },
            }),
            this.prisma.priceRow.count({ where }),
        ]);

        const hasMore = skip + take < total;

        return { prices, total, hasMore };
    }
}
