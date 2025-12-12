import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import { AdjustStockDto, StockMovementResponseDto, StockResponseDto } from '../dtos';
import InventoryApiMapper from '../mappers/inventory-api.mapper';
import {
    IncreaseStockUsecase,
    DecreaseStockUsecase,
    ReserveStockUsecase,
    ReleaseStockUsecase,
    GetStockUsecase,
    ListMovementsUsecase,
} from '../../application/usecases';
import { InsufficientStockError, InvalidMovementError, NegativeStockError } from '../../domain/errors/inventory.errors';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
    constructor(
        private readonly increaseStock: IncreaseStockUsecase,
        private readonly decreaseStock: DecreaseStockUsecase,
        private readonly reserveStock: ReserveStockUsecase,
        private readonly releaseStock: ReleaseStockUsecase,
        private readonly getStock: GetStockUsecase,
        private readonly listMovements: ListMovementsUsecase,
    ) { }

    @Get(':productId')
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

    @Get(':productId/movements')
    @ApiOperation({ summary: 'List stock movements for a product' })
    @ApiResponse({ status: 200, type: [StockMovementResponseDto] })
    async movements(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<StockMovementResponseDto[]> {
        const query = InventoryApiMapper.toListMovementsQuery(productId);
        const movements = await this.listMovements.execute(query);
        return InventoryApiMapper.toMovementResponseDtoList(movements);
    }

    @Post(':productId/increase')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Increase on-hand stock for a product' })
    @ApiResponse({ status: 201, type: StockResponseDto })
    async increase(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        try {
            const command = InventoryApiMapper.toIncreaseStockCommand(productId, dto);
            const entity = await this.increaseStock.execute(command);
            return InventoryApiMapper.toStockResponseDto(entity);
        } catch (error) {
            this.handleDomainError(error);
        }
    }

    @Post(':productId/decrease')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Decrease on-hand stock for a product' })
    @ApiResponse({ status: 201, type: StockResponseDto })
    async decrease(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        try {
            const command = InventoryApiMapper.toDecreaseStockCommand(productId, dto);
            const entity = await this.decreaseStock.execute(command);
            return InventoryApiMapper.toStockResponseDto(entity);
        } catch (error) {
            this.handleDomainError(error);
        }
    }

    @Post(':productId/reserve')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Reserve stock for a product' })
    @ApiResponse({ status: 201, type: StockResponseDto })
    async reserve(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        try {
            const command = InventoryApiMapper.toReserveStockCommand(productId, dto);
            const entity = await this.reserveStock.execute(command);
            return InventoryApiMapper.toStockResponseDto(entity);
        } catch (error) {
            this.handleDomainError(error);
        }
    }

    @Post(':productId/release')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Release reserved stock for a product' })
    @ApiResponse({ status: 201, type: StockResponseDto })
    async release(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        try {
            const command = InventoryApiMapper.toReleaseStockCommand(productId, dto);
            const entity = await this.releaseStock.execute(command);
            return InventoryApiMapper.toStockResponseDto(entity);
        } catch (error) {
            this.handleDomainError(error);
        }
    }

    private handleDomainError(error: unknown): never {
        if (error instanceof InsufficientStockError || error instanceof InvalidMovementError || error instanceof NegativeStockError) {
            throw new BadRequestException(error.message);
        }
        throw error as Error;
    }
}
