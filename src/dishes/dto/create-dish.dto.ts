import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDishDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    ingredients: any; // Теперь это строка

    @IsNumber()
    @Transform(({ value }) => parseFloat(value)) // Преобразуем строку в чис
    price: number;

    @IsString()
    category: string;

    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}