import { OrderEntity } from '../entity/order.entity';

export interface IOrderRepository {
    create(order: OrderEntity): Promise<OrderEntity>;
    findById(id: string): Promise<OrderEntity | null>;
}
