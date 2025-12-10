import { CategoryEntity } from '../../domain/entity/category.entity';

export const prismaToCategoryEntity = (p: any): CategoryEntity => {
    if (!p) return null as any;
    return new CategoryEntity(p.id, p.name);
};
