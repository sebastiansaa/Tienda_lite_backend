import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import InventoryRepositoryPort from '../../application/ports/inventory.repository.port';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';
import { inventoryItemToPrisma, prismaToInventoryItem, movementToPrisma, prismaToMovement } from '../mappers/inventory-prisma.mapper';

@Injectable()
export class InventoryPrismaRepository implements InventoryRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findByProductId(productId: number): Promise<InventoryItemEntity | null> {
        const record = await this.prisma.inventoryItem.findUnique({ where: { productId } });
        return prismaToInventoryItem(record);
    }

    async save(item: InventoryItemEntity): Promise<InventoryItemEntity> {
        const data = inventoryItemToPrisma(item);
        const upserted = await this.prisma.inventoryItem.upsert({
            where: { productId: data.productId },
            create: data,
            update: data,
        });
        return prismaToInventoryItem(upserted)!;
    }

    async addMovement(movement: StockMovementEntity): Promise<void> {
        const data = movementToPrisma(movement);
        await this.prisma.stockMovement.create({ data });
    }

    async listMovements(productId: number): Promise<StockMovementEntity[]> {
        const records = await this.prisma.stockMovement.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
        return records.map(prismaToMovement);
    }
}

export default InventoryPrismaRepository;
