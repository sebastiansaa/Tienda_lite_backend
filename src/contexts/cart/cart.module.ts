import { Module } from '@nestjs/common';
import { CartController } from './api/controller/cart.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { CART_PRICING_SERVICE, CART_REPOSITORY } from './constants';
import { CartPrismaRepository } from './infra/repository/cart-prisma.repository';
import CartPricingService from './infra/services/cart-pricing.service';
import { CartRepositoryPort } from './application/ports/cart.repository';
import PricingServicePort from './application/ports/pricing.service.port';
import {
    AddItemToCartUsecase,
    UpdateItemQuantityUsecase,
    RemoveItemUsecase,
    GetCartUsecase,
    ClearCartUsecase,
} from './application/usecases';

@Module({
    imports: [AuthModule, ProductsModule],
    controllers: [CartController],
    providers: [
        PrismaService,
        {
            provide: CART_REPOSITORY,
            useClass: CartPrismaRepository,
        },
        {
            provide: CART_PRICING_SERVICE,
            useClass: CartPricingService,
        },
        {
            provide: AddItemToCartUsecase,
            useFactory: (repo: CartRepositoryPort, pricing: PricingServicePort) => new AddItemToCartUsecase(repo, pricing),
            inject: [CART_REPOSITORY, CART_PRICING_SERVICE],
        },
        {
            provide: UpdateItemQuantityUsecase,
            useFactory: (repo: CartRepositoryPort, pricing: PricingServicePort) => new UpdateItemQuantityUsecase(repo, pricing),
            inject: [CART_REPOSITORY, CART_PRICING_SERVICE],
        },
        {
            provide: RemoveItemUsecase,
            useFactory: (repo: CartRepositoryPort) => new RemoveItemUsecase(repo),
            inject: [CART_REPOSITORY],
        },
        {
            provide: GetCartUsecase,
            useFactory: (repo: CartRepositoryPort) => new GetCartUsecase(repo),
            inject: [CART_REPOSITORY],
        },
        {
            provide: ClearCartUsecase,
            useFactory: (repo: CartRepositoryPort) => new ClearCartUsecase(repo),
            inject: [CART_REPOSITORY],
        },
    ],
})
export class CartModule { }
