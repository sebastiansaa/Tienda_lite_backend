import { Test, TestingModule } from '@nestjs/testing';
import { CartModule } from '../../cart.module';
import { PrismaService } from '../../../../prisma/prisma.service'; // Fixed
import { CART_READ_REPOSITORY, CART_WRITE_REPOSITORY } from '../../constants';
import { AddItemToCartUseCase } from '../../app/usecases/add-item-to-cart.usecase';
import { Module } from '@nestjs/common';
import { AuthModule } from '../../../auth/auth.module';
import { ProductsModule } from '../../../products/products.module';
import { PRODUCT_READONLY } from '../../../products/constants';

@Module({})
class MockAuthModule { }

@Module({
    providers: [
        {
            provide: PRODUCT_READONLY,
            useValue: { findDtoById: jest.fn() }
        }
    ],
    exports: [PRODUCT_READONLY]
})
class MockProductsModule { }

describe('Cart Context Sanity', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [CartModule],
        })
            .overrideModule(AuthModule).useModule(MockAuthModule)
            .overrideModule(ProductsModule).useModule(MockProductsModule)
            .overrideProvider(PrismaService)
            .useValue({ cart: { findUnique: jest.fn(), upsert: jest.fn(), deleteMany: jest.fn() } })
            .compile();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve Repositories', () => {
        const readRepo = module.get(CART_READ_REPOSITORY);
        const writeRepo = module.get(CART_WRITE_REPOSITORY);
        expect(readRepo).toBeDefined();
        expect(writeRepo).toBeDefined();
    });

    it('should resolve UseCases', () => {
        const useCase = module.get(AddItemToCartUseCase);
        expect(useCase).toBeDefined();
    });
});
