import { Injectable, Inject } from "@nestjs/common";
import { CategoryRepositoryPort } from "../../../shared/ports/category.repository";
import { CategoryReadDto } from "../../../shared/dtos/category.dto";
import type { ICategoryRepository } from "../../application/ports/category.repository";
import { CATEGORY_REPOSITORY } from "../../constants";

@Injectable()
export class CategorySharedAdapter implements CategoryRepositoryPort {
    constructor(
        @Inject(CATEGORY_REPOSITORY) private readonly repo: ICategoryRepository
    ) { }

    async findById(id: number | string): Promise<CategoryReadDto | null> {
        const numericId = Number(id);
        if (isNaN(numericId)) return null;

        const entity = await this.repo.findById(numericId);
        if (!entity) return null;

        return {
            id: entity.id!,
            name: entity.title
        };
    }

    async findAll(): Promise<CategoryReadDto[]> {
        const entities = await this.repo.findAll();
        return entities.map(e => ({
            id: e.id!,
            name: e.title
        }));
    }
}
