import { Controller, Get, Post, Body, Delete, Param, UseGuards, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-items.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    @ApiOperation({ summary: 'Добавление товара в корзину' })
    @ApiResponse({ status: 201, description: 'Товар успешно добавлен в корзину.' })
    @ApiBody({ type: AddToCartDto })
    addToCart(@GetUser('id') userId: number, @Body() dto: AddToCartDto) {
        return this.cartService.addToCart(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получение содержимого корзины' })
    @ApiResponse({ status: 200, description: 'Корзина успешно получена.' })
    getCart(@GetUser('id') userId: number) {
        return this.cartService.getCart(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновление количества товара в корзине' })
    @ApiResponse({ status: 200, description: 'Количество товара обновлено.' })
    updateItem(
        @GetUser('id') userId: number,
        @Param('id') itemId: number,
        @Body() dto: UpdateCartItemDto,
    ) {
        return this.cartService.updateItem(userId, itemId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удаление товара из корзины' })
    @ApiResponse({ status: 200, description: 'Товар успешно удален из корзины.' })
    removeItem(@GetUser('id') userId: number, @Param('id') itemId: number) {
        return this.cartService.removeItem(userId, itemId);
    }

    @Delete()
    @ApiOperation({ summary: 'Очистка корзины' })
    @ApiResponse({ status: 200, description: 'Корзина успешно очищена.' })
    clearCart(@GetUser('id') userId: number) {
        return this.cartService.clearCart(userId);
    }
}
