import { CreateOrderCommand } from '../commands/create-order.command';
import { IOrderRepository } from '../../domain/interfaces/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

export class CreateOrderUsecase {
    constructor(private readonly repo: IOrderRepository) { }

    async execute(cmd: CreateOrderCommand): Promise<OrderEntity> {
        const entity = new OrderEntity(Date.now().toString(), cmd.userId, cmd.items, cmd.total);
        return this.repo.create(entity);
    }
}
