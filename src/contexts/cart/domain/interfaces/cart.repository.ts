import { CartEntity } from '../entity/cart.entity';

export interface ICartRepository {
    findByUserId(userId: string): Promise<CartEntity | null>;
    save(cart: CartEntity): Promise<CartEntity>;
}
