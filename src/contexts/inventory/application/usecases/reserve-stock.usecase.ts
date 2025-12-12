import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { InsufficientStockError } from '../../domain/errors/inventory.errors';
import ReserveStockCommand from '../commands/reserve-stock.command';
import InventoryRepositoryPort from '../ports/inventory.repository.port';
import ProductReadOnlyPort from '../ports/product-read.port';

export class ReserveStockUsecase {
    constructor(
        private readonly inventoryRepo: InventoryRepositoryPort,
        private readonly productRead: ProductReadOnlyPort,
    ) { }

    async execute(cmd: ReserveStockCommand): Promise<InventoryItemEntity> {
        const product = await this.productRead.findById(cmd.productId);
        if (!product) throw new InsufficientStockError('Product not found');

        const existing = await this.inventoryRepo.findByProductId(cmd.productId);
        if (!existing) throw new InsufficientStockError();

        const movement = existing.reserve(cmd.quantity, cmd.reason);
        const saved = await this.inventoryRepo.save(existing);
        await this.inventoryRepo.addMovement(movement);
        return saved;
    }
}

export default ReserveStockUsecase;
