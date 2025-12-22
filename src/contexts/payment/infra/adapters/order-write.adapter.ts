import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../../prisma/prisma.service';
import OrderWritePort from '../../app/ports/order-write.port';

// Minimal order writer for checkout-created payments
@Injectable()
export class PaymentOrderWriteAdapter implements OrderWritePort {
    constructor(private readonly prisma: PrismaService) { }

    async createCheckoutOrder(input: { userId: string; totalAmount: number; items?: any[] }) {
        const id = randomUUID();
        const created = await this.prisma.order.create({
            data: {
                id,
                userId: input.userId,
                totalAmount: input.totalAmount,
                items: input.items ?? [],
                status: 'PENDING',
            },
        });
        return { id: created.id, userId: created.userId, totalAmount: created.totalAmount };
    }
}

export default PaymentOrderWriteAdapter;
