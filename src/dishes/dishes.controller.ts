import {
    Get,
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    Delete,
    Param,
    Patch,
    Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiQuery,
} from '@nestjs/swagger';

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
                description: {
                    type: 'string',
                    example: 'Классическая пицца с томатами и моцареллой',
                },
                price: { type: 'number', example: 9.99 },
                image: { type: 'string', format: 'binary' },
                thumbnail: { type: 'string', format: 'binary' },
            },
            required: ['name', 'description', 'price'],
        },
    })
    @UseInterceptors(
        FilesInterceptor('files', 2, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async create(
        @Body() createDishDto: CreateDishDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (files && files.length > 0) {
            createDishDto.imageUrl = `/uploads/${files[0]?.filename}`;
            createDishDto.thumbnailUrl = `/uploads/${files[1]?.filename}`;
        }
        return this.dishesService.create(createDishDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получение списка всех блюд' })
    @ApiResponse({ status: 200, description: 'Список блюд успешно получен.' })
    findAll() {
        return this.dishesService.findAll();
    }

    @Get('search')
    @ApiOperation({
        summary: 'Поиск блюд',
        description:
            'Ищет блюда по названию, ингредиентам или названию ресторана. Если строгий поиск не возвращает результатов, включается нечеткий (fuzzy) поиск. В ответе возвращается массив блюд, где каждому блюду добавлены дополнительные поля matchDetails и fuzzySearch.',
    })
    @ApiQuery({
        name: 'q',
        description:
            'Строка для поиска. Например: "tomato", "помидор", "toamto". Если обычный поиск не даст результатов, будет запущен нечеткий поиск.',
        required: true,
        type: String,
    })
    @ApiResponse({
        status: 200,
        description:
            'Результаты поиска. Возвращается массив блюд с дополнительными полями matchDetails и fuzzySearch. Пример ответа:',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'Pizza Margherita',
                    description: 'Классическая пицца с томатами и моцареллой',
                    ingredients: '["tomato","basil","mozzarella"]',
                    price: 999,
                    imageUrl: '/uploads/...',
                    thumbnailUrl: '/uploads/...',
                    category: 'Pizza',
                    isAvailable: true,
                    createdAt: '2025-02-26T02:52:05.000Z',
                    updatedAt: '2025-02-26T02:52:05.000Z',
                    restaurantId: 1,
                    restaurant: {
                        id: 1,
                        name: 'Italiano Restaurant',
                        createdAt: '2025-02-26T02:52:05.000Z',
                        updatedAt: '2025-02-26T02:52:05.000Z',
                    },
                    matchDetails: {
                        nameMatch: true,
                        ingredientsMatch: false,
                        restaurantMatch: false,
                    },
                    fuzzySearch: false,
                },
            ],
        },
    })
    search(@Query('q') query: string) {
        return this.dishesService.search(query);
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
