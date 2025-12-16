import { Test, TestingModule } from '@nestjs/testing';
import { SaveProductUsecase } from '../../app/usecases/save-product.usecase';
import { IProductWriteRepository } from '../../app/ports/product-write.repository';
import { IProductReadRepository } from '../../app/ports/product-read.repository';
import { ProductCategoryPolicy } from '../../app/policies/product-category.policy';
import { SaveProductCommand } from '../../app/commands/save-product.command';
import { ProductEntity } from '../../domain/entity/product.entity';

describe('SaveProductUsecase Integration', () => {
    let usecase: SaveProductUsecase;
    let readRepo: IProductReadRepository;
    let writeRepo: IProductWriteRepository;
    let categoryPolicy: ProductCategoryPolicy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SaveProductUsecase,
                {
                    provide: 'IProductReadRepository', // Usamos string injection token simplificado para este mock
                    useValue: {
                        findById: jest.fn(),
                    },
                },
                {
                    provide: 'IProductWriteRepository',
                    useValue: {
                        save: jest.fn(),
                    },
                },
                {
                    provide: 'ProductCategoryPolicy', // Token class simplificado
                    useValue: {
                        ensureCategoryExists: jest.fn(),
                    },
                },
                // Mapeo real de dependencias para el Usecase explícito si es necesario
                {
                    provide: SaveProductUsecase,
                    useFactory: (read, write, cat) => new SaveProductUsecase(read, write, cat),
                    inject: ['IProductReadRepository', 'IProductWriteRepository', 'ProductCategoryPolicy']
                }
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

        const expectedEntity = expect.any(ProductEntity);
        // Mock de save que devuelve lo que recibe (simulado) pero con ID
        (writeRepo.save as jest.Mock).mockImplementation(async (entity) => {
            // Simulamos que la BD asigna ID
            // Hack para acceder a propiedad privada idValue 
            // En un test real de integración con BD esto no es necesario, pero aquí mockeamos el repo
            return entity;
        });

        await usecase.execute(command);

        expect(categoryPolicy.ensureCategoryExists).toHaveBeenCalledWith(1);
        expect(writeRepo.save).toHaveBeenCalledWith(expectedEntity);
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
