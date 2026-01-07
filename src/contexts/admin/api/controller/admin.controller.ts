import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import { GetDashboardStatsUsecase } from '../../app/usecases/get-dashboard-stats.usecase';
import { DashboardStatsResponseDto } from '../dtos/response/dashboard-stats.response.dto';

// Ports
import type { UserAdminPort } from '../../app/ports/user-admin.port';
import type { ProductAdminPort } from '../../app/ports/product-admin.port';
import type { CategoryAdminPort } from '../../app/ports/category-admin.port';
import type { InventoryAdminPort } from '../../app/ports/inventory-admin.port';
import type { OrdersAdminPort } from '../../app/ports/orders-admin.port';
import type { PaymentAdminPort } from '../../app/ports/payment-admin.port';

// Domain DTOs
import { UserResponseDto } from '../../../user/api/dtos/response/user.response.dto';
import { SaveProductRequestDto } from '../../../products/api/dtos/request/save-product.request.dto';
import { ResponseProductDto } from '../../../products/api/dtos/response/response-product.dto';
import { CreateCategoryDto } from '../../../categories/api/dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../../../categories/api/dtos/request/update-category.dto';
import { CategoryResponseDto } from '../../../categories/api/dtos/response/category.response.dto';
import { StockResponseDto } from '../../../inventory/api/dtos/response/stock.response.dto';
import { StockMovementResponseDto } from '../../../inventory/api/dtos/response/stock-movement.response.dto';
import { OrderResponseDto } from '../../../orders/api/dtos/response/order.response.dto';
import { PaymentResponseDto } from '../../../payment/api/dtos/response/payment.response.dto';
import { ChangeStatusDto } from '../../../user/api/dtos/request/change-status.dto';
import { UpdateStockDto } from '../dtos/request/update-stock.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly getDashboardStats: GetDashboardStatsUsecase,
        @Inject('UserAdminPort') private readonly userAdmin: UserAdminPort,
        @Inject('ProductAdminPort') private readonly productAdmin: ProductAdminPort,
        @Inject('CategoryAdminPort') private readonly categoryAdmin: CategoryAdminPort,
        @Inject('InventoryAdminPort') private readonly inventoryAdmin: InventoryAdminPort,
        @Inject('OrdersAdminPort') private readonly ordersAdmin: OrdersAdminPort,
        @Inject('PaymentAdminPort') private readonly paymentAdmin: PaymentAdminPort,
    ) { }

    @Get('dashboard')
    @ResponseMessage('Dashboard stats retrieved successfully')
    @ApiOperation({ summary: 'Obtener estadisticas del dashboard' })
    @ApiResponse({ status: 200, type: DashboardStatsResponseDto })
    async getStats(): Promise<DashboardStatsResponseDto> {
        return this.getDashboardStats.execute();
    }

    // User Admin
    @Get('users')
    @ResponseMessage('Users listed successfully')
    @ApiOperation({ summary: 'Listar usuarios (admin)' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async listUsers(): Promise<UserResponseDto[]> {
        return this.userAdmin.listUsers();
    }

    @Get('users/:id')
    @ResponseMessage('User profile retrieved successfully')
    @ApiOperation({ summary: 'Obtener perfil de usuario (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async getUser(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userAdmin.getProfile(id);
    }

    @Patch('users/:id/status')
    @ResponseMessage('User status updated successfully')
    @ApiOperation({ summary: 'Cambiar estado de usuario (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async changeUserStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto): Promise<UserResponseDto> {
        return this.userAdmin.changeStatus(id, dto.status);
    }

    // Product Admin
    @Post('products')
    @ResponseMessage('Product saved successfully')
    @ApiOperation({ summary: 'Crear o actualizar producto (admin)' })
    @ApiResponse({ status: 201, type: ResponseProductDto })
    async saveProduct(@Body() dto: SaveProductRequestDto): Promise<ResponseProductDto> {
        return this.productAdmin.save(dto);
    }

    @Get('products/low-stock')
    @ResponseMessage('Low stock products retrieved successfully')
    @ApiOperation({ summary: 'Productos con bajo stock (admin)' })
    @ApiResponse({ status: 200, type: [ResponseProductDto] })
    async lowStock(@Query('threshold', ParseIntPipe) threshold: number = 5): Promise<ResponseProductDto[]> {
        return this.productAdmin.findLowStock(threshold);
    }

    @Put('products/:id/stock')
    @ResponseMessage('Stock updated successfully')
    @ApiOperation({ summary: 'Actualizar stock (admin)' })
    @ApiResponse({ status: 200, type: ResponseProductDto })
    async updateStock(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStockDto): Promise<ResponseProductDto> {
        return this.productAdmin.updateStock(id, dto.quantity);
    }

    @Delete('products/:id')
    @ResponseMessage('Product deleted successfully')
    @ApiOperation({ summary: 'Eliminar producto (admin)' })
    @ApiResponse({ status: 200, description: 'Producto eliminado' })
    async deleteProduct(@Param('id', ParseIntPipe) id: number, @Query('hard') hard?: string): Promise<void> {
        await this.productAdmin.delete(id, hard !== 'true');
    }

    @Post('products/:id/restore')
    @ResponseMessage('Product restored successfully')
    @ApiOperation({ summary: 'Restaurar producto (admin)' })
    @ApiResponse({ status: 200, type: ResponseProductDto })
    async restoreProduct(@Param('id', ParseIntPipe) id: number): Promise<ResponseProductDto> {
        return this.productAdmin.restore(id);
    }

    // Category Admin
    @Post('categories')
    @ResponseMessage('Category created successfully')
    @ApiOperation({ summary: 'Crear categoría (admin)' })
    @ApiResponse({ status: 201, type: CategoryResponseDto })
    async createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
        return this.categoryAdmin.create(dto);
    }

    @Patch('categories/:id')
    @ResponseMessage('Category updated successfully')
    @ApiOperation({ summary: 'Actualizar categoría (admin)' })
    @ApiResponse({ status: 200, type: CategoryResponseDto })
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        return this.categoryAdmin.update(id, dto);
    }

    @Delete('categories/:id')
    @ResponseMessage('Category deleted successfully')
    @ApiOperation({ summary: 'Eliminar categoría (admin)' })
    @ApiResponse({ status: 200, description: 'Categoría eliminada' })
    async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.categoryAdmin.delete(id);
    }

    // Inventory Admin
    @Post('inventory/:productId/increase')
    @ResponseMessage('Inventory increased successfully')
    @ApiOperation({ summary: 'Incrementar stock (admin)' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    async increaseStock(@Param('productId', ParseIntPipe) productId: number, @Body() dto: UpdateStockDto): Promise<StockResponseDto> {
        return this.inventoryAdmin.increase(productId, dto.quantity);
    }

    @Post('inventory/:productId/decrease')
    @ResponseMessage('Inventory decreased successfully')
    @ApiOperation({ summary: 'Disminuir stock (admin)' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    async decreaseStock(@Param('productId', ParseIntPipe) productId: number, @Body() dto: UpdateStockDto): Promise<StockResponseDto> {
        return this.inventoryAdmin.decrease(productId, dto.quantity);
    }

    @Get('inventory/:productId/movements')
    @ResponseMessage('Stock movements retrieved successfully')
    @ApiOperation({ summary: 'Listar movimientos de stock (admin)' })
    @ApiResponse({ status: 200, type: [StockMovementResponseDto] })
    async listMovements(@Param('productId', ParseIntPipe) productId: number): Promise<StockMovementResponseDto[]> {
        return this.inventoryAdmin.listMovements(productId);
    }

    // Order Admin
    @Get('orders')
    @ResponseMessage('Orders listed successfully')
    @ApiOperation({ summary: 'Listar todas las órdenes (admin)' })
    @ApiResponse({ status: 200, type: [OrderResponseDto] })
    async listOrders(): Promise<OrderResponseDto[]> {
        return this.ordersAdmin.listAll();
    }

    @Get('orders/:id')
    @ResponseMessage('Order retrieved successfully')
    @ApiOperation({ summary: 'Obtener detalle de orden (admin)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async getOrderById(@Param('id') id: string): Promise<OrderResponseDto> {
        return this.ordersAdmin.getById(id);
    }

    @Patch('orders/:id/complete')
    @ResponseMessage('Order completed successfully')
    @ApiOperation({ summary: 'Marcar orden como completada (admin)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async completeOrder(@Param('id') id: string): Promise<OrderResponseDto> {
        return this.ordersAdmin.complete(id);
    }

    // Payment Admin

    @Get('payments')
    @ResponseMessage('Payments listed successfully')
    @ApiOperation({ summary: 'Listar todos los pagos (admin)' })
    @ApiResponse({ status: 200, type: [PaymentResponseDto] })
    async listPayments(): Promise<PaymentResponseDto[]> {
        return this.paymentAdmin.listAll();
    }

    @Get('payments/:id')
    @ResponseMessage('Payment retrieved successfully')
    @ApiOperation({ summary: 'Obtener detalle de pago (admin)' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    async getPaymentById(@Param('id') id: string): Promise<PaymentResponseDto> {
        return this.paymentAdmin.getById(id);
    }

    @Post('products/:id/upload-image')
    @ResponseMessage('Product image uploaded successfully')
    @ApiOperation({ summary: 'Subir imagen de producto (admin)' })
    @ApiResponse({ status: 200, description: 'Imagen subida correctamente' })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './public/uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + extname(file.originalname));
            },
        }),
    }))
    async uploadProductImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return {
            productId: id,
            filename: file.filename,
            path: `/uploads/${file.filename}`,
        };
    }
}

export default AdminController;
