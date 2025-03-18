import { Controller, Get, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {}
    @ApiOperation({ summary: 'Получить список всех ресторанов' })
    @Get()
    findAll() {
        return this.restaurantsService.findAll();
    }
    @ApiOperation({ summary: 'Получить ближайшие рестораны' })
    @ApiQuery({ name: 'latitude', type: Number, description: 'Широта пользователя' })
    @ApiQuery({ name: 'longitude', type: Number, description: 'Долгота пользователя' })
    @ApiQuery({ name: 'radius', type: Number, required: false, description: 'Радиус поиска в км (по умолчанию сделал 5 км)' })
    @Get('nearby')
    findNearby(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: number = 5
    ) {
        return this.restaurantsService.findNearby(latitude, longitude, radius);
    }

    @ApiOperation({ summary: 'Получение списка ресторанов' })
    @ApiResponse({ status: 200, description: 'Успешный ответ' })
    @Get()
    getRestaurants() {
        return this.restaurantsService.getAllRestaurants();
    }

    @ApiOperation({ summary: 'Получение блюд ресторана' })
    @ApiResponse({ status: 200, description: 'Успешный ответ' })
    @Get(':id/dishes')
    getDishes(
        @Param('id') restaurantId: string,
        @Query('category') category?: string,
        @Query('available') available?: boolean,
        @Query('sort') sort?: 'asc' | 'desc',
    ) {
        return this.restaurantsService.getDishesByRestaurant(+restaurantId, { category, available, sort });
    }
}
