import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICartRepository } from '../../domain/interfaces/cart.repository';
import { CartEntity } from '../../domain/entity/cart.entity';
import { prismaToCartEntity } from '../mappers/prisma-to-entity.mapper';

@Injectable()
export class CartPrismaRepository implements ICartRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByUserId(userId: string): Promise<CartEntity | null> {
        const found = await this.prisma.cart.findUnique({ where: { userId } });
        return prismaToCartEntity(found);
    }

    async save(cart: CartEntity): Promise<CartEntity> {
        const upserted = await this.prisma.cart.upsert({ where: { userId: cart.userId }, create: { id: cart.id, userId: cart.userId, items: cart.items as any }, update: { items: cart.items as any } });
        return prismaToCartEntity(upserted);
    }
}
