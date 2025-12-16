import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { InventoryModule } from '../../../src/contexts/inventory/inventory.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import IncreaseStockCommand from '../../../src/contexts/inventory/app/commands/increase-stock.command';
import ReserveStockCommand from '../../../src/contexts/inventory/app/commands/reserve-stock.command';
import ReleaseStockCommand from '../../../src/contexts/inventory/app/commands/release-stock.command';
import GetStockQuery from '../../../src/contexts/inventory/app/queries/get-stock.query';
import { IncreaseStockUsecase } from '../../../src/contexts/inventory/app/usecases/increase-stock.usecase';
import { ReserveStockUsecase } from '../../../src/contexts/inventory/app/usecases/reserve-stock.usecase';
import { ReleaseStockUsecase } from '../../../src/contexts/inventory/app/usecases/release-stock.usecase';
import { GetStockUsecase } from '../../../src/contexts/inventory/app/usecases/get-stock.usecase';
import { cleanDatabase, ensureTestEnv } from '../../utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('InventoryModule integration (Prisma)', () => {
    let prisma: PrismaService;
    let increase: IncreaseStockUsecase;
    let reserve: ReserveStockUsecase;
    let release: ReleaseStockUsecase;
    let getStock: GetStockUsecase;

    const seedProduct = async () => {
        const category = await prisma.category.create({
            data: {
                title: 'Inventory Cat',
                slug: `inventory-cat-${Date.now()}`,
                image: 'img',
            },
        });

        return prisma.product.create({
            data: {
                title: 'Inventory Product',
                slug: `inventory-product-${Date.now()}`,
                price: new Prisma.Decimal(100),
                description: 'inventory test',
                categoryId: category.id,
                stock: 20,
                images: [],
            },
        });
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [InventoryModule],
        }).compile();

        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        increase = moduleRef.get(IncreaseStockUsecase);
        reserve = moduleRef.get(ReserveStockUsecase);
        release = moduleRef.get(ReleaseStockUsecase);
        getStock = moduleRef.get(GetStockUsecase);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    it('increments stock and records a movement', async () => {
        const product = await seedProduct();

        const saved = await increase.execute(new IncreaseStockCommand(product.id, 5, 'MANUAL'));

        expect(saved.onHand).toBe(5);
        expect(saved.reserved).toBe(0);

        const movements = await prisma.stockMovement.findMany({ where: { productId: product.id } });
        expect(movements).toHaveLength(1);
        expect(movements[0].onHandAfter).toBe(5);
    });

    it('reserves and releases stock consistently', async () => {
        const product = await seedProduct();
        await increase.execute(new IncreaseStockCommand(product.id, 10, 'MANUAL'));

        const reserved = await reserve.execute(new ReserveStockCommand(product.id, 3, 'ORDER'));
        expect(reserved.reserved).toBe(3);

        await release.execute(new ReleaseStockCommand(product.id, 2, 'ORDER'));
        const item = await getStock.execute(new GetStockQuery(product.id));

        expect(item?.reserved).toBe(1);
        expect(item?.onHand).toBe(10);
    });
});
