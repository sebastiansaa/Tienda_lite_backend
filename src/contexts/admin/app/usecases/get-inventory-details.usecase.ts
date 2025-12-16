import InventoryAdminReadOnlyPort, { AdminInventorySummary } from '../ports/inventory-admin.readonly.port';

export class GetAdminInventoryDetailsUsecase {
    constructor(private readonly inventoryPort: InventoryAdminReadOnlyPort) { }

    execute(productId: number) {
        return this.inventoryPort.getByProductId(productId);
    }
}

export default GetAdminInventoryDetailsUsecase;
