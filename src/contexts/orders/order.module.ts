import { Module } from '@nestjs/common';
import { OrdersController } from './api/controller/orders.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { PrismaService } from '../../prisma/prisma.service';
import {
    CreateOrderFromCartUsecase,
    CreateOrderFromItemsUsecase,
    GetOrderByIdUsecase,
    ListOrdersForUserUsecase,
    CancelOrderUsecase,
    MarkOrderAsPaidUsecase,
    MarkOrderAsCompletedUsecase,
} from './app/usecases';
import { ORDER_CART_READONLY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE, ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY } from './constants';
import { OrderPrismaReadRepository } from './infra/persistence/order-prisma-read.repository';
import { OrderPrismaWriteRepository } from './infra/persistence/order-prisma-write.repository';
import CartReadOnlyAdapter from './infra/adapters/cart-read.adapter';
import ProductReadOnlyAdapter from './infra/adapters/product-read.adapter';
import PricingServiceAdapter from './infra/adapters/pricing-service.adapter';
import StockServiceAdapter from './infra/adapters/stock-service.adapter';
import { IOrderReadRepository } from './app/ports/order-read.repository';
import { IOrderWriteRepository } from './app/ports/order-write.repository';
import CartReadOnlyPort from './app/ports/cart-read.port';
import ProductReadOnlyPort from './app/ports/product-read.port';
import PricingServicePort from './app/ports/pricing.service.port';
import StockServicePort from './app/ports/stock.service.port';

@Module({
    imports: [AuthModule, ProductsModule],
    controllers: [OrdersController],
    providers: [
        PrismaService,
        {
            provide: ORDER_WRITE_REPOSITORY,
            useClass: OrderPrismaWriteRepository,
        },
        {
            provide: ORDER_READ_REPOSITORY,
            useClass: OrderPrismaReadRepository,
        },
        {
            provide: ORDER_CART_READONLY,
            useClass: CartReadOnlyAdapter,
        },
        {
            provide: ORDER_PRODUCT_READONLY,
            useClass: ProductReadOnlyAdapter,
        },
        {
            provide: ORDER_PRICING_SERVICE,
            useClass: PricingServiceAdapter,
        },
        {
            provide: ORDER_STOCK_SERVICE,
            useClass: StockServiceAdapter,
        },
        {
            provide: CreateOrderFromCartUsecase,
            useFactory: (
                writeRepo: IOrderWriteRepository,
                cart: CartReadOnlyPort,
                product: ProductReadOnlyPort,
                pricing: PricingServicePort,
                stock: StockServicePort,
            ) => new CreateOrderFromCartUsecase(writeRepo, cart, product, pricing, stock),
            inject: [ORDER_WRITE_REPOSITORY, ORDER_CART_READONLY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE],
        },
        {
            provide: CreateOrderFromItemsUsecase,
            useFactory: (
                writeRepo: IOrderWriteRepository,
                product: ProductReadOnlyPort,
                pricing: PricingServicePort,
                stock: StockServicePort,
            ) => new CreateOrderFromItemsUsecase(writeRepo, product, pricing, stock),
            inject: [ORDER_WRITE_REPOSITORY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE],
        },
        {
            provide: GetOrderByIdUsecase,
            useFactory: (readRepo: IOrderReadRepository) => new GetOrderByIdUsecase(readRepo),
            inject: [ORDER_READ_REPOSITORY],
        },
        {
            provide: ListOrdersForUserUsecase,
            useFactory: (readRepo: IOrderReadRepository) => new ListOrdersForUserUsecase(readRepo),
            inject: [ORDER_READ_REPOSITORY],
        },
        {
            provide: CancelOrderUsecase,
            useFactory: (readRepo: IOrderReadRepository, writeRepo: IOrderWriteRepository) => new CancelOrderUsecase(readRepo, writeRepo),
            inject: [ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY],
        },
        {
            provide: MarkOrderAsPaidUsecase,
            useFactory: (readRepo: IOrderReadRepository, writeRepo: IOrderWriteRepository) => new MarkOrderAsPaidUsecase(readRepo, writeRepo),
            inject: [ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY],
        },
        {
            provide: MarkOrderAsCompletedUsecase,
            useFactory: (readRepo: IOrderReadRepository, writeRepo: IOrderWriteRepository) => new MarkOrderAsCompletedUsecase(readRepo, writeRepo),
            inject: [ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY],
        },
    ],
    exports: [],
})
export class OrdersModule { }
