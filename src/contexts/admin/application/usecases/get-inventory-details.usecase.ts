import InventoryAdminReadOnlyPort from '../ports/inventory-admin.port';

export class GetAdminInventoryDetailsUsecase {
    constructor(private readonly inventoryPort: InventoryAdminReadOnlyPort) { }

    execute(productId: number) {
        return this.inventoryPort.getByProductId(productId);
    }
}

export default GetAdminInventoryDetailsUsecase;
