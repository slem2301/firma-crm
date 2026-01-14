import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { TypesService } from "./types.service";
import { TypesController } from "./types.controller";

@Module({
    imports: [PrismaModule],
    controllers: [TypesController], // если есть
    providers: [TypesService],
    exports: [TypesService], // ✅ ВАЖНО
})
export class TypesModule { }
