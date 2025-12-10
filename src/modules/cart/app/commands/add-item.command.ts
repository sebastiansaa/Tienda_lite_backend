import { CartItem } from '../../domain/entity/cart.entity';

export class AddItemCommand {
    constructor(public readonly userId: string, public readonly item: CartItem) { }
}
