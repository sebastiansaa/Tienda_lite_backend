import { CartEntity } from '../../domain/entity/cart.entity';

export interface CartRepositoryPort {
    findByUserId(userId: string): Promise<CartEntity | null>;
    save(cart: CartEntity): Promise<CartEntity>;
    clear(userId: string): Promise<void>;
}

export default CartRepositoryPort;
