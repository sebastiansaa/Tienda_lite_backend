import { UpdateItemQuantityCommand } from '../commands/update-item.command';
import { CartRepositoryPort } from '../ports/cart.repository';
import PricingServicePort from '../ports/pricing.service.port';
import { InvalidProductError, CartNotFoundError } from '../../domain/errors/cart.errors';
import CartItemEntity from '../../domain/entity/cart-item.entity';
import { CartEntity } from '../../domain/entity/cart.entity';

export class UpdateItemQuantityUsecase {
    constructor(
        private readonly cartRepo: CartRepositoryPort,
        private readonly pricing: PricingServicePort,
    ) { }

    async execute(cmd: UpdateItemQuantityCommand): Promise<CartEntity> {
        const cart = await this.cartRepo.findByUserId(cmd.userId);
        if (!cart) throw new CartNotFoundError();

        const price = await this.pricing.getPrice(cmd.productId);
        if (price === null) throw new InvalidProductError();

        // ensure item exists; if not, treat as add with quantity
        const exists = cart.items.find((i) => i.productId === cmd.productId);
        if (!exists) {
            const item = new CartItemEntity({ productId: cmd.productId, quantity: cmd.quantity, price });
            cart.addItem(item);
        } else {
            exists.updateQuantity(cmd.quantity);
        }

        return this.cartRepo.save(cart);
    }
}

export default UpdateItemQuantityUsecase;
