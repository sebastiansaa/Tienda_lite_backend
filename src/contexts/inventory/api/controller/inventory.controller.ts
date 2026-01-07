import { Controller, Get, NotFoundException, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockResponseDto } from '../dtos';
import InventoryApiMapper from '../mappers/inventory-api.mapper';
import { GetStockUsecase, ListMovementsUsecase } from '../../app/usecases';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';

@ApiTags('inventory')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('inventory')
export class InventoryController {
    constructor(
        private readonly getStock: GetStockUsecase,
        private readonly listMovements: ListMovementsUsecase,
    ) { }

    @Get(':productId')
    @ResponseMessage('Stock information retrieved successfully')
    @ApiOperation({ summary: 'Get stock for a product' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    @ApiResponse({ status: 404, description: 'Stock not found for product' })
    async getByProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<StockResponseDto> {
        const query = InventoryApiMapper.toGetStockQuery(productId);
        const entity = await this.getStock.execute(query);
        if (!entity) throw new NotFoundException('Inventory not found for product');
        return InventoryApiMapper.toStockResponseDto(entity);
    }
}
