import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @ApiOperation({ summary: 'Создание нового заказа' })
    @ApiResponse({ status: 201, description: 'Заказ успешно создан.' })
    @ApiResponse({ status: 400, description: 'Некорректные входные данные.' })
    @ApiBody({ type: CreateOrderDto })
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получение списка всех заказов' })
    @ApiResponse({ status: 200, description: 'Список заказов успешно получен.' })
    findAll() {
        return this.ordersService.findAll();
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Обновление статуса заказа' })
    @ApiResponse({ status: 200, description: 'Статус заказа успешно обновлён.' })
    @ApiResponse({ status: 404, description: 'Заказ не найден.' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'],
                    example: 'READY',
                },
            },
            required: ['status'],
        },
    })
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: OrderStatus,
    ) {
        return this.ordersService.updateStatus(+id, status);
    }
}
