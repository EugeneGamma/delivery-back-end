// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import {User} from "@prisma/client"
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: hashedPassword,
                name: dto.name,
            },
            select: { // Исключаем чувствительные данные из ответа
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true, // Оставляем number, не конвертируем в string
                email: true,
                passwordHash: true
            }
        });

        if (user && await bcrypt.compare(password, user.passwordHash)) {
            return {
                id: user.id, // Оставляем как number
                email: user.email
            };
        }
        return null;
    }

    async login(user: { id: number; email: string }) { // Ожидаем только id и email
        const payload = {
            sub: user.id,
            email: user.email
        };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}