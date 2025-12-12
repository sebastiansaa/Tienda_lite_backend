import ListMovementsQuery from '../queries/list-movements.query';
import InventoryRepositoryPort from '../ports/inventory.repository.port';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

export class ListMovementsUsecase {
    constructor(private readonly inventoryRepo: InventoryRepositoryPort) { }

    async execute(query: ListMovementsQuery): Promise<StockMovementEntity[]> {
        return this.inventoryRepo.listMovements(query.productId);
    }
}

export default ListMovementsUsecase;
