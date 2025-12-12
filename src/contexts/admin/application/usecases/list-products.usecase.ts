import ProductAdminReadOnlyPort from '../ports/product-admin.port';

export class ListAdminProductsUsecase {
    constructor(private readonly productPort: ProductAdminReadOnlyPort) { }

    execute() {
        return this.productPort.listProducts();
    }
}

export default ListAdminProductsUsecase;
