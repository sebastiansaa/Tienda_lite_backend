import { ICategoryRepository } from "../ports/category.repository";

export class DeleteCategoryUseCase {
    constructor(private readonly repo: ICategoryRepository) { }

    async execute(id: number): Promise<void> {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new Error(`Category with id ${id} not found`);
        }
        existing.delete();
        await this.repo.save(existing);
    }
}
