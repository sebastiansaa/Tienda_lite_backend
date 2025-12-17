import { CategoryEntity } from 'src/contexts/categories/domain/entity/category.entity';
import { InvalidSortOrderError } from 'src/contexts/categories/domain/errors/category.errors';

describe('CategoryEntity', () => {
    it('should create entity with valid sortOrder', () => {
        const entity = CategoryEntity.create('name', 'slug', 'img', 1);
        expect(entity).toBeInstanceOf(CategoryEntity);
        expect(entity.sortOrder).toBe(1);
    });

    it('should reject non-positive sortOrder', () => {
        expect(() => CategoryEntity.create('name', 'slug', 'img', 0)).toThrow(InvalidSortOrderError);
    });
});