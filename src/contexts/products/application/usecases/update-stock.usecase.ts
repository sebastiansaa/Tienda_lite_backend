import { UpdateStockCommand } from '../commands/update-stock.command';
import { IProductRepository } from '../ports/product.repository';

export class UpdateStockUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(cmd: UpdateStockCommand): Promise<import('../../domain/entity/product.entity').ProductEntity> {
        // repository will return the updated entity
        return this.repo.updateStock(cmd.id, cmd.quantity);
    }
}
