import { OrderEntity } from 'src/contexts/orders/domain/entity/order.entity';
import { OrderOwnershipError, InvalidOrderStateError } from 'src/contexts/orders/domain/errors/order.errors';

const baseItems = [{ productId: 1, quantity: 1, price: 10 }];

describe('OrderEntity (unit)', () => {
    it('calculates total and transitions', () => {
        const order = new OrderEntity({ userId: 'u1', items: baseItems });
        expect(order.totalAmount).toBe(10);

        order.markPaid();
        expect(order.status).toBe('PAID');

        order.markCompleted();
        expect(order.status).toBe('COMPLETED');
    });

    it('prevents invalid transitions', () => {
        const order = new OrderEntity({ userId: 'u1', items: baseItems });
        order.markPaid();
        expect(() => order.cancel()).toThrow(InvalidOrderStateError);
    });

    it('checks ownership', () => {
        const order = new OrderEntity({ userId: 'owner', items: baseItems });
        expect(() => order.assertOwnedBy('other')).toThrow(OrderOwnershipError);
    });
});
