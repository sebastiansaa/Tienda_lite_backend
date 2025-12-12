import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';

import { CreateOrderFromItemsDto, OrderResponseDto } from '../dtos';
import OrderApiMapper from '../mappers/order-api.mapper';
import {
    CreateOrderFromCartUsecase,
    CreateOrderFromItemsUsecase,
    GetOrderByIdUsecase,
    ListOrdersForUserUsecase,
    CancelOrderUsecase,
    MarkOrderAsPaidUsecase,
    MarkOrderAsCompletedUsecase,
} from '../../application/usecases';
import { EmptyOrderError, InvalidOrderStateError, ProductUnavailableError, OrderOwnershipError } from '../../domain/errors/order.errors';
import CurrentUser from 'src/contexts/auth/api/decorators/current-user.decorator';

interface AuthenticatedUser {
    sub: string;
}

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly createFromCart: CreateOrderFromCartUsecase,
        private readonly createFromItems: CreateOrderFromItemsUsecase,
        private readonly getOrderById: GetOrderByIdUsecase,
        private readonly listOrdersForUser: ListOrdersForUserUsecase,
        private readonly cancelOrderUsecase: CancelOrderUsecase,
        private readonly markOrderAsPaidUsecase: MarkOrderAsPaidUsecase,
        private readonly markOrderAsCompletedUsecase: MarkOrderAsCompletedUsecase,
    ) { }

    @Post('from-cart')
    @ApiOperation({ summary: 'Crear una orden a partir del carrito del usuario autenticado' })
    @ApiResponse({ status: 201, type: OrderResponseDto })
    async createFromCartHandler(@CurrentUser() user: AuthenticatedUser): Promise<OrderResponseDto> {
        try {
            const command = OrderApiMapper.toCreateFromCartCommand(user.sub);
            const order = await this.createFromCart.execute(command);
            return OrderApiMapper.toResponse(order);
        } catch (error) {
            this.mapError(error);
        }
    }

    @Post()
    @ApiOperation({ summary: 'Crear una orden con items específicos' })
    @ApiResponse({ status: 201, type: OrderResponseDto })
    async createFromItemsHandler(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateOrderFromItemsDto,
    ): Promise<OrderResponseDto> {
        try {
            const command = OrderApiMapper.toCreateFromItemsCommand(user.sub, dto);
            const order = await this.createFromItems.execute(command);
            return OrderApiMapper.toResponse(order);
        } catch (error) {
            this.mapError(error);
        }
    }

    @Get()
    @ApiOperation({ summary: 'Listar órdenes del usuario autenticado' })
    @ApiResponse({ status: 200, type: [OrderResponseDto] })
    async list(@CurrentUser() user: AuthenticatedUser): Promise<OrderResponseDto[]> {
        const query = { userId: user.sub } as const;
        const orders = await this.listOrdersForUser.execute(query);
        return orders.map((o) => OrderApiMapper.toResponse(o));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una orden por ID (propiedad requerida)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async getById(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ): Promise<OrderResponseDto> {
        const query = { orderId: id, userId: user.sub } as const;
        const order = await this.getOrderById.execute(query);
        if (!order) throw new NotFoundException('Order not found');
        return OrderApiMapper.toResponse(order);
    }

    @Patch(':id/cancel')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cancelar una orden en estado PENDING' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async cancel(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ): Promise<OrderResponseDto> {
        try {
            const command = { orderId: id, userId: user.sub };
            const order = await this.cancelOrderUsecase.execute(command);
            if (!order) throw new NotFoundException('Order not found');
            return OrderApiMapper.toResponse(order);
        } catch (error) {
            this.mapError(error);
        }
    }

    @Patch(':id/pay')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Marcar una orden como pagada' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async markPaid(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ): Promise<OrderResponseDto> {
        try {
            const command = { orderId: id, userId: user.sub };
            const order = await this.markOrderAsPaidUsecase.execute(command);
            if (!order) throw new NotFoundException('Order not found');
            return OrderApiMapper.toResponse(order);
        } catch (error) {
            this.mapError(error);
        }
    }

    @Patch(':id/complete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Marcar una orden como completada (debe estar pagada)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async complete(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ): Promise<OrderResponseDto> {
        try {
            const command = { orderId: id, userId: user.sub };
            const order = await this.markOrderAsCompletedUsecase.execute(command);
            if (!order) throw new NotFoundException('Order not found');
            return OrderApiMapper.toResponse(order);
        } catch (error) {
            this.mapError(error);
        }
    }

    private mapError(error: unknown): never {
        if (error instanceof EmptyOrderError || error instanceof ProductUnavailableError) {
            throw new BadRequestException(error.message);
        }
        if (error instanceof InvalidOrderStateError) {
            throw new ConflictException(error.message);
        }
        if (error instanceof OrderOwnershipError) {
            throw new NotFoundException('Order not found');
        }
        throw error as Error;
    }
}
