import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import InventoryAdminReadOnlyPort, { AdminInventorySummary } from '../../app/ports/inventory-admin.readonly.port';

@Injectable()
export class AdminInventoryPrismaAdapter implements InventoryAdminReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async listInventory(): Promise<AdminInventorySummary[]> {
        const items = await this.prisma.inventoryItem.findMany({ orderBy: { updatedAt: 'desc' } });
        return items.map((i) => this.toSummary(i));
    }

    async getByProductId(productId: number): Promise<AdminInventorySummary | null> {
        const item = await this.prisma.inventoryItem.findUnique({ where: { productId } });
        return item ? this.toSummary(item) : null;
    }

    async adjustStock(productId: number, quantity: number, reason: string): Promise<AdminInventorySummary | null> {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.inventoryItem.findUnique({ where: { productId } });
            const now = new Date();
            const updated = existing
                ? await tx.inventoryItem.update({
                    where: { productId },
                    data: { onHand: existing.onHand + quantity, updatedAt: now },
                })
                : await tx.inventoryItem.create({
                    data: { productId, onHand: Math.max(quantity, 0), reserved: 0, createdAt: now, updatedAt: now },
                });

            await tx.stockMovement.create({
                data: {
                    inventoryItemId: updated.id,
                    productId,
                    type: 'ADMIN_ADJUST',
                    reason,
                    quantity,
                    onHandAfter: updated.onHand,
                    reservedAfter: updated.reserved,
                },
            });

            return this.toSummary(updated);
        });
    }

    private toSummary(item: { productId: number; onHand: number; reserved: number; updatedAt: Date }): AdminInventorySummary {
        return {
            productId: item.productId,
            onHand: item.onHand,
            reserved: item.reserved,
            available: item.onHand - item.reserved,
            updatedAt: item.updatedAt,
        };
    }
}

export default AdminInventoryPrismaAdapter;
