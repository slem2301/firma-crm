import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    role?: string[];

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    password: string
}
