import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../../prisma/prisma.service';
import OrderWritePort, { OrderWriteItem } from '../../app/ports/order-write.port';


@Injectable()
export class PaymentOrderWriteAdapter implements OrderWritePort {
    constructor(private readonly prisma: PrismaService) { }

    async createCheckoutOrder(input: { userId: string; totalAmount: number; items?: OrderWriteItem[] }) {
        const id = randomUUID();
        const created = await this.prisma.order.create({
            data: {
                id,
                userId: input.userId,
                totalAmount: input.totalAmount,
                items: (input.items ?? []) as unknown as Prisma.InputJsonValue,
                status: 'PENDING',
            },
        });
        return { id: created.id, userId: created.userId, totalAmount: created.totalAmount };
    }
}

export default PaymentOrderWriteAdapter;
