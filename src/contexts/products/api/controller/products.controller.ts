import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SaveProductRequestDto, UpdateStockRequestDto, SearchProductsRequestDto, ListProductsRequestDto } from '../dtos/request';
import { ListResponseProductDto, ResponseProductDto } from '../dtos/response';

// Mapper
import { ProductApiMapper } from '../mappers/product-api.mapper';

// Usecases
import {
  SaveProductUsecase,
  DeleteProductUsecase,
  RestoreProductUsecase,
  UpdateStockUsecase,
  FindProductByIdUsecase,
  ListProductsUsecase,
  FindLowStockUsecase,
  SearchProductsUsecase,
} from '../../application/usecases';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly saveProductUsecase: SaveProductUsecase,
    private readonly deleteProductUsecase: DeleteProductUsecase,
    private readonly restoreProductUsecase: RestoreProductUsecase,
    private readonly updateStockUsecase: UpdateStockUsecase,
    private readonly findProductByIdUsecase: FindProductByIdUsecase,
    private readonly listProductsUsecase: ListProductsUsecase,
    private readonly findLowStockUsecase: FindLowStockUsecase,
    private readonly searchProductsUsecase: SearchProductsUsecase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create or update a product' })
  @ApiResponse({ status: 201, description: 'Product saved successfully', type: ResponseProductDto })
  async save(@Body() dto: SaveProductRequestDto): Promise<ResponseProductDto> {
    const command = ProductApiMapper.toSaveProductCommand(dto);
    const entity = await this.saveProductUsecase.execute(command);
    return ProductApiMapper.toResponseDto(entity);
  }

  @Get()
  @ApiOperation({ summary: 'List products with pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: ListResponseProductDto })
  async list(@Query() dto: ListProductsRequestDto): Promise<ListResponseProductDto> {
    const query = ProductApiMapper.toListProductsQuery(dto);
    const { products, total } = await this.listProductsUsecase.execute(query);
    return {
      products: ProductApiMapper.toResponseDtoList(products),
      total,
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by name' })
  @ApiResponse({ status: 200, description: 'Search results', type: ListResponseProductDto })
  async search(@Query() dto: SearchProductsRequestDto): Promise<ListResponseProductDto> {
    const query = ProductApiMapper.toSearchProductsQuery(dto);
    const { products, total } = await this.searchProductsUsecase.execute(query);
    return {
      products: ProductApiMapper.toResponseDtoList(products),
      total,
    };
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Find products with low stock' })
  @ApiResponse({ status: 200, description: 'Low stock products', type: [ResponseProductDto] })
  async lowStock(@Query('threshold', ParseIntPipe) threshold: number = 5): Promise<ResponseProductDto[]> {
    const query = ProductApiMapper.toFindLowStockQuery(threshold);
    const entities = await this.findLowStockUsecase.execute(query);
    return ProductApiMapper.toResponseDtoList(entities);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: ResponseProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ResponseProductDto | null> {
    const query = ProductApiMapper.toFindProductByIdQuery(id);
    const entity = await this.findProductByIdUsecase.execute(query);
    return entity ? ProductApiMapper.toResponseDto(entity) : null;
  }

  @Put(':id/stock')
  @ApiOperation({ summary: 'Update product stock' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully', type: ResponseProductDto })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockRequestDto,
  ): Promise<ResponseProductDto> {
    const command = ProductApiMapper.toUpdateStockCommand(id, dto.quantity);
    const entity = await this.updateStockUsecase.execute(command);
    return ProductApiMapper.toResponseDto(entity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (soft delete by default)' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('hard') hard?: string,
  ): Promise<void> {
    const softDelete = hard !== 'true'; // soft by default
    const command = ProductApiMapper.toDeleteProductCommand(id, softDelete);
    await this.deleteProductUsecase.execute(command);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted product' })
  @ApiResponse({ status: 200, description: 'Product restored successfully', type: ResponseProductDto })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<ResponseProductDto> {
    const command = ProductApiMapper.toRestoreProductCommand(id);
    const entity = await this.restoreProductUsecase.execute(command);
    return ProductApiMapper.toResponseDto(entity);
  }
}