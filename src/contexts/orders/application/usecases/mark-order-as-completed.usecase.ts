import MarkOrderAsCompletedCommand from '../commands/mark-order-completed.command';
import OrderRepositoryPort from '../ports/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

export class MarkOrderAsCompletedUsecase {
    constructor(private readonly orderRepo: OrderRepositoryPort) { }

    async execute(cmd: MarkOrderAsCompletedCommand): Promise<OrderEntity | null> {
        const order = await this.orderRepo.findById(cmd.orderId);
        if (!order) return null;
        if (order.userId !== cmd.userId) throw new OrderOwnershipError();

        order.markCompleted();
        return this.orderRepo.save(order);
    }
}

export default MarkOrderAsCompletedUsecase;
