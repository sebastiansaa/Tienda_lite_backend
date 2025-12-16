import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderItemProps } from '../../domain/entity/order-item.entity';
import { EmptyOrderError, ProductUnavailableError } from '../../domain/errors/order.errors';
import CreateOrderFromItemsCommand from '../commands/create-order-from-items.command';
import { IOrderWriteRepository } from '../ports/order-write.repository';
import ProductReadOnlyPort from '../ports/product-read.port';
import PricingServicePort from '../ports/pricing.service.port';
import StockServicePort from '../ports/stock.service.port';

export class CreateOrderFromItemsUsecase {
    constructor(
        private readonly orderWriteRepo: IOrderWriteRepository,
        private readonly productRead: ProductReadOnlyPort,
        private readonly pricing: PricingServicePort,
        private readonly stock: StockServicePort,
    ) { }

    async execute(cmd: CreateOrderFromItemsCommand): Promise<OrderEntity> {
        if (!cmd.items || cmd.items.length === 0) throw new EmptyOrderError();

        const items: OrderItemProps[] = [];
        for (const input of cmd.items) {
            const product = await this.productRead.findById(input.productId);
            if (!product) throw new ProductUnavailableError('Product not found');

            const isStockAvailable = await this.stock.isAvailable(input.productId, input.quantity);
            if (!isStockAvailable) throw new ProductUnavailableError('Insufficient stock');

            const price = (await this.pricing.getPrice(input.productId)) ?? product.price;
            items.push({ productId: input.productId, quantity: input.quantity, price });
        }

        const order = new OrderEntity({ userId: cmd.userId, items, status: 'PENDING' });
        return this.orderWriteRepo.save(order);
    }
}

export default CreateOrderFromItemsUsecase;
