import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import Fuse from 'fuse.js';

@Injectable()
export class DishesService {
    constructor(private prisma: PrismaService) {}

    async create(createDishDto: CreateDishDto) {
        return this.prisma.dish.create({
            data: {
                name: createDishDto.name,
                description: createDishDto.description,
                ingredients: createDishDto.ingredients, // Уже массив
                price: Number(createDishDto.price),
                imageUrl: createDishDto.imageUrl,
                thumbnailUrl: createDishDto.thumbnailUrl,
                category: createDishDto.category,
                isAvailable: createDishDto.isAvailable ?? true,
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
            data: {
                name: updateDishDto.name,
                description: updateDishDto.description,
                ingredients: updateDishDto.ingredients,
                price: updateDishDto.price ? Number(updateDishDto.price) : undefined,
                imageUrl: updateDishDto.imageUrl,
                thumbnailUrl: updateDishDto.thumbnailUrl,
                category: updateDishDto.category,
                isAvailable: updateDishDto.isAvailable,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.dish.delete({
            where: { id },
        });
    }

    // Новый метод для поиска блюд по запросу
    async search(query: string) {
        const lowerQuery = query.toLowerCase();

        // Получаем все блюда вместе со связанным рестораном
        const dishes = await this.prisma.dish.findMany({
            include: { restaurant: true },
        });

        // Для fuzzy-поиска создаём поле ingredientsString из ingredients
        const processedDishes = dishes.map((dish) => ({
            ...dish,
            ingredientsString: dish.ingredients
                ? typeof dish.ingredients === 'string'
                    ? dish.ingredients
                    : JSON.stringify(dish.ingredients)
                : '',
        }));

        // Строгий поиск по трём полям
        const strictResults = dishes.filter((dish) => {
            const nameMatch = dish.name.toLowerCase().includes(lowerQuery);

            let ingredientsMatch = false;
            if (dish.ingredients) {
                const ingredientsStr =
                    typeof dish.ingredients === 'string'
                        ? dish.ingredients.toLowerCase()
                        : JSON.stringify(dish.ingredients).toLowerCase();
                ingredientsMatch = ingredientsStr.includes(lowerQuery);
            }

            let restaurantMatch = false;
            if (dish.restaurant && dish.restaurant.name) {
                restaurantMatch = dish.restaurant.name.toLowerCase().includes(lowerQuery);
            }

            return nameMatch || ingredientsMatch || restaurantMatch;
        });

        if (strictResults.length > 0) {
            // Возвращаем результаты строгого поиска с флагом fuzzySearch: false
            return strictResults.map((dish) => {
                const nameMatch = dish.name.toLowerCase().includes(lowerQuery);

                let ingredientsMatch = false;
                if (dish.ingredients) {
                    const ingredientsStr =
                        typeof dish.ingredients === 'string'
                            ? dish.ingredients.toLowerCase()
                            : JSON.stringify(dish.ingredients).toLowerCase();
                    ingredientsMatch = ingredientsStr.includes(lowerQuery);
                }

                let restaurantMatch = false;
                if (dish.restaurant && dish.restaurant.name) {
                    restaurantMatch = dish.restaurant.name.toLowerCase().includes(lowerQuery);
                }

                return {
                    ...dish,
                    matchDetails: { nameMatch, ingredientsMatch, restaurantMatch },
                    fuzzySearch: false,
                };
            });
        } else {
            // Если строгий поиск ничего не нашёл, запускаем fuzzy-поиск
            const options = {
                keys: ['name', 'ingredientsString', 'restaurant.name'],
                threshold: 0.7, // Настраиваем чувствительность fuzzy-поиска
                includeScore: true,
            };

            const fuse = new Fuse(processedDishes, options);
            const fuseResults = fuse.search(query);

            return fuseResults.map((result) => ({
                ...result.item,
                matchScore: result.score,
                fuzzySearch: true,
                matchDetails: {
                    // Если score меньше 0.2, считаем совпадение сильным
                    strongMatch: result.score !== undefined && result.score < 0.2,
                },
            }));
        }
    }
}
