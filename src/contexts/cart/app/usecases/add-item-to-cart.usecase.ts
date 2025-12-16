import { AddItemCommand } from '../commands/add-item.command';
import { ICartReadRepository } from '../ports/cart-read.repository';
import { ICartWriteRepository } from '../ports/cart-write.repository';
import PricingServicePort from '../ports/pricing-service.port';
import CartItemEntity from '../../domain/entity/cart-item.entity';
import { CartEntity } from '../../domain/entity/cart.entity';
import { InvalidProductError } from '../../domain/errors/cart.errors';

export class AddItemToCartUseCase {
    constructor(
        private readonly cartReadRepo: ICartReadRepository,
        private readonly cartWriteRepo: ICartWriteRepository,
        private readonly pricing: PricingServicePort
    ) { }

    async execute(cmd: AddItemCommand): Promise<CartEntity> {
        const price = await this.pricing.getPrice(cmd.productId);
        if (price === null) throw new InvalidProductError();

        const existingCart = await this.cartReadRepo.findByUserId(cmd.userId);
        const cart = existingCart ?? new CartEntity({ userId: cmd.userId, items: [] });

        const item = new CartItemEntity({ productId: cmd.productId, quantity: cmd.quantity, price });
        cart.addItem(item);

        return this.cartWriteRepo.save(cart);
    }
}

export default AddItemToCartUseCase;
