/**- Son OBJ inmutables que representan un concepto del dominio, pero no tienen identidad propia (a diferencia de una entidad).
- Encapsulan reglas de negocio y validaciones alrededor de un valor primitivo → no es un simple valor, sino un concepto con reglas.
- Se comparan por valor, no por identidad: dos VO con el mismo contenido son equivalentes aunque sean instancias distintas.
- Garantizan consistencia: si un VO existe, su valor ya pasó todas las validaciones y es válido en cualquier parte del sistema.  */

import { InvalidSlugError } from '../errors/product.errors';

export class Slug {
    private readonly _value: string;

    constructor(value: unknown) {
        if (value === undefined || value === null) {
            throw new InvalidSlugError('Invariant: slug es obligatorio');
        }

        const val = String(value).trim().toLowerCase();

        const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!regex.test(val)) {
            throw new InvalidSlugError(
                'Invariant: slug debe contener solo minúsculas, números y guiones, sin guiones consecutivos ni al inicio/final',
            );
        }

        if (val.length < 3) {
            throw new InvalidSlugError('Invariant: slug debe tener al menos 3 caracteres');
        }

        this._value = val;
    }

    get value(): string {
        return this._value;
    }

    equals(other: Slug): boolean {
        return this._value === other.value;
    }
}