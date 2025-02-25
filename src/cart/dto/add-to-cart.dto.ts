import { IsInt, Min } from 'class-validator';

export class AddToCartDto {
    @IsInt()
    @Min(1)
    dishId: number;

    @IsInt()
    @Min(1)
    quantity: number = 1;
}