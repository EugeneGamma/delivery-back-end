import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Email пользователя',
        example: 'eugene.gamma@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Имя пользователя',
        example: 'Eugene Gamma',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Пароль пользователя (минимум 6 символов)',
        example: 'NewPasswordSukaBlyad',
    })
    @IsString()
    @MinLength(6)
    password: string;
}
