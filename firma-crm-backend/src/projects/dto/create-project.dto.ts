import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @MaxLength(200)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    domain?: string | null;

    @IsOptional()
    @IsUrl({ require_tld: false }) // если у тебя могут быть внутренние url без .com
    url?: string | null;

    @IsOptional()
    @IsBoolean()
    isTesting?: boolean;

    @IsOptional()
    @IsBoolean()
    autoPhoneMode?: boolean;

    @IsOptional()
    @IsBoolean()
    randomRedirect?: boolean;

    @IsOptional()
    @IsString()
    countryId?: string | null;

    @IsOptional()
    @IsString()
    productTypeId?: string | null;
}
