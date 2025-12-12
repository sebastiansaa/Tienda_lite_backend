import { FindProductByIdQuery } from '../queries/find-product-by-id.query';
import { IProductRepository } from '../ports/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class FindProductByIdUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(q: FindProductByIdQuery): Promise<ProductEntity | null> {
        return this.repo.findById(q.id);
    }
}
