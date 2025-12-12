import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// DTOs
import { SaveProductRequestDto } from '../dtos/request/save-product.request.dto';
import { UpdateStockRequestDto } from '../dtos/request/update-stock.request.dto';
import { ListProductsRequestDto } from '../dtos/request/list-products.request.dto';
import { SearchProductsRequestDto } from '../dtos/request/search-products.request.dto';
import { ProductResponseDto } from '../dtos/response/product.response.dto';

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
  @ApiResponse({ status: 201, description: 'Product saved successfully', type: ProductResponseDto })
  async save(@Body() dto: SaveProductRequestDto): Promise<ProductResponseDto> {
    const command = ProductApiMapper.toSaveProductCommand(dto);
    const entity = await this.saveProductUsecase.execute(command);
    return ProductApiMapper.toResponseDto(entity);
  }

  @Get()
  @ApiOperation({ summary: 'List products with pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: [ProductResponseDto] })
  async list(@Query() dto: ListProductsRequestDto): Promise<ProductResponseDto[]> {
    const query = ProductApiMapper.toListProductsQuery(dto);
    const entities = await this.listProductsUsecase.execute(query);
    return ProductApiMapper.toResponseDtoList(entities);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by name' })
  @ApiResponse({ status: 200, description: 'Search results', type: [ProductResponseDto] })
  async search(@Query() dto: SearchProductsRequestDto): Promise<ProductResponseDto[]> {
    const query = ProductApiMapper.toSearchProductsQuery(dto);
    const entities = await this.searchProductsUsecase.execute(query);
    return ProductApiMapper.toResponseDtoList(entities);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Find products with low stock' })
  @ApiResponse({ status: 200, description: 'Low stock products', type: [ProductResponseDto] })
  async lowStock(@Query('threshold', ParseIntPipe) threshold: number = 5): Promise<ProductResponseDto[]> {
    const query = ProductApiMapper.toFindLowStockQuery(threshold);
    const entities = await this.findLowStockUsecase.execute(query);
    return ProductApiMapper.toResponseDtoList(entities);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto | null> {
    const query = ProductApiMapper.toFindProductByIdQuery(id);
    const entity = await this.findProductByIdUsecase.execute(query);
    return entity ? ProductApiMapper.toResponseDto(entity) : null;
  }

  @Put(':id/stock')
  @ApiOperation({ summary: 'Update product stock' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully', type: ProductResponseDto })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockRequestDto,
  ): Promise<ProductResponseDto> {
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
  @ApiResponse({ status: 200, description: 'Product restored successfully', type: ProductResponseDto })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const command = ProductApiMapper.toRestoreProductCommand(id);
    const entity = await this.restoreProductUsecase.execute(command);
    return ProductApiMapper.toResponseDto(entity);
  }
}