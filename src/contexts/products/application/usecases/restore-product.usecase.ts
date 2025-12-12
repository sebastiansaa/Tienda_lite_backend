import { RestoreProductCommand } from '../commands/restore-product.command';
import { IProductRepository } from '../ports/product.repository';
import { ProductCategoryService } from '../../domain/service/product-category.service';

export class RestoreProductUsecase {
    constructor(private readonly repo: IProductRepository, private readonly categoryService?: ProductCategoryService) { }

    async execute(cmd: RestoreProductCommand): Promise<import('../../domain/entity/product.entity').ProductEntity> {
        // validate category of the product before restoring
        const existing = await this.repo.findById(cmd.id);
        if (!existing) throw new Error(`Product not found: ${cmd.id}`);
        if (this.categoryService) await this.categoryService.ensureCategoryExists(existing.categoryId);
        return this.repo.restoreById(cmd.id);
    }
}
