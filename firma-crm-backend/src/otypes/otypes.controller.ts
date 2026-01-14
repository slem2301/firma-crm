import { Controller, Get } from "@nestjs/common";
import { TypesService } from "../types/types.service";

@Controller("otypes")
export class OtypesController {
    constructor(private readonly typesService: TypesService) { }

    @Get("/")
    getAll() {
        return this.typesService.getAll();
    }
}
