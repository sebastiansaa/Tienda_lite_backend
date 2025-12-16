import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import OrderReadOnlyPort from '../../app/ports/order-read.port';

@Injectable()
export class PaymentOrderReadAdapter implements OrderReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async findById(orderId: string): Promise<{ id: string; userId: string; totalAmount: number } | null> {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return null;
        return {
            id: order.id,
            userId: order.userId,
            totalAmount: order.totalAmount,
        };
    }
}

export default PaymentOrderReadAdapter;
