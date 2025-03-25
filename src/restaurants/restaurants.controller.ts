import { Controller, Get, Param, Query, ParseIntPipe, Body, Patch, Post, UseInterceptors, UploadedFile} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {}

    @ApiOperation({ summary: 'Получить список всех ресторанов' })
    @ApiResponse({ status: 200, description: 'Успешный ответ' })
    @Get()
    getRestaurants() {
        return this.restaurantsService.getAllRestaurants();
    }
    @ApiOperation({ summary: 'Создать новый ресторан' })
    @ApiResponse({ status: 201, description: 'Ресторан успешно создан' })
    @Post()
    @UseInterceptors(FileInterceptor('image')) // Если хотите загружать картинку
    createRestaurant(
        @Body() dto: CreateRestaurantDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        // Если передаётся файл, можем сохранить image.path или что-то ещё
        if (image) {
            dto.imageUrl = `/uploads/${image.filename}`;
        }
        return this.restaurantsService.createRestaurant(dto);
    }

    @ApiOperation({ summary: 'Обновить данные ресторана' })
    @ApiResponse({ status: 200, description: 'Ресторан успешно обновлён' })
    @Patch(':id')
    updateRestaurant(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
        return this.restaurantsService.updateRestaurant(+id, dto);
    }

    @ApiOperation({ summary: 'Получить ближайшие рестораны' })
    @ApiQuery({ name: 'latitude', type: Number, description: 'Широта пользователя', example: 41.2995 })
    @ApiQuery({ name: 'longitude', type: Number, description: 'Долгота пользователя', example: 69.2401 })
    @ApiQuery({ name: 'radius', type: Number, required: false, description: 'Радиус поиска в км (по умолчанию 5 км)', example: 5 })
    @Get('nearby')
    findNearby(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: number = 5,
    ) {
        return this.restaurantsService.findNearby(latitude, longitude, radius);
    }

    @ApiOperation({ summary: 'Получение блюд ресторана с фильтрацией и сортировкой' })
    @ApiResponse({ status: 200, description: 'Успешный ответ. Возвращается список блюд ресторана с примененными фильтрами.' })
    @ApiQuery({ name: 'category', type: String, required: false, description: 'Фильтрация по категории блюда. Пример: "Grocery"', example: 'Grocery' })
    @ApiQuery({
        name: 'available',
        type: Boolean,
        required: false,
        description: 'Фильтр по доступности блюда. true для доступных, false для недоступных. Пример: true',
        example: true
    })
    @ApiQuery({
        name: 'sort',
        type: String,
        enum: ['asc', 'desc'],
        required: false,
        description: 'Сортировка блюд по цене. "asc" для сортировки по возрастанию цены, "desc" – по убыванию. Пример: "asc"',
        example: 'asc'
    })
    @Get(':id/dishes')
    getDishes(
        @Param('id', ParseIntPipe) restaurantId: number,
        @Query('category') category?: string,
        @Query('available') available?: boolean,
        @Query('sort') sort?: 'asc' | 'desc',
    ) {
        return this.restaurantsService.getDishesByRestaurant(restaurantId, { category, available, sort });
    }
    @ApiOperation({ summary: 'Поиск ресторанов по названию' })
    @ApiQuery({ name: 'name', type: String, description: 'Часть или полное название ресторана', example: 'Pizza' })
    @ApiResponse({ status: 200, description: 'Список найденных ресторанов' })
    @Get('search')
    search(@Query('name') name: string) {
        return this.restaurantsService.searchRestaurants(name);
    }

    @Get('dishes-by-category')
    @ApiOperation({ summary: 'Получение всех блюд по категории' })
    @ApiQuery({ name: 'category', type: String, required: true })
    @ApiQuery({ name: 'sort', type: String, enum: ['asc', 'desc'], required: false })
    getDishesByCategory(@Query('category') category: string, @Query('sort') sort?: 'asc' | 'desc') {
        return this.restaurantsService.getDishesByCategory(category, sort);
    }
}
