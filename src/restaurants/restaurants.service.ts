import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.restaurant.findMany({
            include: {
                dishes: true, // Если нужно подгружать блюда ресторана
            },
        });
    }
    async findNearby(latitude: number, longitude: number, radius: number = 5) {
        return this.prisma.$queryRaw`
            SELECT *, 
            (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) 
            * cos(radians(longitude) - radians(${longitude})) 
            + sin(radians(${latitude})) * sin(radians(latitude)))) 
            AS distance 
            FROM Restaurant 
            HAVING distance < ${radius} 
            ORDER BY distance ASC`;
    }

    async getAllRestaurants() {
        return this.prisma.restaurant.findMany({
            include: {
                dishes: true,
            },
        });
    }

    // Получение блюд ресторана с фильтрацией ТЕСТ ПИЗДЕЦ
    async getDishesByRestaurant(
        restaurantId: number,
        filters: { category?: string; available?: boolean; sort?: 'asc' | 'desc' },
    ) {
        return this.prisma.dish.findMany({
            where: {
                restaurantId,
                category: filters.category ? filters.category : undefined,
                isAvailable: filters.available !== undefined ? filters.available : undefined,
            },
            orderBy: filters.sort ? { price: filters.sort } : undefined,
        });
    }

}
