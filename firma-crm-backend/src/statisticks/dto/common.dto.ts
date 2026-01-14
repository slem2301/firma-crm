import { IsArray, IsDateString, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PeriodDto {
    @IsDateString()
    from!: string;

    @IsDateString()
    to!: string;
}

class FilterDto {
    @IsArray()
    countryIds!: string[];

    @IsArray()
    productIds!: string[];
}

export class GetCommonStatisticksDto {
    @ValidateNested()
    @Type(() => PeriodDto)
    period!: PeriodDto;

    @ValidateNested()
    @Type(() => FilterDto)
    filter!: FilterDto;
}
