import { CategoryEntity } from '../entity/category.entity';

export interface ICategoryRepository {
    create(category: CategoryEntity): Promise<CategoryEntity>;
    findById(id: string): Promise<CategoryEntity | null>;
    findAll(): Promise<CategoryEntity[]>;
}
