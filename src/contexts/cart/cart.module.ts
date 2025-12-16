import { Module } from '@nestjs/common';
import { CartController } from './api/controller/cart.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { CART_PRICING_SERVICE, CART_READ_REPOSITORY, CART_WRITE_REPOSITORY } from './constants';
import { CartPrismaReadRepository } from './infra/persistence/cart-prisma-read.repository';
import { CartPrismaWriteRepository } from './infra/persistence/cart-prisma-write.repository';
import CartPricingService from './infra/services/cart-pricing.service';
import { ICartReadRepository } from './app/ports/cart-read.repository';
import { ICartWriteRepository } from './app/ports/cart-write.repository';
import PricingServicePort from './app/ports/pricing-service.port';
import {
    AddItemToCartUseCase,
    UpdateItemQuantityUseCase,
    RemoveItemUseCase,
    GetCartUseCase,
    ClearCartUseCase,
} from './app/usecases';

@Module({
    imports: [AuthModule, ProductsModule],
    controllers: [CartController],
    providers: [
        PrismaService,
        {
            provide: CART_READ_REPOSITORY,
            useClass: CartPrismaReadRepository,
        },
        {
            provide: CART_WRITE_REPOSITORY,
            useClass: CartPrismaWriteRepository,
        },
        {
            provide: CART_PRICING_SERVICE,
            useClass: CartPricingService,
        },
        {
            provide: AddItemToCartUseCase,
            useFactory: (readRepo: ICartReadRepository, writeRepo: ICartWriteRepository, pricing: PricingServicePort) =>
                new AddItemToCartUseCase(readRepo, writeRepo, pricing),
            inject: [CART_READ_REPOSITORY, CART_WRITE_REPOSITORY, CART_PRICING_SERVICE],
        },
        {
            provide: UpdateItemQuantityUseCase,
            useFactory: (readRepo: ICartReadRepository, writeRepo: ICartWriteRepository, pricing: PricingServicePort) =>
                new UpdateItemQuantityUseCase(readRepo, writeRepo, pricing),
            inject: [CART_READ_REPOSITORY, CART_WRITE_REPOSITORY, CART_PRICING_SERVICE],
        },
        {
            provide: RemoveItemUseCase,
            useFactory: (readRepo: ICartReadRepository, writeRepo: ICartWriteRepository) =>
                new RemoveItemUseCase(readRepo, writeRepo),
            inject: [CART_READ_REPOSITORY, CART_WRITE_REPOSITORY],
        },
        {
            provide: GetCartUseCase,
            useFactory: (readRepo: ICartReadRepository) => new GetCartUseCase(readRepo),
            inject: [CART_READ_REPOSITORY],
        },
        {
            provide: ClearCartUseCase,
            useFactory: (writeRepo: ICartWriteRepository) => new ClearCartUseCase(writeRepo),
            inject: [CART_WRITE_REPOSITORY],
        },
    ],
})
export class CartModule { }
