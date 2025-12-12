import { InvalidCategoryError } from '../../domain/errors/product.errors';
import { CategoryRepositoryPort } from '../../../shared/ports/category.repository';

export class ProductCategoryService {
    constructor(private readonly categoryRepo: CategoryRepositoryPort) { }

    async ensureCategoryExists(categoryId: number | string): Promise<void> {
        if (categoryId === undefined || categoryId === null) throw new InvalidCategoryError('categoryId is required');
        const found = await this.categoryRepo.findById(categoryId);
        if (!found) throw new InvalidCategoryError(`Category not found: ${categoryId}`);
    }
}

export default ProductCategoryService;
