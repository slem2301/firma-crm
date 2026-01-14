import {
    IsOptional,
    IsString,
    IsArray,
    IsInt,
    Min,
    ValidateNested,
    IsIn,
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

    @IsIn(["ASC", "DESC"])
    value: "ASC" | "DESC";
}

class FiltersDto {
    @IsOptional()
    @IsArray()
    countryIds?: string[];

    @IsOptional()
    @IsArray()
    productTypeIds?: string[];
}

export class GetProjectsDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination?: PaginationDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => SortDto)
    sort?: SortDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => FiltersDto)
    filters?: FiltersDto;
}
