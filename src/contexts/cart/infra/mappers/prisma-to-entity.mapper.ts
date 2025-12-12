import type { Prisma, Cart } from '@prisma/client';
import { CartEntity } from '../../domain/entity/cart.entity';
import type { CartItemProps } from '../../domain/entity/cart-item.entity';

const mapItemsFromJson = (items: Prisma.JsonValue): CartItemProps[] => {
    if (!Array.isArray(items)) return [];
    return items.map((raw) => {
        if (!raw || typeof raw !== 'object') return { productId: 0, quantity: 0, price: undefined };
        const obj = raw as Record<string, unknown>;
        const productId = Number(obj.productId);
        const quantity = Number(obj.quantity);
        const priceValue = obj.price;
        const price = priceValue === undefined || priceValue === null ? undefined : Number(priceValue);
        return { productId, quantity, price };
    });
};

export const prismaToCartEntity = (record: Cart | null): CartEntity | null => {
    if (!record) return null;
    return new CartEntity({
        id: record.id,
        userId: record.userId,
        items: mapItemsFromJson(record.items),
    });
};

export const cartToPrisma = (cart: CartEntity): { id: string; userId: string; items: Prisma.InputJsonValue } => ({
    id: cart.id,
    userId: cart.userId,
    items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
    })) as Prisma.InputJsonValue,
});
