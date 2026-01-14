// src/orders/dto/get-all-orders.dto.ts
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class PeriodDto {
    @Type(() => Date)
    from: Date;

    @Type(() => Date)
    to: Date;
}

class PaginationDto {
    @IsNumber()
    page: number;

    @IsNumber()
    itemsPerPage: number;
}

class SortDto {
    @IsString()
    key: string;

    @IsString()
    value: "ASC" | "DESC";
}

class FiltersDto {
    @IsArray() productTypeIds: number[];
    @IsArray() countryIds: number[];
    @IsArray() typeIds: number[];
    @IsArray() dealerIds: number[];
    @IsArray() statusIds: number[];
}

export class GetAllOrdersDto {
    @IsOptional() @IsString() search?: string;

    @ValidateNested() @Type(() => PeriodDto)
    period: PeriodDto;

    @ValidateNested() @Type(() => PaginationDto)
    pagination: PaginationDto;

    @ValidateNested() @Type(() => SortDto)
    sort: SortDto;

    @ValidateNested() @Type(() => FiltersDto)
    filters: FiltersDto;

    @IsBoolean()
    withRouteDate: boolean;
}
