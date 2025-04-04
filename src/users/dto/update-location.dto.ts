// src/users/dto/update-location.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLocationDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Домашний адрес', example: 'ул. Пушкина, 10' })
    address?: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ description: 'Широта', example: 41.3111 })
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ description: 'Долгота', example: 69.2797 })
    longitude?: number;
}
