import { ProductEntity } from 'src/contexts/products/domain/entity/product.entity';

const validProps = {
    id: 1,
    title: 'Test Product',
    slug: 'test-product',
    price: 100,
    description: 'Description',
    stock: 10,
    images: ['http://img.com/1.jpg'],
    categoryId: 1,
    active: true,
};

describe('ProductEntity', () => {
    it('debería crear un producto válido', () => {
        const product = ProductEntity.create(validProps);
        expect(product).toBeDefined();
        expect(product.stock).toBe(10);
        expect(product.active).toBe(true);
    });

    it('debería devolver el valor numérico del stock y no la entidad', () => {
        const product = ProductEntity.create(validProps);
        expect(typeof product.stock).toBe('number');
    });

    it('debería permitir modificar el stock via setStock', () => {
        const product = ProductEntity.create(validProps);
        product.setStock(20);
        expect(product.stock).toBe(20);
    });

    it('debería marcarse como inactivo si se crea con stock 0', () => {
        const product = ProductEntity.create({ ...validProps, stock: 0 });
        expect(product.active).toBe(false);
    });

    describe('Integridad del Stock (simulada via métodos)', () => {
        it('debería actualizar updatedAt al cambiar stock', () => {
            const product = ProductEntity.create(validProps);
            const originalUpdate = product.updatedAt;

            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            product.setStock(50);
            expect(product.updatedAt.getTime()).toBeGreaterThan(originalUpdate.getTime());
            jest.useRealTimers();
        });
    });
});
