import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import OrderAdminReadOnlyPort, { AdminOrderSummary } from '../../app/ports/order-admin.readonly.port';

@Injectable()
export class AdminOrderPrismaAdapter implements OrderAdminReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async listOrders(): Promise<AdminOrderSummary[]> {
        const orders = await this.prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
        return orders.map((o) => this.toSummary(o));
    }

    async getOrderById(id: string): Promise<AdminOrderSummary | null> {
        const order = await this.prisma.order.findUnique({ where: { id } });
        return order ? this.toSummary(order) : null;
    }

    async cancel(id: string): Promise<AdminOrderSummary | null> {
        return this.updateStatus(id, 'CANCELLED');
    }

    async markShipped(id: string): Promise<AdminOrderSummary | null> {
        return this.updateStatus(id, 'SHIPPED');
    }

    async markCompleted(id: string): Promise<AdminOrderSummary | null> {
        return this.updateStatus(id, 'COMPLETED');
    }

    private async updateStatus(id: string, status: string): Promise<AdminOrderSummary | null> {
        try {
            const updated = await this.prisma.order.update({ where: { id }, data: { status } });
            return this.toSummary(updated);
        } catch {
            return null;
        }
    }

    private toSummary(order: { id: string; userId: string; status: string; totalAmount: number; createdAt: Date; updatedAt: Date }): AdminOrderSummary {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
}

export default AdminOrderPrismaAdapter;
