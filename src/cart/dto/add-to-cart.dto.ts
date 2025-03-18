// add-to-cart.dto.ts
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
    @IsInt()
    @Type(() => Number)
    dishId: number;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    quantity: number;
}