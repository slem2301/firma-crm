import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { GetProjectsDto } from "./dto/get-projects.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Controller("projects")
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    getAll(@Body() dto: GetProjectsDto) {
        return this.projectsService.getAll(dto);
    }

    @Post("create")
    create(@Body() dto: CreateProjectDto) {
        return this.projectsService.create(dto);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.projectsService.getById(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: UpdateProjectDto) {
        return this.projectsService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.projectsService.remove(id);
    }

    @Post("get-statisticks")
    getStatisticks(@Body() dto: any) {
        return this.projectsService.getStatisticks(dto);
    }
}
