import {
    Controller, Get, Param, ParseIntPipe, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from '../dtos/index';
import {
    GetCategoryUseCase,
    ListCategoriesUseCase,
} from '../../app/usecases';
import { CategoryApiMapper } from '../mappers/category-api.mapper';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';

@ApiTags('categories')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly getUseCase: GetCategoryUseCase,
        private readonly listUseCase: ListCategoriesUseCase,
    ) { }

    @Get()
    @ResponseMessage('Categories retrieved successfully')
    @ApiOperation({ summary: 'List all categories' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [CategoryResponseDto] })
    async findAll(): Promise<CategoryResponseDto[]> {
        const entities = await this.listUseCase.execute();
        return CategoryApiMapper.toResponseList(entities);
    }

    @Get(':id')
    @ResponseMessage('Category details retrieved successfully')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ status: 200, description: 'Category found', type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
        const entity = await this.getUseCase.execute(id);
        return CategoryApiMapper.toResponseDto(entity);
    }
}