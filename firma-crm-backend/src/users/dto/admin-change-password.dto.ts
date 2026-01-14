// users/dto/admin-change-password.dto.ts
import { IsOptional, IsString, MinLength } from "class-validator";

export class AdminChangePasswordDto {
    @IsString()
    email: string; // email/login

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    userId?: string; // если захочешь потом перейти на id
}
