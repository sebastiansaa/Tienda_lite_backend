import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { OrdersModule } from '../../../src/contexts/orders/order.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import CreateOrderFromItemsCommand from '../../../src/contexts/orders/app/commands/create-order-from-items.command';
import CancelOrderCommand from '../../../src/contexts/orders/app/commands/cancel-order.command';
import MarkOrderAsPaidCommand from '../../../src/contexts/orders/app/commands/mark-order-paid.command';
import ListOrdersForUserQuery from '../../../src/contexts/orders/app/queries/list-orders-for-user.query';
import { CreateOrderFromItemsUsecase } from '../../../src/contexts/orders/app/usecases/create-order-from-items.usecase';
import { ListOrdersForUserUsecase } from '../../../src/contexts/orders/app/usecases/list-orders-for-user.usecase';
import { CancelOrderUsecase } from '../../../src/contexts/orders/app/usecases/cancel-order.usecase';
import { MarkOrderAsPaidUsecase } from '../../../src/contexts/orders/app/usecases/mark-order-as-paid.usecase';
import { GetOrderByIdUsecase } from '../../../src/contexts/orders/app/usecases/get-order-by-id.usecase';
import { cleanDatabase, ensureTestEnv } from '../../utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('OrdersModule integration (Prisma)', () => {
    let prisma: PrismaService;
    let createFromItems: CreateOrderFromItemsUsecase;
    let listForUser: ListOrdersForUserUsecase;
    let cancel: CancelOrderUsecase;
    let markPaid: MarkOrderAsPaidUsecase;
    let getById: GetOrderByIdUsecase;

    const seedProduct = async () => {
        const category = await prisma.category.create({
            data: {
                title: 'Orders Cat',
                slug: `orders-cat-${Date.now()}`,
                image: 'img',
            },
        });

        return prisma.product.create({
            data: {
                title: 'Orders Product',
                slug: `orders-product-${Date.now()}`,
                price: new Prisma.Decimal(120),
                description: 'orders test',
                categoryId: category.id,
                stock: 50,
                images: [],
            },
        });
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [OrdersModule],
        }).compile();

        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        createFromItems = moduleRef.get(CreateOrderFromItemsUsecase);
        listForUser = moduleRef.get(ListOrdersForUserUsecase);
        cancel = moduleRef.get(CancelOrderUsecase);
        markPaid = moduleRef.get(MarkOrderAsPaidUsecase);
        getById = moduleRef.get(GetOrderByIdUsecase);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    it('creates an order from items and persists it', async () => {
        const product = await seedProduct();

        const order = await createFromItems.execute(new CreateOrderFromItemsCommand('user-int-1', [
            { productId: product.id, quantity: 2 },
        ]));

        expect(order.items).toHaveLength(1);
        expect(order.totalAmount).toBeCloseTo(240);

        const stored = await prisma.order.findUnique({ where: { id: order.id } });
        expect(stored?.userId).toBe('user-int-1');
        expect(stored?.items).toBeDefined();
    });

    it('lists orders filtered by user', async () => {
        const product = await seedProduct();
        await createFromItems.execute(new CreateOrderFromItemsCommand('user-a', [
            { productId: product.id, quantity: 1 },
        ]));
        await createFromItems.execute(new CreateOrderFromItemsCommand('user-b', [
            { productId: product.id, quantity: 1 },
        ]));

        const list = await listForUser.execute(new ListOrdersForUserQuery('user-a'));
        expect(list).toHaveLength(1);
        expect(list[0].userId).toBe('user-a');
    });

    it('cancels an order respecting ownership', async () => {
        const product = await seedProduct();
        const order = await createFromItems.execute(new CreateOrderFromItemsCommand('user-cancel', [
            { productId: product.id, quantity: 1 },
        ]));

        const cancelled = await cancel.execute(new CancelOrderCommand(order.id, 'user-cancel'));
        expect(cancelled?.status).toBe('CANCELLED');

        const stored = await prisma.order.findUnique({ where: { id: order.id } });
        expect(stored?.status).toBe('CANCELLED');
    });

    it('marks an order as paid and retrieves it', async () => {
        const product = await seedProduct();
        const order = await createFromItems.execute(new CreateOrderFromItemsCommand('user-pay', [
            { productId: product.id, quantity: 1 },
        ]));

        const paid = await markPaid.execute(new MarkOrderAsPaidCommand(order.id, 'user-pay'));
        if (!paid) throw new Error('Expected paid order instance');
        expect(paid.status).toBe('PAID');

        const fetched = await getById.execute({ orderId: order.id, userId: 'user-pay' } as any);
        expect(fetched?.status).toBe('PAID');
    });
});
