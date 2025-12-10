import { CreateCategoryCommand } from '../commands/create-category.command';
import { ICategoryRepository } from '../../domain/interfaces/category.repository';
import { CategoryEntity } from '../../domain/entity/category.entity';

export class CreateCategoryUsecase {
    constructor(private readonly repo: ICategoryRepository) { }

    async execute(cmd: CreateCategoryCommand): Promise<CategoryEntity> {
        const entity = new CategoryEntity(Date.now().toString(), cmd.name);
        return this.repo.create(entity);
    }
}
