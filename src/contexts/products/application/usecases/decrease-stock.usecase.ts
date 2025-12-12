import { IProductRepository } from '../ports/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class DecreaseStockUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(productId: number, quantity: number): Promise<ProductEntity> {
        return this.repo.decrementStock(productId, quantity);
    }
}
