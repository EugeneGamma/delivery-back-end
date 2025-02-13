import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateOrderDto) {
        return this.prisma.order.create({
            data: {
                items: dto.items,
                total: dto.total,
                userId: dto.userId,
                status: 'PENDING'
            }
        });
    }

    async findAll() {
        return this.prisma.order.findMany({
            include: { user: true }
        });
    }
    async updateStatus(id: number, status: OrderStatus) {
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}