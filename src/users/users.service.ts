import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {UpdateLocationDto} from "./dto/update-location.dto";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        return this.prisma.user.create({
            data: {
                email: createUserDto.email,
                name: createUserDto.name,
                passwordHash: hashedPassword,
            },
        });
    }
    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    // users.service.ts
    async updateLocation(userId: number, dto: UpdateLocationDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                address: dto.address,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
        });
    }

}