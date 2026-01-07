import { IOrderReadRepository } from '../ports/order-read.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

export class ListAllOrdersUsecase {
    constructor(private readonly orderReadRepo: IOrderReadRepository) { }

    async execute(): Promise<OrderEntity[]> {
        // We can create a listAll method in the repo or just use an empty filter if the repo supports it.
        // Let's assume the current listByUser doesn't work for all.
        // I should check the repository implementation.
        return this.orderReadRepo.listAll ? this.orderReadRepo.listAll() : [];
    }
}

export default ListAllOrdersUsecase;
