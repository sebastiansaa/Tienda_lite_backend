import { ClearCartCommand } from '../commands/clear-cart.command';
import { CartRepositoryPort } from '../ports/cart.repository';

export class ClearCartUsecase {
    constructor(private readonly cartRepo: CartRepositoryPort) { }

    async execute(cmd: ClearCartCommand): Promise<void> {
        await this.cartRepo.clear(cmd.userId);
    }
}

export default ClearCartUsecase;
