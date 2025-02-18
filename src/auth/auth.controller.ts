import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно зарегистрирован.',
    })
    @ApiBody({ type: RegisterDto })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({ summary: 'Аутентификация пользователя' })
    @ApiResponse({
        status: 200,
        description: 'Пользователь успешно аутентифицирован и получен JWT.',
    })
    @ApiBody({ type: LoginDto })
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}