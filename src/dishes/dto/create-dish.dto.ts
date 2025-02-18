import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDishDto {
    @ApiProperty({
        description: 'Название блюда',
        example: 'Сунсал Чикен',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Описание блюда',
        example: 'Куринные обжаренные кусочки филе',
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Ингредиенты блюда в виде строки (разделённые запятыми)',
        example: 'Помидоры, Макароны, Паста',
    })
    @IsString()
    ingredients: any;

    @ApiProperty({
        description: 'Цена блюда',
        example: 50000,
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @ApiProperty({
        description: 'Категория блюда',
        example: 'Вторые блюда',
    })
    @IsString()
    category: string;

    @ApiPropertyOptional({
        description: 'Флаг доступности блюда',
        example: true,
    })
    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean;

    @ApiPropertyOptional({
        description: 'URL изображения блюда',
        example: '/uploads/dishes_(1).jpg',
    })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
