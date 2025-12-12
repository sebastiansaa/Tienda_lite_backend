import CancelOrderCommand from '../commands/cancel-order.command';
import OrderRepositoryPort from '../ports/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

export class CancelOrderUsecase {
    constructor(private readonly orderRepo: OrderRepositoryPort) { }

    async execute(cmd: CancelOrderCommand): Promise<OrderEntity | null> {
        const order = await this.orderRepo.findById(cmd.orderId);
        if (!order) return null;
        if (order.userId !== cmd.userId) throw new OrderOwnershipError();

        order.cancel();
        return this.orderRepo.save(order);
    }
}

export default CancelOrderUsecase;
