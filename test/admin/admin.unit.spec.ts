import { ChangeAdminUserStatusUsecase } from '../../src/contexts/admin/app/usecases/change-user-status.usecase';
import { AdjustAdminStockUsecase } from '../../src/contexts/admin/app/usecases/adjust-stock.usecase';
import { CancelAdminOrderUsecase } from '../../src/contexts/admin/app/usecases/cancel-order.usecase';

describe('Admin Unit Tests', () => {
    describe('ChangeAdminUserStatusUsecase', () => {
        it('calls port.changeStatus and returns result', async () => {
            const expected = {
                id: 'u1',
                email: 'a@b.com',
                name: 'A',
                phone: null,
                status: 'SUSPENDED',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockPort = { changeStatus: jest.fn().mockResolvedValue(expected) } as any;
            const usecase = new ChangeAdminUserStatusUsecase(mockPort);
            const res = await usecase.execute('u1', 'SUSPENDED');
            expect(mockPort.changeStatus).toHaveBeenCalledWith('u1', 'SUSPENDED');
            expect(res).toEqual(expected);
        });
    });

    describe('AdjustAdminStockUsecase', () => {
        it('calls inventoryPort.adjustStock with correct args', async () => {
            const expected = { productId: 1, onHand: 10 } as any;
            const mockPort = { adjustStock: jest.fn().mockResolvedValue(expected) } as any;
            const usecase = new AdjustAdminStockUsecase(mockPort);
            const res = await usecase.execute(1, 5, 'restock');
            expect(mockPort.adjustStock).toHaveBeenCalledWith(1, 5, 'restock');
            expect(res).toBe(expected);
        });
    });

    describe('CancelAdminOrderUsecase', () => {
        it('calls orderPort.cancel and returns updated order', async () => {
            const expected = { id: 'ord-1', status: 'CANCELLED' } as any;
            const mockPort = { cancel: jest.fn().mockResolvedValue(expected) } as any;
            const usecase = new CancelAdminOrderUsecase(mockPort);
            const res = await usecase.execute('ord-1');
            expect(mockPort.cancel).toHaveBeenCalledWith('ord-1');
            expect(res).toBe(expected);
        });
    });
});
