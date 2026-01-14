// src/orders/orders.controller.ts
import { Body, Controller, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { GetAllOrdersDto } from "./dto/get-all-orders.dto";

@Controller("order")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post("get-all")
  getAll(@Body() dto: GetAllOrdersDto) {
    return this.ordersService.getAll(dto);
  }
}
