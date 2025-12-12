import { ICategoryRepository } from "../ports/category.repository";
import { CategoryEntity } from "../../domain/entity/category.entity";

export class ListCategoriesUseCase {
    constructor(private readonly repo: ICategoryRepository) { }

    async execute(): Promise<CategoryEntity[]> {
        return this.repo.findAll();
    }
}
