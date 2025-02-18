import { IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({
        description:"Список товаров, где ключ - id товара, а значение - количество",
        example: { "item1": 2, "item2": 1 }
    })
    @IsObject()
    items: Record<string, number>;

    @ApiProperty({
        description: 'Общая стоимость заказа',
        example: 200000,
    })
    @IsNumber()
    total: number;

    @ApiProperty({
        description: 'Идентификатор пользователя, создавшего заказ',
        example: 123,
    })
    @IsNumber()
    userId: number;
}
