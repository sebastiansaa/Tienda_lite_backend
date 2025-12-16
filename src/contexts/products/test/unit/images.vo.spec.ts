import { ImagesVO } from '../../domain/v-o/images.vo';
import { ImagesArrayNullError, ImagesArrayEmptyError, ImageNotFoundError } from '../../domain/errors/product.errors';

describe('ImagesVO', () => {
    it('debería crear una instancia válida con array de URLs', () => {
        const urls = ['http://example.com/img1.jpg', 'http://example.com/img2.jpg'];
        const images = new ImagesVO(urls);
        expect(images.values).toEqual(urls);
    });

    it('debería lanzar ImagesArrayNullError si no es un array', () => {
        expect(() => new ImagesVO(null)).toThrow(ImagesArrayNullError);
        expect(() => new ImagesVO('not-array')).toThrow(ImagesArrayNullError);
    });

    it('debería lanzar ImagesArrayEmptyError si el array está vacío', () => {
        expect(() => new ImagesVO([])).toThrow(ImagesArrayEmptyError);
    });

    it('debería añadir una imagen correctamente', () => {
        const initial = new ImagesVO(['http://a.com/1.jpg']);
        const updated = initial.add('http://a.com/2.jpg');
        expect(updated.values).toHaveLength(2);
        expect(updated.values).toContain('http://a.com/2.jpg');
        // Inmutabilidad
        expect(initial.values).toHaveLength(1);
    });

    it('debería eliminar una imagen existente', () => {
        const initial = new ImagesVO(['http://a.com/1.jpg', 'http://a.com/2.jpg']);
        const updated = initial.remove('http://a.com/1.jpg');
        expect(updated.values).toEqual(['http://a.com/2.jpg']);
    });

    it('debería lanzar ImageNotFoundError al intentar eliminar una imagen inexistente', () => {
        const initial = new ImagesVO(['http://a.com/1.jpg']);
        expect(() => initial.remove('http://b.com/missing.jpg')).toThrow(ImageNotFoundError);
    });
});
