import { Test } from '@nestjs/testing';
import { AdminModule } from 'src/contexts/admin/admin.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ADMIN_INVENTORY_READ } from 'src/contexts/admin/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('AdminInventoryPrismaAdapter integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: any;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AdminModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(ADMIN_INVENTORY_READ as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('listInventory and getByProductId', async () => {
        const cat = await prisma.category.create({ data: { title: 'InvCat', slug: `icat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'InvP', slug: `invp-${Date.now()}`, price: new Prisma.Decimal(5), description: '', categoryId: cat.id, stock: 1, images: [] } });
        await prisma.inventoryItem.create({ data: { productId: prod.id, onHand: 7 } });

        const list = await repo.listInventory();
        expect(list.length).toBeGreaterThanOrEqual(1);

        const det = await repo.getByProductId(prod.id);
        expect(det).not.toBeNull();
        expect(det?.productId).toBe(prod.id);
    });

    it('adjustStock creates or updates and records movement', async () => {
        const cat = await prisma.category.create({ data: { title: 'AdjCat', slug: `adjcat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'AdjP', slug: `adjp-${Date.now()}`, price: new Prisma.Decimal(5), description: '', categoryId: cat.id, stock: 1, images: [] } });

        const adjusted = await repo.adjustStock(prod.id, 3, 'TEST');
        expect(adjusted).not.toBeNull();
        expect(adjusted?.onHand).toBeGreaterThanOrEqual(3);

        const movements = await prisma.stockMovement.findMany({ where: { productId: prod.id } });
        expect(movements.length).toBeGreaterThanOrEqual(1);
    });
});
