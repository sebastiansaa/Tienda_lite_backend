import { CreateOrderCommand } from '../commands/create-order.command';
import { IOrderRepository } from '../../domain/interfaces/order.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { DecreaseStockUsecase } from '../../../products/application/usecases/decrease-stock.usecase';

export class CreateOrderUsecase {
    constructor(
        private readonly repo: IOrderRepository,
        private readonly decreaseStockUsecase: DecreaseStockUsecase,
    ) { }

    async execute(cmd: CreateOrderCommand): Promise<OrderEntity> {
        // Decrement stock for each ordered item
        for (const item of cmd.items) {
            const productIdNum = parseInt(item.productId, 10);
            if (Number.isNaN(productIdNum)) throw new Error('Invalid product id');

            // Use products domain usecase to decrease stock (keeps cross-context intent explicit)
            await this.decreaseStockUsecase.execute(productIdNum, item.quantity);
        }

        const entity = new OrderEntity(Date.now().toString(), cmd.userId, cmd.items, cmd.total);
        return this.repo.create(entity);
    }
}
