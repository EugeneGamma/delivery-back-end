import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { PrismaModule } from "../prisma/prisma.module";


@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getOrCreateCart(userId: number) {
        return this.prisma.cart.upsert({
            where: { userId },
            create: { userId },
            update: {},
            include: { items: { include: { dish: true } } },
        });
    }

    async addToCart(userId: number, dto: AddToCartDto) {
        const cart = await this.getOrCreateCart(userId);

        return this.prisma.cartItem.upsert({
            where: { cartId_dishId: { cartId: cart.id, dishId: dto.dishId } }, // Теперь это работает
            create: {
                cartId: cart.id,
                dishId: dto.dishId,
                quantity: dto.quantity,
            },
            update: { quantity: { increment: dto.quantity } },
            include: { dish: true },
        });
    }

    async getCart(userId: number) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { dish: true } } },
        });
    }

    async removeItem(userId: number, itemId: number) {
        return this.prisma.cartItem.delete({
            where: { id: itemId, cart: { userId } },
        });
    }
}