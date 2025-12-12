import type { Prisma, Cart } from '@prisma/client';
import { CartEntity } from '../../domain/entity/cart.entity';
import type { CartItemProps } from '../../domain/entity/cart-item.entity';

const mapItemsFromJson = (items: unknown): CartItemProps[] => {
    if (!Array.isArray(items)) return [];
    return items.map((raw) => {
        const productId = Number((raw as any)?.productId);
        const quantity = Number((raw as any)?.quantity);
        const priceValue = (raw as any)?.price;
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
    })),
});
