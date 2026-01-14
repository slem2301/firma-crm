import { IsBoolean, IsString } from "class-validator";
import { GetCommonStatisticksDto } from "./common.dto";

export class GetProjectsStatisticksDto extends GetCommonStatisticksDto {
    @IsString()
    search!: string;

    @IsBoolean()
    isActive!: boolean; // пока у Project нет isActive -> сделаем "заглушку/игнор" либо добавим поле
}
