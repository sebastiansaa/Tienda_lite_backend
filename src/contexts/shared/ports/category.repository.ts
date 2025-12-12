import { CategoryReadDto } from '../dtos/category.dto';

export interface CategoryRepositoryPort {
    findById(id: number | string): Promise<CategoryReadDto | null>;
    findAll?(): Promise<CategoryReadDto[]>;
}

export default CategoryRepositoryPort;
