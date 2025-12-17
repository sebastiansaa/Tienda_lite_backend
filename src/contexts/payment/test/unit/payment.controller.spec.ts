import { BadRequestException, ConflictException } from '@nestjs/common';
import { PaymentController } from 'src/contexts/payment/api/controller/payment.controller';
import {
    InitiatePaymentUsecase,
    ConfirmPaymentUsecase,
    FailPaymentUsecase,
    GetPaymentByIdUsecase,
    ListPaymentsForUserUsecase,
} from 'src/contexts/payment/app/usecases';
import { InvalidPaymentStateError, PaymentAlreadyProcessedError } from 'src/contexts/payment/domain/errors/payment.errors';

type UsecaseMock = { execute: jest.Mock };

type ControllerDeps = {
    initiatePayment: UsecaseMock;
    confirmPayment: UsecaseMock;
    failPayment: UsecaseMock;
    getPaymentById: UsecaseMock;
    listPaymentsForUser: UsecaseMock;
};

const makeDeps = (): ControllerDeps => ({
    initiatePayment: { execute: jest.fn() },
    confirmPayment: { execute: jest.fn() },
    failPayment: { execute: jest.fn() },
    getPaymentById: { execute: jest.fn() },
    listPaymentsForUser: { execute: jest.fn() },
});

const buildController = (deps: ControllerDeps) => new PaymentController(
    deps.initiatePayment as unknown as InitiatePaymentUsecase,
    deps.confirmPayment as unknown as ConfirmPaymentUsecase,
    deps.failPayment as unknown as FailPaymentUsecase,
    deps.getPaymentById as unknown as GetPaymentByIdUsecase,
    deps.listPaymentsForUser as unknown as ListPaymentsForUserUsecase,
);

const user = { sub: 'user-1' } as const;

describe('PaymentController error mapping', () => {
    it('maps PaymentAlreadyProcessedError to ConflictException', async () => {
        const deps = makeDeps();
        deps.confirmPayment.execute.mockRejectedValue(new PaymentAlreadyProcessedError('already processed'));
        const controller = buildController(deps);

        await expect(controller.confirm(user, 'payment-1')).rejects.toBeInstanceOf(ConflictException);
    });

    it('maps InvalidPaymentStateError to BadRequestException', async () => {
        const deps = makeDeps();
        deps.failPayment.execute.mockRejectedValue(new InvalidPaymentStateError('bad state'));
        const controller = buildController(deps);

        await expect(controller.fail(user, 'payment-1')).rejects.toBeInstanceOf(BadRequestException);
    });
});