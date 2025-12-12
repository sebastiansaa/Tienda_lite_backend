import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { InsufficientStockError } from '../../domain/errors/inventory.errors';
import IncreaseStockCommand from '../commands/increase-stock.command';
import InventoryRepositoryPort from '../ports/inventory.repository.port';
import ProductReadOnlyPort from '../ports/product-read.port';

export class IncreaseStockUsecase {
    constructor(
        private readonly inventoryRepo: InventoryRepositoryPort,
        private readonly productRead: ProductReadOnlyPort,
    ) { }

    async execute(cmd: IncreaseStockCommand): Promise<InventoryItemEntity> {
        const product = await this.productRead.findById(cmd.productId);
        if (!product) throw new InsufficientStockError('Product not found');

        const existing = await this.inventoryRepo.findByProductId(cmd.productId);
        const item = existing ?? new InventoryItemEntity({ productId: cmd.productId, onHand: 0, reserved: 0 });

        const movement = item.increase(cmd.quantity, cmd.reason);
        const saved = await this.inventoryRepo.save(item);
        await this.inventoryRepo.addMovement(movement);
        return saved;
    }
}

export default IncreaseStockUsecase;
