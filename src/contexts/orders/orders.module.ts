import { Module } from '@nestjs/common';
import { OrdersController } from './api/controller/orders.controller';
import { CreateOrderUsecase } from './app/usecases/create-order.usecase';
import { OrderPrismaRepository } from './infra/repository/order-prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductsModule } from '../products/api/products.module';
import { DecreaseStockUsecase } from '../products/application/usecases/decrease-stock.usecase';

@Module({
    controllers: [OrdersController],
    providers: [
        PrismaService,
        OrderPrismaRepository,
        {
            provide: CreateOrderUsecase,
            useFactory: (orderRepo: OrderPrismaRepository, decreaseStock: DecreaseStockUsecase) =>
                new CreateOrderUsecase(orderRepo, decreaseStock),
            inject: [OrderPrismaRepository, DecreaseStockUsecase],
        },
    ],
    imports: [ProductsModule],
    exports: [CreateOrderUsecase],
})
export class OrdersModule { }
