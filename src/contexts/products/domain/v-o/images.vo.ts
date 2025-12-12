import { ImageUrlVO } from '../../../shared/v-o/image-url.vo';

/**
 * Value Object para una colección de URLs de imagen.
 * Garantiza: no nulo, no vacío y todas las URLs válidas.
 */
export class ImagesVO {
    private readonly _values: string[];

    constructor(values: unknown) {
        if (!Array.isArray(values)) {
            throw new Error('Invariant: images debe ser un array');
        }
        if (values.length === 0) {
            throw new Error('Invariant: images no puede estar vacío');
        }
        this._values = values.map((v) => new ImageUrlVO(v as string).value);
    }

    get values(): string[] {
        return this._values;
    }

    add(url: string): ImagesVO {
        return new ImagesVO([...this._values, url]);
    }

    remove(url: string): ImagesVO {
        const next = this._values.filter((v) => v !== url);
        if (next.length === this._values.length) {
            throw new Error('ImageNotFound');
        }
        return new ImagesVO(next);
    }

    replace(urls: string[]): ImagesVO {
        return new ImagesVO(urls);
    }
}

export default ImagesVO;
