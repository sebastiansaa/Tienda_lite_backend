import { CategoryEntity } from "../../domain/entity/category.entity";

export interface ICategoryRepository {
    save(category: CategoryEntity): Promise<CategoryEntity>;
    findById(id: number): Promise<CategoryEntity | null>;
    findBySlug(slug: string): Promise<CategoryEntity | null>;
    findAll(): Promise<CategoryEntity[]>;
    delete(id: number): Promise<void>;
}
