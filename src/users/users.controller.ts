import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    Patch,

} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {GetUser} from "../auth/decorators/user.decorator";

@ApiTags("users")
@Controller('users')
@UseGuards(JwtAuthGuard) // JWT
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @ApiOperation({ summary: 'Получение всех пользователей (email validation)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Успешный ответ' })
    @Get()
    findAll() {
        return this.usersService.findAll();
    }
    @ApiOperation({ summary: 'Получение информации о себе' })
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Информация получена' })
    @Get("me")
    getProfile(@Request() req) {
        return this.usersService.findByEmail(req.user.email)
    }

    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь создан' })
    @Post('register')
    @UseGuards() // ДЛЯ ЭТОГО ЭНПОЛИНТА НЕТ JWT
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    @Patch('me/location')
    @ApiOperation({ summary: 'Обновление домашнего адреса и координат' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Адрес и координаты обновлены' })
    updateLocation(
        @GetUser('id') userId: number,
        @Body() updateLocationDto: UpdateLocationDto
    ) {
        return this.usersService.updateLocation(userId, updateLocationDto);
    }
}