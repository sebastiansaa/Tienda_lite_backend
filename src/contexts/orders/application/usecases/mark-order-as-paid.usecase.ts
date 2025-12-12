import MarkOrderAsPaidCommand from '../commands/mark-order-paid.command';
import OrderRepositoryPort from '../ports/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

export class MarkOrderAsPaidUsecase {
    constructor(private readonly orderRepo: OrderRepositoryPort) { }

    async execute(cmd: MarkOrderAsPaidCommand): Promise<OrderEntity | null> {
        const order = await this.orderRepo.findById(cmd.orderId);
        if (!order) return null;
        if (order.userId !== cmd.userId) throw new OrderOwnershipError();

        order.markPaid();
        return this.orderRepo.save(order);
    }
}

export default MarkOrderAsPaidUsecase;
