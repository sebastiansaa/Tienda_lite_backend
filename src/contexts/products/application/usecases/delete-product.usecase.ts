import { DeleteProductCommand } from '../commands/delete-product.command';
import { IProductRepository } from '../ports/product.repository';

export class DeleteProductUsecase {
    constructor(private readonly repo: IProductRepository) { }

    async execute(cmd: DeleteProductCommand): Promise<void> {
        // repository decides soft/hard per implementation, allow caller to request hard delete
        await this.repo.deleteById(cmd.id, cmd.soft);
    }
}
