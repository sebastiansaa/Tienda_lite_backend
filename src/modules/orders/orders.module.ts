import { Module } from '@nestjs/common';
import { OrdersController } from './api/controller/orders.controller';
import { CreateOrderUsecase } from './app/usecases/create-order.usecase';
import { OrderPrismaRepository } from './infra/repository/order-prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [OrdersController],
    providers: [CreateOrderUsecase, OrderPrismaRepository, PrismaService],
    exports: [CreateOrderUsecase],
})
export class OrdersModule { }
