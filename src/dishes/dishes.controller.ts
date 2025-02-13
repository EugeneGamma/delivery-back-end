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
import {UpdateDishDto} from "./dto/update-dish.dto";
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('dishes')
export class DishesController {
    constructor(private readonly dishesService: DishesService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
    findAll() {
        return this.dishesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.dishesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
        return this.dishesService.update(+id, updateDishDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.dishesService.remove(+id);
    }
}