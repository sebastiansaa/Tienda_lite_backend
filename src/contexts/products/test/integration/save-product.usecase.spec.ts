import { Test, TestingModule } from '@nestjs/testing';
import { SaveProductUsecase } from 'src/contexts/products/app/usecases/save-product.usecase';
import { IProductWriteRepository } from 'src/contexts/products/app/ports/product-write.repository';
import { IProductReadRepository } from 'src/contexts/products/app/ports/product-read.repository';
import { ProductCategoryPolicy } from 'src/contexts/products/app/policies/product-category.policy';
import { SaveProductCommand } from 'src/contexts/products/app/commands/save-product.command';
import { ProductEntity } from 'src/contexts/products/domain/entity/product.entity';

describe('SaveProductUsecase Integration', () => {
    let usecase: SaveProductUsecase;
    let readRepo: jest.Mocked<IProductReadRepository>;
    let writeRepo: jest.Mocked<IProductWriteRepository>;
    let categoryPolicy: jest.Mocked<ProductCategoryPolicy>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SaveProductUsecase,
                {
                    provide: 'IProductReadRepository',
                    useValue: { findById: jest.fn() },
                },
                {
                    provide: 'IProductWriteRepository',
                    useValue: { save: jest.fn() },
                },
                {
                    provide: 'ProductCategoryPolicy',
                    useValue: { ensureCategoryExists: jest.fn() },
                },
                {
                    provide: SaveProductUsecase,
                    useFactory: (read, write, cat) => new SaveProductUsecase(read, write, cat),
                    inject: ['IProductReadRepository', 'IProductWriteRepository', 'ProductCategoryPolicy'],
                },
            ],
        }).compile();

        usecase = module.get<SaveProductUsecase>(SaveProductUsecase);
        readRepo = module.get('IProductReadRepository');
        writeRepo = module.get('IProductWriteRepository');
        categoryPolicy = module.get('ProductCategoryPolicy');
    });

    it('debería ser definido', () => {
        expect(usecase).toBeDefined();
    });

    it('debería crear un producto nuevo exitosamente', async () => {
        const command = new SaveProductCommand({
            title: 'New Product',
            price: 100,
            slug: 'new-product',
            images: ['http://img.com/1.jpg'],
            categoryId: 1,
            stock: 10,
        });

        (writeRepo.save as jest.Mock).mockImplementation(async (entity) => entity);

        await usecase.execute(command);

        expect(categoryPolicy.ensureCategoryExists).toHaveBeenCalledWith(1);
        expect(writeRepo.save).toHaveBeenCalledWith(expect.any(ProductEntity));
    });

    it('debería fallar si categoryPolicy falla', async () => {
        const command = new SaveProductCommand({
            title: 'Fail Product',
            price: 100,
            slug: 'fail-product',
            images: ['http://img.com/1.jpg'],
            categoryId: 999,
        });

        (categoryPolicy.ensureCategoryExists as jest.Mock).mockRejectedValue(new Error('Category not found'));

        await expect(usecase.execute(command)).rejects.toThrow('Category not found');
        expect(writeRepo.save).not.toHaveBeenCalled();
    });
});