// auth/dto/auth.dto.ts
import { IsOptional, IsString, MinLength, IsEmail, IsArray } from "class-validator";

export class AuthDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    login?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    tag?: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsArray()
    roles?: string[]; // ✅ массив ролей с фронта, например ["ADMIN"]
}
