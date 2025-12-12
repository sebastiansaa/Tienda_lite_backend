import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { InventoryController } from './api/controller/inventory.controller';
import { INVENTORY_PRODUCT_READONLY, INVENTORY_REPOSITORY } from './constants';
import { InventoryPrismaRepository } from './infra/repository/inventory-prisma.repository';
import { ProductReadOnlyAdapter } from './infra/adapters/product-read.adapter';
import {
    IncreaseStockUsecase,
    DecreaseStockUsecase,
    ReserveStockUsecase,
    ReleaseStockUsecase,
    GetStockUsecase,
    ListMovementsUsecase,
} from './application/usecases';
import InventoryRepositoryPort from './application/ports/inventory.repository.port';
import ProductReadOnlyPort from './application/ports/product-read.port';

@Module({
    imports: [AuthModule, ProductsModule, PrismaModule],
    controllers: [InventoryController],
    providers: [
        {
            provide: INVENTORY_REPOSITORY,
            useClass: InventoryPrismaRepository,
        },
        {
            provide: INVENTORY_PRODUCT_READONLY,
            useClass: ProductReadOnlyAdapter,
        },
        {
            provide: IncreaseStockUsecase,
            useFactory: (repo: InventoryRepositoryPort, productRead: ProductReadOnlyPort) => new IncreaseStockUsecase(repo, productRead),
            inject: [INVENTORY_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: DecreaseStockUsecase,
            useFactory: (repo: InventoryRepositoryPort, productRead: ProductReadOnlyPort) => new DecreaseStockUsecase(repo, productRead),
            inject: [INVENTORY_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: ReserveStockUsecase,
            useFactory: (repo: InventoryRepositoryPort, productRead: ProductReadOnlyPort) => new ReserveStockUsecase(repo, productRead),
            inject: [INVENTORY_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: ReleaseStockUsecase,
            useFactory: (repo: InventoryRepositoryPort, productRead: ProductReadOnlyPort) => new ReleaseStockUsecase(repo, productRead),
            inject: [INVENTORY_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: GetStockUsecase,
            useFactory: (repo: InventoryRepositoryPort) => new GetStockUsecase(repo),
            inject: [INVENTORY_REPOSITORY],
        },
        {
            provide: ListMovementsUsecase,
            useFactory: (repo: InventoryRepositoryPort) => new ListMovementsUsecase(repo),
            inject: [INVENTORY_REPOSITORY],
        },
    ],
})
export class InventoryModule { }
