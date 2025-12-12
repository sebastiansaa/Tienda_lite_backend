import { SaveProductCommand } from '../commands/save-product.command';
import { IProductRepository } from '../ports/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';
import { ProductProps } from '../../domain/interfaces/productProp';
import { ProductCategoryService } from '../../domain/service/product-category.service';

export class SaveProductUsecase {
    constructor(private readonly repo: IProductRepository, private readonly categoryService?: ProductCategoryService) { }

    async execute(cmd: SaveProductCommand): Promise<ProductEntity> {
        const payload: Readonly<Partial<ProductProps>> = cmd.payload;

        // Update flow
        if (typeof payload.id === 'number') {
            const existing = await this.repo.findById(payload.id);
            if (!existing) throw new Error(`Product ${payload.id} not found`);

            // Partial safe updates
            if (payload.title !== undefined) existing.rename(payload.title);
            if (payload.price !== undefined) existing.changePrice(payload.price);
            if (payload.slug !== undefined) existing.changeSlug(payload.slug);
            if (payload.description !== undefined) existing.changeDescription(payload.description);
            if (payload.images !== undefined) existing.replaceImages(payload.images);
            if (payload.stock !== undefined) existing.setStock(payload.stock);

            if (payload.active !== undefined) {
                if (payload.active && !existing.active) existing.restore();
                if (!payload.active && existing.active) existing.remove();
            }

            return this.repo.save(existing);
        }

        // Create flow - ensure required fields exist (strict checks)
        if (payload.title === undefined) throw new Error('Missing required field: title');
        if (payload.slug === undefined) throw new Error('Missing required field: slug');
        if (payload.price === undefined) throw new Error('Missing required field: price');
        if (payload.images === undefined) throw new Error('Missing required field: images');
        if (payload.categoryId === undefined) throw new Error('Missing required field: categoryId');

        // Ensure category exists (if service provided)
        if (this.categoryService) {
            await this.categoryService.ensureCategoryExists(payload.categoryId);
        }

        const entity = ProductEntity.create({
            id: payload.id,
            title: payload.title as string,
            slug: payload.slug as string,
            price: payload.price as number,
            description: payload.description ?? '',
            stock: payload.stock ?? 0,
            active: payload.active ?? true,
            images: payload.images as string[],
            categoryId: payload.categoryId as number,
            deletedAt: payload.deletedAt ?? undefined,
        });

        return this.repo.save(entity);
    }
}
