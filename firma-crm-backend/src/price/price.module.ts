import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PriceService } from "./price.service";
import { PriceController } from "./price.controller";


@Module({
    imports: [PrismaModule],
    controllers: [PriceController],
    providers: [PriceService],
})
export class PriceModule { }
