import {
    Get,
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    Delete,
    Param,
    Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('dishes')
@Controller('dishes')
export class DishesController {
    constructor(private readonly dishesService: DishesService) {}

    @Post()
    @ApiOperation({ summary: 'Создание нового блюда' })
    @ApiResponse({ status: 201, description: 'Блюдо успешно создано.' })
    @ApiResponse({ status: 400, description: 'Некорректные входные данные.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Данные для создания блюда',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Pizza Margherita' },
                description: { type: 'string', example: 'Классическая пицца с томатами и моцареллой' },
                price: { type: 'number', example: 9.99 },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['name', 'description', 'price'],
        },
    })
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname); // Получаем расширение файла
                    const filename = `${uniqueSuffix}${ext}`; // Сохраняем с расширением
                    callback(null, filename);
                },
            }),
        }),
    )
    async create(
        @Body() createDishDto: CreateDishDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) {
            createDishDto.imageUrl = `/uploads/${image.filename}`;
        }
        return this.dishesService.create(createDishDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получение списка всех блюд' })
    @ApiResponse({ status: 200, description: 'Список блюд успешно получен.' })
    findAll() {
        return this.dishesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получение блюда по ID' })
    @ApiResponse({ status: 200, description: 'Блюдо успешно получено.' })
    @ApiResponse({ status: 404, description: 'Блюдо не найдено.' })
    findOne(@Param('id') id: string) {
        return this.dishesService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновление данных блюда' })
    @ApiResponse({ status: 200, description: 'Блюдо успешно обновлено.' })
    @ApiResponse({ status: 404, description: 'Блюдо не найдено.' })
    update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
        return this.dishesService.update(+id, updateDishDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удаление блюда' })
    @ApiResponse({ status: 200, description: 'Блюдо успешно удалено.' })
    @ApiResponse({ status: 404, description: 'Блюдо не найдено.' })
    remove(@Param('id') id: string) {
        return this.dishesService.remove(+id);
    }
}
