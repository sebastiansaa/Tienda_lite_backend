import { CreateProductCommand } from '../commands/create-product.command';
import { IProductRepository } from '../../domain/interfaces/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class CreateProductUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(cmd: CreateProductCommand): Promise<ProductEntity> {
        const entity = new ProductEntity(Date.now().toString(), cmd.title, cmd.price, cmd.categoryId);
        return this.repo.create(entity);
    }
}
