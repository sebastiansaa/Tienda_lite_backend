import InventoryAdminReadOnlyPort, { AdminInventorySummary } from '../ports/inventory-admin.readonly.port';

export class ListAdminInventoryUsecase {
    constructor(private readonly inventoryPort: InventoryAdminReadOnlyPort) { }

    execute() {
        return this.inventoryPort.listInventory();
    }
}

export default ListAdminInventoryUsecase;
