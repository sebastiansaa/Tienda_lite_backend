import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import {
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase
} from '../../application/usecases';
import { CreateCategoryCommand } from '../../application/commands/create-category.command';
import { UpdateCategoryCommand } from '../../application/commands/update-category.command';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly createUseCase: CreateCategoryUseCase,
        private readonly updateUseCase: UpdateCategoryUseCase,
        private readonly getUseCase: GetCategoryUseCase,
        private readonly listUseCase: ListCategoriesUseCase,
        private readonly deleteUseCase: DeleteCategoryUseCase
    ) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        const command = new CreateCategoryCommand(
            createCategoryDto.title,
            createCategoryDto.slug,
            createCategoryDto.image,
            createCategoryDto.description,
            createCategoryDto.active,
            createCategoryDto.sortOrder
        );
        return this.createUseCase.execute(command);
    }

    @Get()
    findAll() {
        return this.listUseCase.execute();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getUseCase.execute(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        const command = new UpdateCategoryCommand(
            id,
            updateCategoryDto.title,
            updateCategoryDto.slug,
            updateCategoryDto.image,
            updateCategoryDto.description,
            updateCategoryDto.active,
            updateCategoryDto.sortOrder
        );
        return this.updateUseCase.execute(command);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}
