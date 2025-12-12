import { Module } from '@nestjs/common';
import { ProductsController } from './api/controller/products.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../auth/auth.module';

// Ports
import { IProductRepository } from './application/ports/product.repository';
import { PRODUCT_WRITE, PRODUCT_READONLY } from './constants';

// Infrastructure (implementación del port)
import { ProductPrismaWriteRepository } from './infra/repository/product-prisma.repository';
import { ProductPrismaReadRepository } from './infra/repository/product-prisma-read.repository';
import { ProductCategoryService } from './domain/service/product-category.service';
import { CategoryRepositoryPort } from 'src/contexts/shared/ports/category.repository';

// Usecases
import {
  SaveProductUsecase,
  DeleteProductUsecase,
  RestoreProductUsecase,
  UpdateStockUsecase,
  FindProductByIdUsecase,
  ListProductsUsecase,
  FindLowStockUsecase,
  SearchProductsUsecase,
} from './application/usecases';
import { DecreaseStockUsecase } from './application/usecases/decrease-stock.usecase';

@Module({
  imports: [CategoriesModule, AuthModule],
  controllers: [ProductsController],
  providers: [
    // Infrastructure
    PrismaService,
    {
      provide: PRODUCT_WRITE,
      useClass: ProductPrismaWriteRepository,
    },
    {
      provide: PRODUCT_READONLY,
      useClass: ProductPrismaReadRepository,
    },
    // Product domain service: use PrismaService to check categories without importing category infra
    {
      provide: ProductCategoryService,
      useFactory: (catRepo: CategoryRepositoryPort) => new ProductCategoryService(catRepo),
      inject: ['CategoryRepositoryPort'],
    },
    // Usecases (con inyección del port)
    {
      provide: SaveProductUsecase,
      useFactory: (repo: IProductRepository, categoryService: ProductCategoryService) => new SaveProductUsecase(repo, categoryService),
      inject: [PRODUCT_WRITE, ProductCategoryService],
    },
    {
      provide: DeleteProductUsecase,
      useFactory: (repo: IProductRepository) => new DeleteProductUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: RestoreProductUsecase,
      useFactory: (repo: IProductRepository, categoryService: ProductCategoryService) => new RestoreProductUsecase(repo, categoryService),
      inject: [PRODUCT_WRITE, ProductCategoryService],
    },
    {
      provide: UpdateStockUsecase,
      useFactory: (repo: IProductRepository) => new UpdateStockUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: FindProductByIdUsecase,
      useFactory: (repo: IProductRepository) => new FindProductByIdUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: ListProductsUsecase,
      useFactory: (repo: IProductRepository) => new ListProductsUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: FindLowStockUsecase,
      useFactory: (repo: IProductRepository) => new FindLowStockUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: SearchProductsUsecase,
      useFactory: (repo: IProductRepository) => new SearchProductsUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: DecreaseStockUsecase,
      useFactory: (repo: IProductRepository) => new DecreaseStockUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
  ],
  exports: [DecreaseStockUsecase, PRODUCT_READONLY],
})
export class ProductsModule { }
