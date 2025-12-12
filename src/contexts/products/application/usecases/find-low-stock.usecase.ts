import { FindLowStockQuery } from '../queries/find-low-stock.query';
import { IProductRepository } from '../ports/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class FindLowStockUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(q: FindLowStockQuery): Promise<ProductEntity[]> {
        return this.repo.findLowStock(q.threshold);
    }
}
