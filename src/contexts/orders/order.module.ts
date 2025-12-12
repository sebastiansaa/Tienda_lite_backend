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
} from './application/usecases';
import { ORDER_REPOSITORY, ORDER_CART_READONLY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE } from './constants';
import PrismaOrderRepository from './infra/repository/order-prisma.repository';
import CartReadOnlyAdapter from './infra/adapters/cart-read.adapter';
import ProductReadOnlyAdapter from './infra/adapters/product-read.adapter';
import PricingServiceAdapter from './infra/adapters/pricing-service.adapter';
import StockServiceAdapter from './infra/adapters/stock-service.adapter';
import OrderRepositoryPort from './application/ports/order.repository';
import CartReadOnlyPort from './application/ports/cart-read.port';
import ProductReadOnlyPort from './application/ports/product-read.port';
import PricingServicePort from './application/ports/pricing.service.port';
import StockServicePort from './application/ports/stock.service.port';

@Module({
    imports: [AuthModule, ProductsModule],
    controllers: [OrdersController],
    providers: [
        PrismaService,
        {
            provide: ORDER_REPOSITORY,
            useClass: PrismaOrderRepository,
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
                repo: OrderRepositoryPort,
                cart: CartReadOnlyPort,
                product: ProductReadOnlyPort,
                pricing: PricingServicePort,
                stock: StockServicePort,
            ) => new CreateOrderFromCartUsecase(repo, cart, product, pricing, stock),
            inject: [ORDER_REPOSITORY, ORDER_CART_READONLY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE],
        },
        {
            provide: CreateOrderFromItemsUsecase,
            useFactory: (
                repo: OrderRepositoryPort,
                product: ProductReadOnlyPort,
                pricing: PricingServicePort,
                stock: StockServicePort,
            ) => new CreateOrderFromItemsUsecase(repo, product, pricing, stock),
            inject: [ORDER_REPOSITORY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE],
        },
        {
            provide: GetOrderByIdUsecase,
            useFactory: (repo: OrderRepositoryPort) => new GetOrderByIdUsecase(repo),
            inject: [ORDER_REPOSITORY],
        },
        {
            provide: ListOrdersForUserUsecase,
            useFactory: (repo: OrderRepositoryPort) => new ListOrdersForUserUsecase(repo),
            inject: [ORDER_REPOSITORY],
        },
        {
            provide: CancelOrderUsecase,
            useFactory: (repo: OrderRepositoryPort) => new CancelOrderUsecase(repo),
            inject: [ORDER_REPOSITORY],
        },
        {
            provide: MarkOrderAsPaidUsecase,
            useFactory: (repo: OrderRepositoryPort) => new MarkOrderAsPaidUsecase(repo),
            inject: [ORDER_REPOSITORY],
        },
        {
            provide: MarkOrderAsCompletedUsecase,
            useFactory: (repo: OrderRepositoryPort) => new MarkOrderAsCompletedUsecase(repo),
            inject: [ORDER_REPOSITORY],
        },
    ],
    exports: [],
})
export class OrdersModule { }
