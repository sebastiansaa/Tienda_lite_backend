import InventoryAdminReadOnlyPort from '../ports/inventory-admin.port';

export class AdjustAdminStockUsecase {
    constructor(private readonly inventoryPort: InventoryAdminReadOnlyPort) { }

    execute(productId: number, quantity: number, reason: string) {
        return this.inventoryPort.adjustStock(productId, quantity, reason);
    }
}

export default AdjustAdminStockUsecase;
