import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
    @ApiProperty({ example: 'Best Pizza Place' })
    name: string;

    @ApiPropertyOptional({ example: 'Описание ресторана...' })
    description?: string;

    @ApiPropertyOptional({ example: '/uploads/restaurant_main.jpg' })
    imageUrl?: string;

    @ApiPropertyOptional({ example: '/uploads/restaurant_thumb.jpg' })
    thumbnailUrl?: string;

    @ApiPropertyOptional({ example: '/uploads/restaurant_top.jpg' })
    topImageUrl?: string;
}
