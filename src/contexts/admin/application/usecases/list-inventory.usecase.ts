import InventoryAdminReadOnlyPort from '../ports/inventory-admin.port';

export class ListAdminInventoryUsecase {
    constructor(private readonly inventoryPort: InventoryAdminReadOnlyPort) { }

    execute() {
        return this.inventoryPort.listInventory();
    }
}

export default ListAdminInventoryUsecase;
