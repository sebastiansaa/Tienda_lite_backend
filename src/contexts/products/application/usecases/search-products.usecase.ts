import { SearchProductsQuery } from '../queries/search-products.query';
import { IProductRepository } from '../ports/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class SearchProductsUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(q: SearchProductsQuery): Promise<ProductEntity[]> {
        return this.repo.searchByName(q.term);
    }
}
