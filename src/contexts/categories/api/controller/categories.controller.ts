import {
    Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dtos/index';
import { CategoryEntity } from '../../domain/entity/category.entity';
import {
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase
} from '../../application/usecases';
import { CreateCategoryCommand } from '../../application/commands/create-category.command';
import { UpdateCategoryCommand } from '../../application/commands/update-category.command';

@ApiTags('categories')
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
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryResponseDto })
    async create(@Body() dto: CreateCategoryDto) {
        const command = new CreateCategoryCommand(
            dto.title,
            dto.slug,
            dto.image,
            dto.description,
            dto.active,
            dto.sortOrder
        );
        const entity = await this.createUseCase.execute(command);
        return this.toResponse(entity);
    }

    @Get()
    @ApiOperation({ summary: 'List all categories' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [CategoryResponseDto] })
    async findAll(): Promise<CategoryResponseDto[]> {
        const entities = await this.listUseCase.execute();
        return entities.map((e) => this.toResponse(e));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ status: 200, description: 'Category found', type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
        const entity = await this.getUseCase.execute(id);
        return this.toResponse(entity);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a category' })
    @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryResponseDto })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryDto
    ) {
        const command = new UpdateCategoryCommand(
            id,
            dto.title,
            dto.slug,
            dto.image,
            dto.description,
            dto.active,
            dto.sortOrder
        );
        return this.updateUseCase.execute(command).then((entity) => this.toResponse(entity));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category' })
    @ApiResponse({ status: 204, description: 'Category deleted successfully' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    private toResponse(entity: CategoryEntity): CategoryResponseDto {
        return {
            id: entity.id!,
            title: entity.title,
            slug: entity.slug,
            image: entity.image,
            description: entity.description ?? '',
            active: entity.active,
            sortOrder: entity.sortOrder,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
            deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
        };
    }
}