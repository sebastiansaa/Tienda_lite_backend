import { OrderItem } from '../../domain/entity/order.entity';

export class CreateOrderCommand {
    constructor(public readonly userId: string, public readonly items: OrderItem[], public readonly total: number) { }
}
