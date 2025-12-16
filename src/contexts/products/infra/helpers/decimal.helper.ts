/**
 * Helpers para convertir valores Decimal (Prisma) a números/strings.
 *
 * Comentario importante sobre `any`:
 * - Prisma's generated `Decimal` runtime object does not have an exported
 *   TypeScript type usable here sin importar Prisma en el dominio.
 * - Por separación de capas, dejamos los casts y comprobaciones específicas
 *   de Prisma aquí, en infra. El uso de `as any` se limita a este helper.
 * - Garantía: este `any` no sale de la capa infra; el resto del código usa
 *   tipos primitivos (`number`/`string`) exportados por este helper.
 */

export function isDecimalLike(x: unknown): x is { toNumber(): number } {
    return !!x && typeof x === 'object' && typeof (x as any).toNumber === 'function';
}

export function decimalToNumber(x: unknown): number {
    if (isDecimalLike(x)) return (x as { toNumber(): number }).toNumber();
    return Number(x as any);
}

export function decimalToString(x: unknown): string {
    if (isDecimalLike(x)) return (x as { toNumber(): number }).toNumber().toFixed(2);
    return Number(x as any).toFixed(2);
}

export default {
    isDecimalLike,
    decimalToNumber,
    decimalToString,
};
