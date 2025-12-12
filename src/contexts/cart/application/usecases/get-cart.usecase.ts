import { GetCartQuery } from '../queries/get-cart.query';
import { CartRepositoryPort } from '../ports/cart.repository';
import { CartEntity } from '../../domain/entity/cart.entity';

export class GetCartUsecase {
    constructor(private readonly cartRepo: CartRepositoryPort) { }

    async execute(query: GetCartQuery): Promise<CartEntity | null> {
        return this.cartRepo.findByUserId(query.userId);
    }
}

export default GetCartUsecase;
