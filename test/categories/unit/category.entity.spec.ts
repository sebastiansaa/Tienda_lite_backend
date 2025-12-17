import { CategoryEntity } from 'src/contexts/categories/domain/entity/category.entity';
import { InvalidSortOrderError } from 'src/contexts/categories/domain/errors/category.errors';

describe('CategoryEntity', () => {
    it('should create entity with valid sortOrder', () => {
        const entity = CategoryEntity.create({ title: 'name', slug: 'slug', image: 'http://img.com', sortOrder: 1 });
        expect(entity).toBeInstanceOf(CategoryEntity);
        expect(entity.sortOrder).toBe(1);
    });

    it('should reject negative sortOrder', () => {
        expect(() => CategoryEntity.create({ title: 'name', slug: 'slug', image: 'http://img.com', sortOrder: -1 })).toThrow(
            InvalidSortOrderError,
        );
    });
});