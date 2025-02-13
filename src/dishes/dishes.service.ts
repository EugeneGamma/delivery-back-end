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
            where: { id }
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
}