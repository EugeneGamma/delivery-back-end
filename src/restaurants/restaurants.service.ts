import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {CreateRestaurantDto} from "./dto/create-restaurant.dto";
import {UpdateRestaurantDto} from "./dto/update-restaurant.dto";

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
        filters: { category?: string; available?: boolean | string; sort?: 'asc' | 'desc' },
    ) {
        const isAvailable =
            filters.available !== undefined
                ? filters.available === true || filters.available === 'true'
                : undefined;

        return this.prisma.dish.findMany({
            where: {
                restaurantId,
                category: filters.category ? filters.category : undefined,
                isAvailable,
            },
            orderBy: filters.sort ? { price: filters.sort } : undefined,
        });
    }
    async searchRestaurants(search: string) {
        return this.prisma.$queryRaw`
    SELECT *
    FROM Restaurant
    WHERE LOWER(name) LIKE LOWER(${`%${search}%`});
  `;
    }

    async createRestaurant(dto: CreateRestaurantDto) {

        return this.prisma.restaurant.create({
            data: {
                name: dto.name,
                description: dto.description,
                imageUrl: dto.imageUrl,
                thumbnailUrl: dto.thumbnailUrl,
                topImageUrl: dto.topImageUrl,
            },
        });
    }
    async getDishesByCategory(category: string, sort?: 'asc' | 'desc') {
        return this.prisma.dish.findMany({
            where: { category },
            orderBy: sort ? { price: sort } : undefined,
        });
    }

    async updateRestaurant(id: number, dto: UpdateRestaurantDto) {
        return this.prisma.restaurant.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                imageUrl: dto.imageUrl,
                thumbnailUrl: dto.thumbnailUrl,
                topImageUrl: dto.topImageUrl,
            },
        });
    }


}
