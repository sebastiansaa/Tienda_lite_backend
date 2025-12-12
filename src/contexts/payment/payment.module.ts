import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PaymentController } from './api/controller/payment.controller';
import { PAYMENT_ORDER_READONLY, PAYMENT_PROVIDER, PAYMENT_REPOSITORY } from './constants';
import { PaymentPrismaRepository } from './infra/repository/payment-prisma.repository';
import { PaymentProviderFakeAdapter } from './infra/adapters/payment-provider-fake.adapter';
import { PaymentOrderReadAdapter } from './infra/adapters/order-read.adapter';
import {
    InitiatePaymentUsecase,
    ConfirmPaymentUsecase,
    FailPaymentUsecase,
    GetPaymentByIdUsecase,
    ListPaymentsForUserUsecase,
} from './application/usecases';
import PaymentRepositoryPort from './application/ports/payment.repository.port';
import PaymentProviderPort from './application/ports/payment-provider.port';
import OrderReadOnlyPort from './application/ports/order-read.port';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [PaymentController],
    providers: [
        {
            provide: PAYMENT_REPOSITORY,
            useClass: PaymentPrismaRepository,
        },
        {
            provide: PAYMENT_PROVIDER,
            useClass: PaymentProviderFakeAdapter,
        },
        {
            provide: PAYMENT_ORDER_READONLY,
            useClass: PaymentOrderReadAdapter,
        },
        {
            provide: InitiatePaymentUsecase,
            useFactory: (repo: PaymentRepositoryPort, provider: PaymentProviderPort, orderRead: OrderReadOnlyPort) =>
                new InitiatePaymentUsecase(repo, provider, orderRead),
            inject: [PAYMENT_REPOSITORY, PAYMENT_PROVIDER, PAYMENT_ORDER_READONLY],
        },
        {
            provide: ConfirmPaymentUsecase,
            useFactory: (repo: PaymentRepositoryPort, provider: PaymentProviderPort) =>
                new ConfirmPaymentUsecase(repo, provider),
            inject: [PAYMENT_REPOSITORY, PAYMENT_PROVIDER],
        },
        {
            provide: FailPaymentUsecase,
            useFactory: (repo: PaymentRepositoryPort, provider: PaymentProviderPort) =>
                new FailPaymentUsecase(repo, provider),
            inject: [PAYMENT_REPOSITORY, PAYMENT_PROVIDER],
        },
        {
            provide: GetPaymentByIdUsecase,
            useFactory: (repo: PaymentRepositoryPort) => new GetPaymentByIdUsecase(repo),
            inject: [PAYMENT_REPOSITORY],
        },
        {
            provide: ListPaymentsForUserUsecase,
            useFactory: (repo: PaymentRepositoryPort) => new ListPaymentsForUserUsecase(repo),
            inject: [PAYMENT_REPOSITORY],
        },
    ],
})
export class PaymentModule { }
