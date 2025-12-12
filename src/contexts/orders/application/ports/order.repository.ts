import { OrderEntity } from '../../domain/entity/order.entity';

export interface OrderRepositoryPort {
    findById(id: string): Promise<OrderEntity | null>;
    listByUser(userId: string): Promise<OrderEntity[]>;
    save(order: OrderEntity): Promise<OrderEntity>;
}

export default OrderRepositoryPort;
