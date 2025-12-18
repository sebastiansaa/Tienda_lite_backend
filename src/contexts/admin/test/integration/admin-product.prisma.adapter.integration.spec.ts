import { Test } from '@nestjs/testing';
import { AdminModule } from 'src/contexts/admin/admin.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ADMIN_PRODUCT_READ } from 'src/contexts/admin/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('AdminProductPrismaAdapter integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AdminModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(ADMIN_PRODUCT_READ as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    const seedCategory = async () => {
        return prisma.category.create({
            data: {
                title: 'PCat',
                slug: `pcat-${Date.now()}`,
                image: 'http://example.com/img.jpg',
            },
        });
    };

    it('listProducts and getProductById return correct shape', async () => {
        const cat = await seedCategory();
        const p = await prisma.product.create({
            data: {
                title: 'P1',
                slug: `p1-${Date.now()}`,
                price: new Prisma.Decimal(10),
                description: 'desc',
                categoryId: cat.id,
                stock: 5,
                images: [],
            },
        });

        const list = await repo.listProducts();

        expect(list.length).toBeGreaterThanOrEqual(1);

        expect(list).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: p.id,
                    title: 'P1',
                    stock: 5,
                }),
            ]),
        );

        const detail = await repo.getProductById(p.id);

        expect(detail).not.toBeNull();
        expect(detail).toEqual(
            expect.objectContaining({
                id: p.id,
                title: 'P1',
                stock: 5,
            }),
        );
    });

    it('updateProduct updates only provided fields and preserves others', async () => {
        const cat = await seedCategory();
        const p = await prisma.product.create({
            data: {
                title: 'P2',
                slug: `p2-${Date.now()}`,
                price: new Prisma.Decimal(20),
                description: 'original desc',
                categoryId: cat.id,
                stock: 2,
                images: [],
            },
        });

        const updated = await repo.updateProduct(p.id, {
            title: 'P2Updated',
            stock: 10,
        });

        expect(updated).not.toBeNull();

        expect(updated.title).toBe('P2Updated');
        expect(updated.stock).toBe(10);

        expect(updated.price).toBe(20);

        const found = await prisma.product.findUnique({ where: { id: p.id } });
        expect(found?.title).toBe('P2Updated');
        expect(found?.stock).toBe(10);
        expect(found?.slug).toBe(p.slug);
        expect(found?.description).toBe('original desc');
    });

    it('getProductById returns null for nonexistent ID', async () => {
        const res = await repo.getProductById(999999);
        expect(res).toBeNull();
    });

    it('updateProduct returns null when product does not exist', async () => {
        const res = await repo.updateProduct(999999, { title: 'X' });
        expect(res).toBeNull();
    });
});