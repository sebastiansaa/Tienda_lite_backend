import { ListProductsQuery } from '../queries/list-products.query';
import { IProductRepository } from '../ports/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class ListProductsUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(q?: ListProductsQuery): Promise<{ products: ProductEntity[]; total: number }> {
        return this.repo.findAll(q?.params);
    }
}
