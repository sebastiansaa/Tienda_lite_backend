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

        return (cart.items as any[]).map((raw) => ({
            productId: Number(raw.productId),
            quantity: Number(raw.quantity),
            price: raw.price === undefined || raw.price === null ? undefined : Number(raw.price),
        }));
    }
}

export default CartReadOnlyAdapter;
