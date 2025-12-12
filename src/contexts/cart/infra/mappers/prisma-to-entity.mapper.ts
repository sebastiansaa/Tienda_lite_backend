import { CartEntity } from '../../domain/entity/cart.entity';

export const prismaToCartEntity = (p: any): CartEntity => {
    if (!p) return null as any;
    return new CartEntity(p.id, p.userId, p.items || []);
};
