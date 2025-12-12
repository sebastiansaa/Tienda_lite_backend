import ProductAdminReadOnlyPort from '../ports/product-admin.port';

export class GetAdminProductDetailsUsecase {
    constructor(private readonly productPort: ProductAdminReadOnlyPort) { }

    execute(productId: number) {
        return this.productPort.getProductById(productId);
    }
}

export default GetAdminProductDetailsUsecase;
