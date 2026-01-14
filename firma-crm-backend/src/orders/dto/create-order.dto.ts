// orders/dto/create-order.dto.ts
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    orderNumber: string;

    @IsString()
    project: string;

    @IsOptional()
    @IsString()
    dealerId?: string;

    @IsInt()
    total: number;

    @IsOptional()
    @IsInt()
    kickback?: number;

    @IsOptional()
    @IsInt()
    dealerKickback?: number;

    // + остальные поля по необходимости
}
