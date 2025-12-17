import { InsufficientStockError } from 'src/contexts/inventory/domain/errors/inventory.errors';
import { InventoryItemEntity } from 'src/contexts/inventory/domain/entity/inventory-item.entity';
import { IncreaseStockUsecase } from 'src/contexts/inventory/app/usecases/increase-stock.usecase';
import { DecreaseStockUsecase } from 'src/contexts/inventory/app/usecases/decrease-stock.usecase';
import { ReserveStockUsecase } from 'src/contexts/inventory/app/usecases/reserve-stock.usecase';
import { IInventoryReadRepository } from 'src/contexts/inventory/app/ports/inventory-read.repository';
import { IInventoryWriteRepository } from 'src/contexts/inventory/app/ports/inventory-write.repository';
import ProductReadOnlyPort from 'src/contexts/inventory/app/ports/product-read.port';
import IncreaseStockCommand from 'src/contexts/inventory/app/commands/increase-stock.command';
import DecreaseStockCommand from 'src/contexts/inventory/app/commands/decrease-stock.command';
import ReserveStockCommand from 'src/contexts/inventory/app/commands/reserve-stock.command';

describe('Inventory usecases', () => {
    const productSnapshot = { id: 1 };

    const makeRepos = () => {
        const readRepo: jest.Mocked<IInventoryReadRepository> = {
            findByProductId: jest.fn(),
            listMovements: jest.fn(),
        };
        const writeRepo: jest.Mocked<IInventoryWriteRepository> = {
            save: jest.fn(),
            addMovement: jest.fn(),
        };
        const productRead: jest.Mocked<ProductReadOnlyPort> = {
            findById: jest.fn(),
        };
        return { readRepo, writeRepo, productRead };
    };

    it('increase crea item y registra movimiento', async () => {
        const { readRepo, writeRepo, productRead } = makeRepos();
        productRead.findById.mockResolvedValue(productSnapshot);
        readRepo.findByProductId.mockResolvedValue(null);

        writeRepo.save.mockImplementation(async (item: InventoryItemEntity) => item);
        writeRepo.addMovement.mockResolvedValue();

        const usecase = new IncreaseStockUsecase(readRepo, writeRepo, productRead);
        const cmd = new IncreaseStockCommand(1, 5, 'MANUAL');

        const saved = await usecase.execute(cmd);

        expect(readRepo.findByProductId).toHaveBeenCalledWith(1);
        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        expect(writeRepo.addMovement).toHaveBeenCalledTimes(1);
        expect(saved.onHand).toBe(5);
        expect(saved.reserved).toBe(0);
    });

    it('decrease falla si no existe inventario', async () => {
        const { readRepo, writeRepo, productRead } = makeRepos();
        productRead.findById.mockResolvedValue(productSnapshot);
        readRepo.findByProductId.mockResolvedValue(null);

        const usecase = new DecreaseStockUsecase(readRepo, writeRepo, productRead);
        const cmd = new DecreaseStockCommand(1, 1, 'ORDER');

        await expect(usecase.execute(cmd)).rejects.toBeInstanceOf(InsufficientStockError);
    });

    it('reserve aumenta reserved y persiste movimiento', async () => {
        const { readRepo, writeRepo, productRead } = makeRepos();
        productRead.findById.mockResolvedValue(productSnapshot);
        const existing = new InventoryItemEntity({ productId: 1, onHand: 10, reserved: 2 });
        readRepo.findByProductId.mockResolvedValue(existing);
        writeRepo.save.mockImplementation(async (item: InventoryItemEntity) => item);
        writeRepo.addMovement.mockResolvedValue();

        const usecase = new ReserveStockUsecase(readRepo, writeRepo, productRead);
        const cmd = new ReserveStockCommand(1, 3, 'ORDER');

        const saved = await usecase.execute(cmd);

        expect(saved.onHand).toBe(10);
        expect(saved.reserved).toBe(5);
        expect(writeRepo.addMovement).toHaveBeenCalled();
    });
});
// moved to test/inventory/unit/inventory.usecases.spec.ts
export { };
