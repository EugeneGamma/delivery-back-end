import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

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
}
