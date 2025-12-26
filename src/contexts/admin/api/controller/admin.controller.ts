import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import { GetDashboardStatsUsecase } from '../../app/usecases/get-dashboard-stats.usecase';
import { DashboardStatsResponseDto } from '../dtos/response/dashboard-stats.response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly getDashboardStats: GetDashboardStatsUsecase,
    ) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'obtener estadisticas del dashboard' })
    @ApiResponse({ status: 200, type: DashboardStatsResponseDto })
    async getStats(): Promise<DashboardStatsResponseDto> {
        const stats = await this.getDashboardStats.execute();
        return {
            totalUsers: stats.totalUsers,
            totalRevenue: stats.totalRevenue,
            totalOrders: stats.totalOrders,
            pendingOrdersCount: stats.pendingOrdersCount,
            lowStockProductsCount: stats.lowStockProductsCount,
        };
    }
}

export default AdminController;
