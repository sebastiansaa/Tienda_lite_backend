import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderItemProps } from '../../domain/entity/order-item.entity';
import { EmptyOrderError, ProductUnavailableError } from '../../domain/errors/order.errors';
import CreateOrderFromCartCommand from '../commands/create-order-from-cart.command';
import OrderRepositoryPort from '../ports/order.repository';
import CartReadOnlyPort from '../ports/cart-read.port';
import ProductReadOnlyPort from '../ports/product-read.port';
import PricingServicePort from '../ports/pricing.service.port';
import StockServicePort from '../ports/stock.service.port';

export class CreateOrderFromCartUsecase {
    constructor(
        private readonly orderRepo: OrderRepositoryPort,
        private readonly cartRead: CartReadOnlyPort,
        private readonly productRead: ProductReadOnlyPort,
        private readonly pricing: PricingServicePort,
        private readonly stock: StockServicePort,
    ) { }

    async execute(cmd: CreateOrderFromCartCommand): Promise<OrderEntity> {
        const cartItems = await this.cartRead.getCartItems(cmd.userId);
        if (!cartItems || cartItems.length === 0) throw new EmptyOrderError();

        const items: OrderItemProps[] = [];
        for (const cartItem of cartItems) {
            const item = await this.buildItem(cartItem.productId, cartItem.quantity, cartItem.price);
            items.push(item);
        }

        const order = new OrderEntity({ userId: cmd.userId, items, status: 'PENDING' });
        return this.orderRepo.save(order);
    }

    private async buildItem(productId: number, quantity: number, snapshotPrice?: number): Promise<OrderItemProps> {
        const product = await this.productRead.findById(productId);
        if (!product) throw new ProductUnavailableError('Product not found');

        const isStockAvailable = await this.stock.isAvailable(productId, quantity);
        if (!isStockAvailable) throw new ProductUnavailableError('Insufficient stock');

        const price = (await this.pricing.getPrice(productId))
            ?? snapshotPrice
            ?? product.price;

        return { productId, quantity, price };
    }
}

export default CreateOrderFromCartUsecase;
