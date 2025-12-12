import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

export interface InventoryRepositoryPort {
    findByProductId(productId: number): Promise<InventoryItemEntity | null>;
    save(item: InventoryItemEntity): Promise<InventoryItemEntity>;
    addMovement(movement: StockMovementEntity): Promise<void>;
    listMovements(productId: number): Promise<StockMovementEntity[]>;
}

export default InventoryRepositoryPort;
