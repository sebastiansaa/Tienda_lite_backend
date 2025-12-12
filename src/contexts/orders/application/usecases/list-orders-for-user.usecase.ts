import ListOrdersForUserQuery from '../queries/list-orders-for-user.query';
import OrderRepositoryPort from '../ports/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

export class ListOrdersForUserUsecase {
    constructor(private readonly orderRepo: OrderRepositoryPort) { }

    async execute(query: ListOrdersForUserQuery): Promise<OrderEntity[]> {
        return this.orderRepo.listByUser(query.userId);
    }
}

export default ListOrdersForUserUsecase;
