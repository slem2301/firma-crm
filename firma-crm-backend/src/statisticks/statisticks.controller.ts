import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { StatisticksService } from "./statisticks.service";
import { GetCommonStatisticksDto } from "./dto/common.dto";
import { GetProjectsStatisticksDto } from "./dto/projects.dto";

@UseGuards(JwtAuthGuard)
@Controller("statisticks")
export class StatisticksController {
    constructor(private readonly service: StatisticksService) { }

    @Post("get-common")
    @HttpCode(200)
    getCommon(@Body() dto: GetCommonStatisticksDto) {
        return this.service.getCommon(dto);
    }

    @Post("get-projects")
    getProjects(@Body() dto: GetProjectsStatisticksDto) {
        return this.service.getProjects(dto);
    }
    @Post("get-calls")
    getCalls(@Body() dto: any) {
        return this.service.getCalls(dto);
    }

}
