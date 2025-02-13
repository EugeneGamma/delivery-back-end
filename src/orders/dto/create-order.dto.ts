import { IsNumber, IsObject } from 'class-validator';

export class CreateOrderDto {
    @IsObject()
    items: Record<string, number>; // { "item1": 2, "item2": 1 }

    @IsNumber()
    total: number;

    @IsNumber()
    userId: number;
}