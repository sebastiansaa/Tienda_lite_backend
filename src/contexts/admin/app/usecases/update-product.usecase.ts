import ProductAdminReadOnlyPort, { AdminProductSummary } from '../ports/product-admin.readonly.port';

export class UpdateAdminProductUsecase {
    constructor(private readonly productPort: ProductAdminReadOnlyPort) { }

    execute(productId: number, data: Partial<Omit<AdminProductSummary, 'id' | 'createdAt' | 'updatedAt'>>) {
        return this.productPort.updateProduct(productId, data);
    }
}

export default UpdateAdminProductUsecase;
