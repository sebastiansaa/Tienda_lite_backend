import * as fs from 'fs';
import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { CartModule } from '../../src/contexts/cart/cart.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AddItemToCartUseCase } from '../../src/contexts/cart/app/usecases/add-item-to-cart.usecase';

if (fs.existsSync('.env.test')) require('dotenv').config({ path: '.env.test' });
const hasDb = Boolean(process.env.DATABASE_URL);
const suite = hasDb ? describe : describe.skip;

suite('Cart Integration Tests (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let addItem: AddItemToCartUseCase;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [CartModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        addItem = moduleRef.get(AddItemToCartUseCase);
    });

    beforeEach(async () => {
        await prisma.cart.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('adds an item to cart using pricing service from ProductsModule', async () => {
        const category = await prisma.category.create({ data: { title: 'c', slug: 'c', image: 'i', description: '', sortOrder: 0 } });
        const product = await prisma.product.create({ data: { title: 'p', slug: 'p', price: 12.5, description: '', stock: 10, images: [], categoryId: category.id } });

        const cart = await addItem.execute({ userId: 'user-x', productId: product.id, quantity: 2 });
        expect(cart).toBeDefined();
        expect(cart.items.length).toBeGreaterThanOrEqual(1);
        expect(cart.calculateTotal()).toBeCloseTo(25);
    });
});
