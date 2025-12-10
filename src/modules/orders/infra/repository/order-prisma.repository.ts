import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IOrderRepository } from '../../domain/interfaces/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { prismaToOrderEntity } from '../mappers/prisma-to-entity.mapper';

@Injectable()
export class OrderPrismaRepository implements IOrderRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(order: OrderEntity): Promise<OrderEntity> {
        const created = await this.prisma.order.create({ data: { id: order.id, userId: order.userId, items: order.items as any, total: order.total } });
        return prismaToOrderEntity(created);
    }

    async findById(id: string): Promise<OrderEntity | null> {
        const found = await this.prisma.order.findUnique({ where: { id } });
        return prismaToOrderEntity(found);
    }
}
