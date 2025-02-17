import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    // Получить или создать корзину
    async getOrCreateCart(userId: number) {
        let cart = await this.prisma.cart.findFirst({
            where: { userId },
            include: { items: { include: { dish: true } } },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: { items: { include: { dish: true } } },
            });
        }

        return cart;
    }

    // Добавить блюдо в корзину
    async addToCart(userId: number, dto: AddToCartDto) {
        const cart = await this.getOrCreateCart(userId);

        // Проверяем, существует ли блюдо
        const dish = await this.prisma.dish.findUnique({
            where: { id: dto.dishId },
        });
        if (!dish) {
            throw new NotFoundException('Блюдо не найдено');
        }

        // Добавляем или обновляем позицию в корзине
        return this.prisma.cartItem.upsert({
            where: { cartId_dishId: { cartId: cart.id, dishId: dto.dishId } },
            create: {
                cartId: cart.id,
                dishId: dto.dishId,
                quantity: dto.quantity,
            },
            update: { quantity: { increment: dto.quantity } },
            include: { dish: true },
        });
    }

    // Получить корзину пользователя
    async getCart(userId: number) {
        const cart = await this.prisma.cart.findFirst({
            where: { userId },
            include: { items: { include: { dish: true } } },
        });

        if (!cart) {
            throw new NotFoundException('Корзина не найдена');
        }

        return cart;
    }

    // Удалить позицию из корзины
    async removeItem(userId: number, itemId: number) {
        const cart = await this.getOrCreateCart(userId);

        return this.prisma.cartItem.delete({
            where: { id: itemId, cartId: cart.id },
        });
    }

    // Очистить корзину
    async clearCart(userId: number) {
        const cart = await this.getOrCreateCart(userId);

        return this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }
}