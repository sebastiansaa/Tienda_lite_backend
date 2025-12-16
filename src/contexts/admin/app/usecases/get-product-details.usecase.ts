import ProductAdminReadOnlyPort, { AdminProductSummary } from '../ports/product-admin.readonly.port';

export class GetAdminProductDetailsUsecase {
    constructor(private readonly productPort: ProductAdminReadOnlyPort) { }

    execute(productId: number) {
        return this.productPort.getProductById(productId);
    }
}

export default GetAdminProductDetailsUsecase;
