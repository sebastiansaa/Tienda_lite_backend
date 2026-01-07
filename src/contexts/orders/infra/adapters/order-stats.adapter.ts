import { Injectable } from '@nestjs/common';
import { OrderStatsPort } from '../../../admin/app/ports/order-stats.port';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class OrderStatsAdapter implements OrderStatsPort {
    constructor(private readonly prisma: PrismaService) { }

    async countTotal(): Promise<number> {
        return this.prisma.order.count();
    }

    async sumRevenue(status: string): Promise<number> {
        const result = await this.prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                status: status as any,
            },
        });
        return result._sum.totalAmount || 0;
    }

    async countByStatus(status: string): Promise<number> {
        return this.prisma.order.count({
            where: {
                status: status as any,
            },
        });
    }
}
