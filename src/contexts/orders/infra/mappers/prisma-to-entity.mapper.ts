import { OrderEntity } from '../../domain/entity/order.entity';

export const prismaToOrderEntity = (p: any): OrderEntity => {
    if (!p) return null as any;
    const items = p.items as any[] || [];
    return new OrderEntity(p.id, p.userId, items.map(i => ({ productId: i.productId, quantity: i.quantity })), p.total);
};
