import { Test } from '@nestjs/testing';
import { AdminModule } from 'src/contexts/admin/admin.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ADMIN_PAYMENT_READ } from 'src/contexts/admin/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('AdminPaymentPrismaAdapter integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: any;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AdminModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(ADMIN_PAYMENT_READ as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('listPayments and getPaymentById', async () => {
        const order = await prisma.order.create({ data: { id: `pay-ord-${Date.now()}`, userId: 'u1', items: [], totalAmount: 10 } });
        const created = await prisma.payment.create({ data: { orderId: order.id, userId: 'u1', amount: 15.5, status: 'OK', provider: 'FAKE' } });

        const list = await repo.listPayments();
        expect(list.length).toBeGreaterThanOrEqual(1);

        const det = await repo.getPaymentById(created.id);
        expect(det).not.toBeNull();
        expect(det?.id).toBe(created.id);
    });
});
