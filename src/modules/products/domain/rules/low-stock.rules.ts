// Rules son funciones o clases que expresan políticas de negocio transversales.
// valida si un producto está en low-stock antes de permitir una orden.

import { ProductEntity } from "../entity";

export class LowStockRule {
    static validate(product: ProductEntity, threshold: number = 5): boolean {
        return product.stock.isLowStock(threshold);
    }
}