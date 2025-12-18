import { Test } from '@nestjs/testing';
import { AdminModule } from 'src/contexts/admin/admin.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ADMIN_ORDER_READ } from 'src/contexts/admin/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('AdminOrderPrismaAdapter integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: any;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AdminModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(ADMIN_ORDER_READ as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('listOrders and getOrderById', async () => {
        const created = await prisma.order.create({ data: { id: `ord-${Date.now()}`, userId: 'u1', items: [], totalAmount: 100 } });

        const list = await repo.listOrders();
        expect(list.length).toBeGreaterThanOrEqual(1);

        const det = await repo.getOrderById(created.id);
        expect(det).not.toBeNull();
        expect(det?.id).toBe(created.id);
    });

    it('cancel/markShipped/markCompleted update status', async () => {
        const created = await prisma.order.create({ data: { id: `ord2-${Date.now()}`, userId: 'u2', items: [], totalAmount: 50 } });

        const c = await repo.cancel(created.id);
        expect(c).not.toBeNull();
        expect(c?.status).toBe('CANCELLED');

        const s = await repo.markShipped(created.id);
        expect(s).not.toBeNull();
        expect(s?.status).toBe('SHIPPED');

        const co = await repo.markCompleted(created.id);
        expect(co).not.toBeNull();
        expect(co?.status).toBe('COMPLETED');
    });
});
