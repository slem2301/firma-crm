import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    domain?: string | null;

    @IsOptional()
    @IsUrl({ require_tld: false })
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
