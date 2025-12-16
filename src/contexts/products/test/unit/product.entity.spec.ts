import { ProductEntity } from '../../domain/entity/product.entity';
import { StockInsufficientError } from '../../domain/errors/stock.errors';

// Mock de Props básicos para crear producto
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
        // Verificar que es un número primitivo
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
        // Como stockEntity ahora es privado, probamos su comportamiento a través de ProductEntity
        // Si Product expone métodos que deleguen en stockEntity (como decrement)
        // Nota: ProductEntity actualmente solo tiene setStock, pero la integridad se asegura al no exponer la entidad.

        it('debería actualizar updatedAt al cambiar stock', () => {
            const product = ProductEntity.create(validProps);
            const originalUpdate = product.updatedAt;

            // Simular paso del tiempo
            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            product.setStock(50);
            expect(product.updatedAt.getTime()).toBeGreaterThan(originalUpdate.getTime());
            jest.useRealTimers();
        });
    });
});
