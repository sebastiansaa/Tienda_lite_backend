import type { Prisma } from '@prisma/client';
import { OrderEntity } from '../../domain/entity/order.entity';
import type { OrderItemProps } from '../../domain/entity/order-item.entity';

const mapItemsFromJson = (items: unknown): OrderItemProps[] => {
    if (!Array.isArray(items)) return [];
    return items.map((raw) => {
        const productId = Number((raw as any)?.productId);
        const quantity = Number((raw as any)?.quantity);
        const priceValue = (raw as any)?.price;
        const price = priceValue === undefined || priceValue === null ? 0 : Number(priceValue);
        return { productId, quantity, price };
    });
};

export const orderPrismaToDomain = (record: any | null): OrderEntity | null => {
    if (!record) return null;
    return new OrderEntity({
        id: record.id,
        userId: record.userId,
        status: record.status as any,
        items: mapItemsFromJson(record.items),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    });
};

export const orderDomainToPrisma = (order: OrderEntity): Prisma.OrderUncheckedCreateInput => ({
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
    })),
    createdAt: order.createdAt as any,
    updatedAt: order.updatedAt as any,
} as any);
