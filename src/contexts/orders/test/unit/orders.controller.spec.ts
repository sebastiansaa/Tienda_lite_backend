import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { OrdersController } from 'src/contexts/orders/api/controller/orders.controller';
import {
    CancelOrderUsecase,
    CreateOrderFromCartUsecase,
    CreateOrderFromItemsUsecase,
    GetOrderByIdUsecase,
    ListOrdersForUserUsecase,
    MarkOrderAsCompletedUsecase,
    MarkOrderAsPaidUsecase,
} from 'src/contexts/orders/app/usecases';
import {
    EmptyOrderError,
    InvalidOrderStateError,
    OrderOwnershipError,
    ProductUnavailableError,
} from 'src/contexts/orders/domain/errors/order.errors';

type UsecaseMock = { execute: jest.Mock };
type ControllerDeps = {
    createFromCart: UsecaseMock;
    createFromItems: UsecaseMock;
    getOrderById: UsecaseMock;
    listOrdersForUser: UsecaseMock;
    cancelOrderUsecase: UsecaseMock;
    markOrderAsPaidUsecase: UsecaseMock;
    markOrderAsCompletedUsecase: UsecaseMock;
};

const makeDeps = (): ControllerDeps => ({
    createFromCart: { execute: jest.fn() },
    createFromItems: { execute: jest.fn() },
    getOrderById: { execute: jest.fn() },
    listOrdersForUser: { execute: jest.fn() },
    cancelOrderUsecase: { execute: jest.fn() },
    markOrderAsPaidUsecase: { execute: jest.fn() },
    markOrderAsCompletedUsecase: { execute: jest.fn() },
});

const buildController = (deps: ControllerDeps) => new OrdersController(
    deps.createFromCart as unknown as CreateOrderFromCartUsecase,
    deps.createFromItems as unknown as CreateOrderFromItemsUsecase,
    deps.getOrderById as unknown as GetOrderByIdUsecase,
    deps.listOrdersForUser as unknown as ListOrdersForUserUsecase,
    deps.cancelOrderUsecase as unknown as CancelOrderUsecase,
    deps.markOrderAsPaidUsecase as unknown as MarkOrderAsPaidUsecase,
    deps.markOrderAsCompletedUsecase as unknown as MarkOrderAsCompletedUsecase,
);

const user = { sub: 'user-1' } as const;

describe('OrdersController error mapping', () => {
    it('maps EmptyOrderError to BadRequest', async () => {
        const deps = makeDeps();
        deps.createFromCart.execute.mockRejectedValue(new EmptyOrderError('empty'));
        const controller = buildController(deps);

        await expect(controller.createFromCartHandler(user)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('maps ProductUnavailableError to BadRequest', async () => {
        const deps = makeDeps();
        deps.createFromItems.execute.mockRejectedValue(new ProductUnavailableError('missing'));
        const controller = buildController(deps);

        await expect(controller.createFromItemsHandler(user, { items: [] } as any)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('maps InvalidOrderStateError to Conflict', async () => {
        const deps = makeDeps();
        deps.markOrderAsPaidUsecase.execute.mockRejectedValue(new InvalidOrderStateError('bad state'));
        const controller = buildController(deps);

        await expect(controller.markPaid(user, 'order-1')).rejects.toBeInstanceOf(ConflictException);
    });

    it('maps OrderOwnershipError to NotFound', async () => {
        const deps = makeDeps();
        deps.cancelOrderUsecase.execute.mockRejectedValue(new OrderOwnershipError('forbidden'));
        const controller = buildController(deps);

        await expect(controller.cancel(user, 'order-1')).rejects.toBeInstanceOf(NotFoundException);
    });
});