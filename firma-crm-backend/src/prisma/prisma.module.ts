import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
    providers: [PrismaService],
    exports: [PrismaService],   // ✅ чтобы другие модули могли его inject-ить
})
export class PrismaModule { }
