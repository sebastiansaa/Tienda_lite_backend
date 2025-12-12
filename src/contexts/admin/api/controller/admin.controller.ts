import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import { ChangeUserStatusDto, UpdateProductDto, AdjustStockDto } from '../dtos/request';
import {
    AdminUserResponseDto,
    AdminProductResponseDto,
    AdminOrderResponseDto,
    AdminPaymentResponseDto,
    AdminInventoryResponseDto,
} from '../dtos/response';
import AdminApiMapper from '../mappers/admin-api.mapper';
import {
    ListAdminUsersUsecase,
    GetAdminUserDetailsUsecase,
    ChangeAdminUserStatusUsecase,
    ListAdminProductsUsecase,
    GetAdminProductDetailsUsecase,
    UpdateAdminProductUsecase,
    ListAdminOrdersUsecase,
    GetAdminOrderDetailsUsecase,
    CancelAdminOrderUsecase,
    ShipAdminOrderUsecase,
    CompleteAdminOrderUsecase,
    ListAdminPaymentsUsecase,
    GetAdminPaymentDetailsUsecase,
    ListAdminInventoryUsecase,
    GetAdminInventoryDetailsUsecase,
    AdjustAdminStockUsecase,
} from '../../application/usecases';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly listUsers: ListAdminUsersUsecase,
        private readonly getUserDetails: GetAdminUserDetailsUsecase,
        private readonly changeUserStatus: ChangeAdminUserStatusUsecase,
        private readonly listProducts: ListAdminProductsUsecase,
        private readonly getProductDetails: GetAdminProductDetailsUsecase,
        private readonly updateProduct: UpdateAdminProductUsecase,
        private readonly listOrders: ListAdminOrdersUsecase,
        private readonly getOrderDetails: GetAdminOrderDetailsUsecase,
        private readonly cancelOrder: CancelAdminOrderUsecase,
        private readonly shipOrder: ShipAdminOrderUsecase,
        private readonly completeOrder: CompleteAdminOrderUsecase,
        private readonly listPayments: ListAdminPaymentsUsecase,
        private readonly getPaymentDetails: GetAdminPaymentDetailsUsecase,
        private readonly listInventory: ListAdminInventoryUsecase,
        private readonly getInventoryDetails: GetAdminInventoryDetailsUsecase,
        private readonly adjustStock: AdjustAdminStockUsecase,
    ) { }

    @Get('users')
    @ApiOperation({ summary: 'Listar usuarios' })
    @ApiResponse({ status: 200, type: [AdminUserResponseDto] })
    async listUsersHandler(): Promise<AdminUserResponseDto[]> {
        const users = await this.listUsers.execute();
        return AdminApiMapper.toUserResponseList(users);
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Detalle de usuario' })
    @ApiResponse({ status: 200, type: AdminUserResponseDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUser(@Param('id') id: string): Promise<AdminUserResponseDto> {
        const user = await this.getUserDetails.execute(id);
        if (!user) throw new NotFoundException('User not found');
        return AdminApiMapper.toUserResponse(user);
    }

    @Patch('users/:id/status')
    @ApiOperation({ summary: 'Cambiar estado de usuario' })
    @ApiResponse({ status: 200, type: AdminUserResponseDto })
    async changeStatusHandler(@Param('id') id: string, @Body() dto: ChangeUserStatusDto): Promise<AdminUserResponseDto> {
        const user = await this.changeUserStatus.execute(id, dto.status);
        if (!user) throw new NotFoundException('User not found');
        return AdminApiMapper.toUserResponse(user);
    }

    @Get('products')
    @ApiOperation({ summary: 'Listar productos' })
    @ApiResponse({ status: 200, type: [AdminProductResponseDto] })
    async listProductsHandler(): Promise<AdminProductResponseDto[]> {
        const products = await this.listProducts.execute();
        return AdminApiMapper.toProductResponseList(products);
    }

    @Get('products/:id')
    @ApiOperation({ summary: 'Detalle de producto' })
    @ApiResponse({ status: 200, type: AdminProductResponseDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async getProduct(@Param('id', ParseIntPipe) id: number): Promise<AdminProductResponseDto> {
        const product = await this.getProductDetails.execute(id);
        if (!product) throw new NotFoundException('Product not found');
        return AdminApiMapper.toProductResponse(product);
    }

    @Patch('products/:id')
    @ApiOperation({ summary: 'Actualizar producto parcialmente' })
    @ApiResponse({ status: 200, type: AdminProductResponseDto })
    async updateProductHandler(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto,
    ): Promise<AdminProductResponseDto> {
        const updated = await this.updateProduct.execute(id, dto);
        if (!updated) throw new NotFoundException('Product not found');
        return AdminApiMapper.toProductResponse(updated);
    }

    @Get('orders')
    @ApiOperation({ summary: 'Listar órdenes' })
    @ApiResponse({ status: 200, type: [AdminOrderResponseDto] })
    async listOrdersHandler(): Promise<AdminOrderResponseDto[]> {
        const orders = await this.listOrders.execute();
        return AdminApiMapper.toOrderResponseList(orders);
    }

    @Get('orders/:id')
    @ApiOperation({ summary: 'Detalle de orden' })
    @ApiResponse({ status: 200, type: AdminOrderResponseDto })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async getOrder(@Param('id') id: string): Promise<AdminOrderResponseDto> {
        const order = await this.getOrderDetails.execute(id);
        if (!order) throw new NotFoundException('Order not found');
        return AdminApiMapper.toOrderResponse(order);
    }

    @Post('orders/:id/cancel')
    @ApiOperation({ summary: 'Cancelar orden' })
    @ApiResponse({ status: 200, type: AdminOrderResponseDto })
    async cancelOrderHandler(@Param('id') id: string): Promise<AdminOrderResponseDto> {
        const order = await this.cancelOrder.execute(id);
        if (!order) throw new NotFoundException('Order not found');
        return AdminApiMapper.toOrderResponse(order);
    }

    @Post('orders/:id/ship')
    @ApiOperation({ summary: 'Marcar orden como enviada' })
    @ApiResponse({ status: 200, type: AdminOrderResponseDto })
    async shipOrderHandler(@Param('id') id: string): Promise<AdminOrderResponseDto> {
        const order = await this.shipOrder.execute(id);
        if (!order) throw new NotFoundException('Order not found');
        return AdminApiMapper.toOrderResponse(order);
    }

    @Post('orders/:id/complete')
    @ApiOperation({ summary: 'Completar orden' })
    @ApiResponse({ status: 200, type: AdminOrderResponseDto })
    async completeOrderHandler(@Param('id') id: string): Promise<AdminOrderResponseDto> {
        const order = await this.completeOrder.execute(id);
        if (!order) throw new NotFoundException('Order not found');
        return AdminApiMapper.toOrderResponse(order);
    }

    @Get('payments')
    @ApiOperation({ summary: 'Listar pagos' })
    @ApiResponse({ status: 200, type: [AdminPaymentResponseDto] })
    async listPaymentsHandler(): Promise<AdminPaymentResponseDto[]> {
        const payments = await this.listPayments.execute();
        return AdminApiMapper.toPaymentResponseList(payments);
    }

    @Get('payments/:id')
    @ApiOperation({ summary: 'Detalle de pago' })
    @ApiResponse({ status: 200, type: AdminPaymentResponseDto })
    @ApiResponse({ status: 404, description: 'Payment not found' })
    async getPayment(@Param('id') id: string): Promise<AdminPaymentResponseDto> {
        const payment = await this.getPaymentDetails.execute(id);
        if (!payment) throw new NotFoundException('Payment not found');
        return AdminApiMapper.toPaymentResponse(payment);
    }

    @Get('inventory')
    @ApiOperation({ summary: 'Listar inventario' })
    @ApiResponse({ status: 200, type: [AdminInventoryResponseDto] })
    async listInventoryHandler(): Promise<AdminInventoryResponseDto[]> {
        const items = await this.listInventory.execute();
        return AdminApiMapper.toInventoryResponseList(items);
    }

    @Get('inventory/:productId')
    @ApiOperation({ summary: 'Detalle de inventario por producto' })
    @ApiResponse({ status: 200, type: AdminInventoryResponseDto })
    @ApiResponse({ status: 404, description: 'Inventory not found' })
    async getInventory(@Param('productId', ParseIntPipe) productId: number): Promise<AdminInventoryResponseDto> {
        const item = await this.getInventoryDetails.execute(productId);
        if (!item) throw new NotFoundException('Inventory not found');
        return AdminApiMapper.toInventoryResponse(item);
    }

    @Patch('inventory/:productId/adjust')
    @ApiOperation({ summary: 'Ajustar stock manualmente' })
    @ApiResponse({ status: 200, type: AdminInventoryResponseDto })
    async adjustStockHandler(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<AdminInventoryResponseDto> {
        const item = await this.adjustStock.execute(productId, dto.quantity, dto.reason);
        if (!item) throw new NotFoundException('Inventory not found');
        return AdminApiMapper.toInventoryResponse(item);
    }
}

export default AdminController;
