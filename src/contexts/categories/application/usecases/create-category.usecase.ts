import { CreateCategoryCommand } from "../commands/create-category.command";
import { ICategoryRepository } from "../ports/category.repository";
import { CategoryEntity } from "../../domain/entity/category.entity";

export class CreateCategoryUseCase {
    constructor(private readonly repo: ICategoryRepository) { }

    async execute(command: CreateCategoryCommand): Promise<CategoryEntity> {
        const existing = await this.repo.findBySlug(command.slug);
        if (existing) {
            throw new Error(`Category with slug ${command.slug} already exists`);
        }

        const entity = CategoryEntity.create({
            title: command.title,
            slug: command.slug,
            image: command.image,
            description: command.description,
            active: command.active,
            sortOrder: command.sortOrder
        });

        return this.repo.save(entity);
    }
}
