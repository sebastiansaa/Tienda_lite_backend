import GetOrderByIdQuery from '../queries/get-order-by-id.query';
import OrderRepositoryPort from '../ports/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

export class GetOrderByIdUsecase {
    constructor(private readonly orderRepo: OrderRepositoryPort) { }

    async execute(query: GetOrderByIdQuery): Promise<OrderEntity | null> {
        const order = await this.orderRepo.findById(query.orderId);
        if (!order) return null;
        if (order.userId !== query.userId) throw new OrderOwnershipError();
        return order;
    }
}

export default GetOrderByIdUsecase;
