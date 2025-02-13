import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // Защищаем ВЕСЬ контроллер
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Этот метод теперь доступен только с валидным JWT токеном
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // Если нужно оставить регистрацию без авторизации:
    @Post('register')
    @UseGuards() // Отключаем защиту для этого метода
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}