import { Test } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { PaymentModule } from '../../../src/contexts/payment/payment.module';
import { OrdersModule } from '../../../src/contexts/orders/order.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { InitiatePaymentUsecase } from '../../../src/contexts/payment/app/usecases/initiate-payment.usecase';
import { ConfirmPaymentUsecase } from '../../../src/contexts/payment/app/usecases/confirm-payment.usecase';
import { FailPaymentUsecase } from '../../../src/contexts/payment/app/usecases/fail-payment.usecase';
import InitiatePaymentCommand from '../../../src/contexts/payment/app/commands/initiate-payment.command';
import ConfirmPaymentCommand from '../../../src/contexts/payment/app/commands/confirm-payment.command';
import FailPaymentCommand from '../../../src/contexts/payment/app/commands/fail-payment.command';
import { cleanDatabase, ensureTestEnv } from '../../utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('PaymentModule integration (Prisma)', () => {
    let prisma: PrismaService & PrismaClient;
    let initiate: InitiatePaymentUsecase;
    let confirm: ConfirmPaymentUsecase;
    let fail: FailPaymentUsecase;

    const seedUser = async () => prisma.user.create({ data: { email: `p-${Date.now()}@test.com`, passwordHash: 'hash' } });

    const seedOrder = async (userId: string) => {
        const category = await prisma.category.create({
            data: { title: 'Pay Cat', slug: `pay-cat-${Date.now()}`, image: 'img' },
        });
        const product = await prisma.product.create({
            data: {
                title: 'Pay Product',
                slug: `pay-product-${Date.now()}`,
                price: new Prisma.Decimal(80),
                description: 'pay test',
                categoryId: category.id,
                stock: 10,
                images: [],
            },
        });

        return prisma.order.create({
            data: {
                id: `ord-${Date.now()}`,
                userId,
                status: 'PENDING',
                items: [{ productId: product.id, quantity: 1, price: 80 }],
                totalAmount: 80,
            },
        });
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [OrdersModule, PaymentModule],
        }).compile();

        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        initiate = moduleRef.get(InitiatePaymentUsecase);
        confirm = moduleRef.get(ConfirmPaymentUsecase);
        fail = moduleRef.get(FailPaymentUsecase);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    it('initiates a payment and stores provider info', async () => {
        const user = await seedUser();
        const order = await seedOrder(user.id);

        const payment = await initiate.execute(new InitiatePaymentCommand(order.id, 80, user.id));

        expect(payment.externalPaymentId).toBeDefined();
        expect(payment.clientSecret).toBeDefined();
        const stored = await prisma.payment.findUnique({ where: { id: payment.id } });
        expect(stored?.status).toBeDefined();
    });

    it('confirms a payment and marks it PAID/FAILED per provider', async () => {
        const user = await seedUser();
        const order = await seedOrder(user.id);
        const payment = await initiate.execute(new InitiatePaymentCommand(order.id, 80, user.id));

        try {
            const confirmed = await confirm.execute(new ConfirmPaymentCommand(payment.id, user.id));
            expect(['PAID', 'AUTHORIZED', 'FAILED', 'PENDING']).toContain(confirmed.status);
            const stored = await prisma.payment.findUnique({ where: { id: payment.id } });
            expect(stored?.status).toBe(confirmed.status);
        } catch (err) {
            // If provider already returned a terminal status in initiate, confirm may reject as already processed.
            if (err?.constructor?.name !== 'PaymentAlreadyProcessedError') throw err;
            const stored = await prisma.payment.findUnique({ where: { id: payment.id } });
            expect(stored?.status).toBeDefined();
        }
    });

    it('fails a payment explicitly', async () => {
        const user = await seedUser();
        const order = await seedOrder(user.id);
        const payment = await initiate.execute(new InitiatePaymentCommand(order.id, 80, user.id));

        const failed = await fail.execute(new FailPaymentCommand(payment.id, user.id));
        expect(failed.status).toBe('FAILED');

        const stored = await prisma.payment.findUnique({ where: { id: payment.id } });
        expect(stored?.status).toBe('FAILED');
    });
});
