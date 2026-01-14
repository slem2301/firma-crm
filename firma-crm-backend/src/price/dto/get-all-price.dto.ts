// price/dto/get-all-price.dto.ts
import {
    IsArray,
    IsInt,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
    IsIn,
    Min,
} from "class-validator";
import { Type } from "class-transformer";

class PaginationDto {
    @IsInt()
    @Min(1)
    page: number;

    @IsInt()
    @Min(1)
    itemsPerPage: number;
}

class SortDto {
    @IsString()
    key: string;

    @IsIn(["asc", "desc"])
    value: "asc" | "desc";
}

class FiltersDto {
    @IsArray()
    @IsNumber({}, { each: true })
    productTypeIds: number[];
}

export class GetAllPriceDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;

    @IsObject()
    @ValidateNested()
    @Type(() => SortDto)
    sort: SortDto;

    @IsObject()
    @ValidateNested()
    @Type(() => FiltersDto)
    filters: FiltersDto;

    @IsInt()
    version: number;
}
