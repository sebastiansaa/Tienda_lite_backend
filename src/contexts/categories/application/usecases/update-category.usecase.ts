import { UpdateCategoryCommand } from "../commands/update-category.command";
import { ICategoryRepository } from "../ports/category.repository";
import { CategoryEntity } from "../../domain/entity/category.entity";

export class UpdateCategoryUseCase {
    constructor(private readonly repo: ICategoryRepository) { }

    async execute(command: UpdateCategoryCommand): Promise<CategoryEntity> {
        const existing = await this.repo.findById(command.id);
        if (!existing) {
            throw new Error(`Category with id ${command.id} not found`);
        }

        if (command.slug && command.slug !== existing.slug) {
            const slugExists = await this.repo.findBySlug(command.slug);
            if (slugExists) {
                throw new Error(`Category with slug ${command.slug} already exists`);
            }
        }

        existing.update({
            title: command.title,
            slug: command.slug,
            image: command.image,
            description: command.description,
            active: command.active,
            sortOrder: command.sortOrder
        });

        return this.repo.save(existing);
    }
}
