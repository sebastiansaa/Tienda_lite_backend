import { RemoveItemCommand } from '../commands/remove-item.command';
import { CartRepositoryPort } from '../ports/cart.repository';
import { CartNotFoundError } from '../../domain/errors/cart.errors';
import { CartEntity } from '../../domain/entity/cart.entity';

export class RemoveItemUsecase {
    constructor(private readonly cartRepo: CartRepositoryPort) { }

    async execute(cmd: RemoveItemCommand): Promise<CartEntity> {
        const cart = await this.cartRepo.findByUserId(cmd.userId);
        if (!cart) throw new CartNotFoundError();

        cart.removeItem(cmd.productId);
        return this.cartRepo.save(cart);
    }
}

export default RemoveItemUsecase;
