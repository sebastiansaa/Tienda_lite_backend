import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import type OrderPurchaseHistoryPort from '../../../shared/ports/order-purchase-history.port';

const QUALIFIED_STATUSES = ['PAID', 'COMPLETED'];

@Injectable()
export class OrderPurchaseHistoryAdapter implements OrderPurchaseHistoryPort {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async hasUserPurchasedProduct(userId: string, productId: number): Promise<boolean> {
        const candidateOrders = await this.prisma.order.findMany({
            where: {
                userId,
                status: { in: QUALIFIED_STATUSES as any },
            },
            select: { items: true },
            take: 25,
        });

        return candidateOrders.some((order) => Array.isArray(order.items)
            && order.items.some((item: any) => item?.productId === productId));
    }
}

export default OrderPurchaseHistoryAdapter;