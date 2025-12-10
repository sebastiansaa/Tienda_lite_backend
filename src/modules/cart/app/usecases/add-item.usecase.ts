import { AddItemCommand } from '../commands/add-item.command';
import { ICartRepository } from '../../domain/interfaces/cart.repository';
import { CartEntity } from '../../domain/entity/cart.entity';

export class AddItemUsecase {
    constructor(private readonly repo: ICartRepository) { }

    async execute(cmd: AddItemCommand): Promise<CartEntity> {
        let cart = await this.repo.findByUserId(cmd.userId);
        if (!cart) cart = new CartEntity(Date.now().toString(), cmd.userId, []);
        cart.addItem(cmd.item);
        return this.repo.save(cart);
    }
}
