import { ICategoryReadRepository } from "../ports/category-read.repository";
import { ICategoryWriteRepository } from "../ports/category-write.repository";

export class DeleteCategoryUseCase {
    constructor(
        private readonly readRepo: ICategoryReadRepository,
        private readonly writeRepo: ICategoryWriteRepository
    ) { }

    async execute(id: number): Promise<void> {
        const existing = await this.readRepo.findById(id);
        if (!existing) {
            throw new Error(`Category with id ${id} not found`);
        }

        await this.writeRepo.delete(id);
    }
}
