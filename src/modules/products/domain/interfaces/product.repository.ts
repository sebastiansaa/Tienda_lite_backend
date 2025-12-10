import { ProductEntity } from '../entity/product.entity';

export interface IProductRepository {
    create(product: ProductEntity): Promise<ProductEntity>;
    findById(id: string): Promise<ProductEntity | null>;
    findAll(): Promise<ProductEntity[]>;
}
