import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    addToCart(@GetUser('id') userId: number, @Body() dto: AddToCartDto) {
        return this.cartService.addToCart(userId, dto);
    }

    @Get()
    getCart(@GetUser('id') userId: number) {
        return this.cartService.getCart(userId);
    }

    @Delete(':id')
    removeItem(@GetUser('id') userId: number, @Param('id') itemId: number) {
        return this.cartService.removeItem(userId, itemId);
    }
}