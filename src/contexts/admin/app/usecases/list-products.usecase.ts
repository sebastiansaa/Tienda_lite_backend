import ProductAdminReadOnlyPort, { AdminProductSummary } from '../ports/product-admin.readonly.port';

export class ListAdminProductsUsecase {
    constructor(private readonly productPort: ProductAdminReadOnlyPort) { }

    execute() {
        return this.productPort.listProducts();
    }
}

export default ListAdminProductsUsecase;
