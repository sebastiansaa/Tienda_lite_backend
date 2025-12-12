import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import CartReadOnlyPort, { CartItemSnapshot } from '../../application/ports/cart-read.port';

@Injectable()
export class CartReadOnlyAdapter implements CartReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async getCartItems(userId: string): Promise<CartItemSnapshot[]> {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) return [];
        if (!Array.isArray(cart.items)) return [];

        return cart.items.map((raw) => {
            if (!raw || typeof raw !== 'object') {
                return { productId: 0, quantity: 0, price: undefined };
            }
            const obj = raw as Record<string, unknown>;
            return {
                productId: Number(obj.productId),
                quantity: Number(obj.quantity),
                price: obj.price === undefined || obj.price === null ? undefined : Number(obj.price),
            };
        });
    }
}

export default CartReadOnlyAdapter;
