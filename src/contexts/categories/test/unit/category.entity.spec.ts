import { CategoryEntity } from '../../domain/entity/category.entity';

describe('CategoryEntity', () => {
    const validProps = {
        title: 'Electronics',
        slug: 'electronics',
        image: 'http://img.com/cat.jpg',
        description: 'Electronic items',
        active: true,
        sortOrder: 1
    };

    it('should create a valid category', () => {
        const category = CategoryEntity.create(validProps);
        expect(category).toBeDefined();
        expect(category.title).toBe(validProps.title);
        expect(category.slug).toBe(validProps.slug);
        expect(category.createdAt).toBeDefined();
    });

    it('should allow updating properties', () => {
        const category = CategoryEntity.create(validProps);
        category.update({ title: 'New Title' });
        expect(category.title).toBe('New Title');
        expect(category.updatedAt.getTime()).toBeGreaterThanOrEqual(category.createdAt.getTime());
    });

    it('should handle soft delete and restore', () => {
        const category = CategoryEntity.create(validProps);
        expect(category.active).toBe(true);
        expect(category.deletedAt).toBeUndefined();

        category.delete();
        expect(category.active).toBe(false);
        expect(category.deletedAt).toBeDefined();

        category.restore();
        expect(category.active).toBe(true);
        expect(category.deletedAt).toBeUndefined();
    });
});
