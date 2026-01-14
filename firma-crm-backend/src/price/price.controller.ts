// price.controller.ts
import { Body, Controller, Post } from "@nestjs/common";
import { PriceService } from "./price.service";
import { GetAllPriceDto } from "./dto/get-all-price.dto";

@Controller("price")
export class PriceController {
    constructor(private readonly priceService: PriceService) { }

    @Post("get-all")
    getAll(@Body() dto: GetAllPriceDto) {
        return this.priceService.getAll(dto);
    }
}
