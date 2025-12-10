import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { dtoToCreateCategoryCommand } from '../mappers/dto-to-command.mapper';
import { CreateCategoryUsecase } from '../../app/usecases/create-category.usecase';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly usecase: CreateCategoryUsecase) { }

    @Post()
    async create(@Body() dto: CreateCategoryDto) {
        const cmd = dtoToCreateCategoryCommand(dto);
        return this.usecase.execute(cmd);
    }
}
