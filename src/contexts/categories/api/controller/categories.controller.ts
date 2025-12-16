import {
    Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, HttpCode, HttpStatus, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dtos/index';
import {
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase
} from '../../app/usecases';
import { CategoryApiMapper } from '../mappers/category-api.mapper';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';

@ApiTags('categories')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryResponseDto })
    async create(@Body() dto: CreateCategoryDto) {
        const command = CategoryApiMapper.toCreateCommand(dto);
        const entity = await this.createUseCase.execute(command);
        return CategoryApiMapper.toResponseDto(entity);
    }

    @Get()
    @ApiOperation({ summary: 'List all categories' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [CategoryResponseDto] })
    async findAll(): Promise<CategoryResponseDto[]> {
        const entities = await this.listUseCase.execute();
        return CategoryApiMapper.toResponseList(entities);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ status: 200, description: 'Category found', type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
        const entity = await this.getUseCase.execute(id);
        return CategoryApiMapper.toResponseDto(entity);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update a category' })
    @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryResponseDto })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryDto
    ) {
        const command = CategoryApiMapper.toUpdateCommand(id, dto);
        return this.updateUseCase.execute(command).then((entity) => CategoryApiMapper.toResponseDto(entity));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiResponse({ status: 204, description: 'Category deleted successfully' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}