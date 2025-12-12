import GetStockQuery from '../queries/get-stock.query';
import InventoryRepositoryPort from '../ports/inventory.repository.port';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';

export class GetStockUsecase {
    constructor(private readonly inventoryRepo: InventoryRepositoryPort) { }

    async execute(query: GetStockQuery): Promise<InventoryItemEntity | null> {
        return this.inventoryRepo.findByProductId(query.productId);
    }
}

export default GetStockUsecase;
