import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

export interface DashboardStatsResult {
    totalUsers: number;
    totalRevenue: number;
    totalOrders: number;
    pendingOrdersCount: number;
    lowStockProductsCount: number;
}

@Injectable()
export class GetDashboardStatsUsecase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(): Promise<DashboardStatsResult> {
        const totalUsers = await this.prisma.user.count();

        const totalOrders = await this.prisma.order.count();

        const ordersRevenue = await this.prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                status: 'PAID',
            },
        });

        const pendingOrdersCount = await this.prisma.order.count({
            where: {
                status: 'PENDING',
            },
        });

        const lowStockThreshold = 10;
        const lowStockProductsCount = await this.prisma.product.count({
            where: {
                stock: {
                    lt: lowStockThreshold,
                },
            },
        });

        return {
            totalUsers,
            totalRevenue: ordersRevenue._sum.totalAmount || 0,
            totalOrders,
            pendingOrdersCount,
            lowStockProductsCount,
        };
    }
}
