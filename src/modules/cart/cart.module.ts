import { Module } from '@nestjs/common';
import { CartController } from './api/controller/cart.controller';
import { AddItemUsecase } from './app/usecases/add-item.usecase';
import { CartPrismaRepository } from './infra/repository/cart-prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [CartController],
    providers: [AddItemUsecase, CartPrismaRepository, PrismaService],
    exports: [AddItemUsecase],
})
export class CartModule { }
