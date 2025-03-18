// cart.controller.ts
import { Controller, Get, Post, Body, Delete, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth() // Указывает, что все эндпоинты данного контроллера требуют авторизации через Bearer-токен
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    @ApiOperation({ summary: 'Добавление товара в корзину' })
    @ApiResponse({ status: 201, description: 'Товар успешно добавлен в корзину.' })
    @ApiBody({ type: AddToCartDto })
    addToCart(
        @GetUser('id', ParseIntPipe) userId: number,
        @Body() dto: AddToCartDto
    ) {
        return this.cartService.addToCart(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получение содержимого корзины' })
    @ApiResponse({ status: 200, description: 'Корзина успешно получена.' })
    getCart(@GetUser('id', ParseIntPipe) userId: number) {
        return this.cartService.getCart(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удаление товара из корзины' })
    @ApiResponse({ status: 200, description: 'Товар успешно удален из корзины.' })
    removeItem(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) itemId: number
    ) {
        return this.cartService.removeItem(userId, itemId);
    }

    @Delete()
    @ApiOperation({ summary: 'Очистка корзины' })
    @ApiResponse({ status: 200, description: 'Корзина успешно очищена.' })
    clearCart(@GetUser('id') userId: number) {
        return this.cartService.clearCart(userId);
    }
}
