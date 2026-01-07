import { Controller, Get, Param, Query, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchProductsRequestDto, ListProductsRequestDto } from '../dtos/request';
import { ListResponseProductDto, ResponseProductDto } from '../dtos/response';
import { ProductApiMapper } from '../mappers/product-api.mapper';
import {
  FindProductByIdUsecase,
  ListProductsUsecase,
  SearchProductsUsecase,
} from '../../app/usecases';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';

/**
 * Controlador para la exposición pública del catálogo de productos.
 * Permite la búsqueda, filtrado y visualización detallada de productos para los clientes.
 */
@ApiTags('products')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('products')
export class ProductsController {
  constructor(
    private readonly findProductByIdUsecase: FindProductByIdUsecase,
    private readonly listProductsUsecase: ListProductsUsecase,
    private readonly searchProductsUsecase: SearchProductsUsecase,
  ) { }

  /**
   * Obtiene una lista paginada de productos activos.
   * Soporta filtrado opcional por categoría mediante IDs válidos.
   */
  @Get()
  @ResponseMessage('Products retrieved successfully')
  @ApiOperation({ summary: 'Listar productos con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Productos recuperados exitosamente', type: ListResponseProductDto })
  @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos' })
  async list(@Query() dto: ListProductsRequestDto): Promise<ListResponseProductDto> {
    const query = ProductApiMapper.toListProductsQuery(dto);
    const { products, total } = await this.listProductsUsecase.execute(query);
    return {
      products: ProductApiMapper.toResponseDtoList(products),
      total,
    };
  }

  /**
   * Busca productos utilizando un término de búsqueda global.
   * La búsqueda se realiza de forma optimizada sobre títulos y descripciones.
   */
  @Get('search')
  @ResponseMessage('Products search results retrieved successfully')
  @ApiOperation({ summary: 'Buscar productos por nombre o descripción' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda recuperados', type: ListResponseProductDto })
  @ApiResponse({ status: 400, description: 'Término de búsqueda inválido' })
  async search(@Query() dto: SearchProductsRequestDto): Promise<ListResponseProductDto> {
    const query = ProductApiMapper.toSearchProductsQuery(dto);
    const { products, total } = await this.searchProductsUsecase.execute(query);
    return {
      products: ProductApiMapper.toResponseDtoList(products),
      total,
    };
  }

  /**
   * Obtiene el detalle extendido de un producto específico.
   * Retorna null o lanza un error 404 si el producto no existe en el catálogo.
   */
  @Get(':id')
  @ResponseMessage('Product details retrieved successfully')
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: ResponseProductDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'ID de producto inválido' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ResponseProductDto | null> {
    const query = ProductApiMapper.toFindProductByIdQuery(id);
    const entity = await this.findProductByIdUsecase.execute(query);
    return entity ? ProductApiMapper.toResponseDto(entity) : null;
  }
}