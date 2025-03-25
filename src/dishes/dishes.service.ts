import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
    constructor(private prisma: PrismaService) {}

    async create(createDishDto: CreateDishDto) {
        return this.prisma.dish.create({
            data: {
                ...createDishDto,
                ingredients: createDishDto.ingredients, // Уже массив
                price: Number(createDishDto.price),
            },
        });
    }

    async findAll() {
        return this.prisma.dish.findMany();
    }

    async findOne(id: number) {
        return this.prisma.dish.findUnique({
            where: { id },
        });
    }

    async update(id: number, updateDishDto: UpdateDishDto) {
        return this.prisma.dish.update({
            where: { id },
            data: updateDishDto
        });
    }

    async remove(id: number) {
        return this.prisma.dish.delete({
            where: { id }
        });
    }
    async searchDishesByIngredients(ingredients: string) {
        // Разбиваем входную строку на отдельные ингредиенты по пробелам
        const ingredientsArray = ingredients.split(/\s+/).filter(Boolean);
        if (ingredientsArray.length === 0) return [];

        // Для каждого ингредиента строим условие с JSON_CONTAINS
        // Например, для "tomato" условие будет: JSON_CONTAINS(ingredients, "\"tomato\"")
        const conditions = ingredientsArray
            .map(ingredient => `JSON_CONTAINS(ingredients, ${JSON.stringify(`"${ingredient}"`)})`)
            .join(' AND ');

        const query = `SELECT * FROM Dish WHERE ${conditions};`;
        return this.prisma.$queryRawUnsafe(query);
    }

}