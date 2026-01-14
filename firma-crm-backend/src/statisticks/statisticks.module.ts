import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { StatisticksController } from "./statisticks.controller";
import { StatisticksService } from "./statisticks.service";

@Module({
    imports: [PrismaModule],
    controllers: [StatisticksController],
    providers: [StatisticksService],
})
export class StatisticksModule { }
