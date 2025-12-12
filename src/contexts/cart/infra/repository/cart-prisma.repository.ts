import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CartRepositoryPort } from '../../application/ports/cart.repository';
import { CartEntity } from '../../domain/entity/cart.entity';
import { cartToPrisma, prismaToCartEntity } from '../mappers/prisma-to-entity.mapper';

@Injectable()
export class CartPrismaRepository implements CartRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findByUserId(userId: string): Promise<CartEntity | null> {
        const found = await this.prisma.cart.findUnique({ where: { userId } });
        return prismaToCartEntity(found);
    }

    async save(cart: CartEntity): Promise<CartEntity> {
        const data = cartToPrisma(cart);
        const upserted = await this.prisma.cart.upsert({
            where: { userId: data.userId },
            create: data,
            update: { items: data.items },
        });
        return prismaToCartEntity(upserted)!;
    }

    async clear(userId: string): Promise<void> {
        await this.prisma.cart.deleteMany({ where: { userId } });
    }
}
