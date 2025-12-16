import InventoryAdminReadOnlyPort, { AdminInventorySummary } from '../ports/inventory-admin.readonly.port';

export class AdjustAdminStockUsecase {
    constructor(private readonly inventoryPort: InventoryAdminReadOnlyPort) { }

    execute(productId: number, quantity: number, reason: string) {
        return this.inventoryPort.adjustStock(productId, quantity, reason);
    }
}

export default AdjustAdminStockUsecase;
