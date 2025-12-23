Products

- Proposito: gestionar catalogo de productos (alta, baja, precio, stock) con reglas de titulo, slug, imagenes y categoria.
- Responsabilidades: mantener productos activos, stock basico y busquedas; proveer lectura readonly a otros contextos.

Capas

- Domain: `ProductEntity`, `StockEntity`; VOs `Title`, `Price`, `Images`, `Description`, `CategoryId`; reglas de slug, precio > 0, stock no negativo, imágenes obligatorias; errores de producto/stock.
- app: casos SaveProduct, DeleteProduct, RestoreProduct, UpdateStock, FindProductById, ListProducts, FindLowStock, SearchProducts, DecreaseStock; puertos `IProductWriteRepository` (write), `IProductReadRepository` (read dominio) y `ProductReadOnlyPort` (read DTO cross-context); policy `ProductCategoryPolicy` para validar categoría.
- infra: Prisma repos `ProductPrismaWriteRepository` (write) y `ProductPrismaReadRepository` (read/domain + DTO); helpers decimal; mapper `ProductPrismaMapper`; carpeta `infra/persistence`.
- API: `ProductsController`, DTOs request/response, `ProductApiMapper`; guardias admin en escritura; ValidationPipe aplicado.

CQRS

- Separación lectura/escritura.
- Write: SaveProduct, DeleteProduct, RestoreProduct, UpdateStock, DecreaseStock usan `IProductWriteRepository`; Save/Restore consultan read repo y policy de categoría.
- Read: FindProductById, ListProducts, SearchProducts, FindLowStock usan `IProductReadRepository` / `ProductReadOnlyPort`.
- Repos Prisma divididos en read/write.
- Providers expuestos: `PRODUCT_WRITE`, `PRODUCT_READONLY`.

Invariantes

- Titulo y slug no vacíos ni inválidos; precio > 0; stock no negativo; imágenes obligatorias; categoría válida (>0).

Puertos expuestos

- `PRODUCT_WRITE`, `PRODUCT_READONLY` para otros contextos; `ProductCategoryPolicy` depende de `CategoryRepositoryPort`.

Adaptadores implementados

- Prisma write/read; policy de categoría usa `CategoryRepositoryPort` sin acoplar dominio Category.

Endpoints

- POST /products (create/update), DELETE /products/:id, POST /products/:id/restore, PUT /products/:id/stock, GET /products, /products/search, /products/low-stock, /products/:id.

Integraciones

- Depende de Categories via puerto `CategoryRepositoryPort`; exporta `PRODUCT_READONLY` para Inventory/Orders/Admin.

Diagrama textual

- HTTP -> ProductsController -> DTO -> Mapper -> UseCase -> (ProductWrite/Read + Category policy) -> Prisma adapters -> DB -> Mapper -> DTO.

Notas de diseño

- Stock básico en dominio producto; movimientos detallados se delegan a Inventory.

Razón de aislamiento

- No importa entidades externas; usa IDs y puertos para categoría, permitiendo cambiar proveedor de categorías sin tocar dominio producto.

Resumen operativo
- Propósito: gestionar catálogo de productos y lectura pública/admin.
- Endpoints: `POST /products`, `DELETE /products/:id`, `POST /products/:id/restore`, `PUT /products/:id/stock`, `GET /products`, `GET /products/search`, `GET /products/low-stock`, `GET /products/:id`.
- Roles requeridos: público para GET; admin para POST/PUT/DELETE y low-stock.
- Estados: producto activo/inactivo, eliminado/restaurable; stock no negativo.
