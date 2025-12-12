Products

- Proposito: gestionar catalogo de productos (alta, baja, precio, stock) con reglas de titulo, slug, imagenes y categoria.
- Responsabilidades: mantener productos activos, stock basico y busquedas; proveer lectura readonly a otros contextos.

Capas
- Domain: `ProductEntity`, `StockEntity`; VOs `Title`, `Price`, `Images`; reglas de slug y precio positivo; errores de producto/stock.
- Application: casos SaveProduct, DeleteProduct, RestoreProduct, UpdateStock, FindProductById, ListProducts, FindLowStock, SearchProducts, DecreaseStock; puertos `IProductRepository` (write) y `ProductReadOnlyPort` (read DTO).
- Infrastructure: Prisma repos `ProductPrismaWriteRepository`, `ProductPrismaReadRepository`; helpers decimal; mapper `ProductPrismaMapper`.
- API: `ProductsController`, DTOs request/response, `ProductApiMapper`; guardias admin en escritura.

Invariantes
- Titulo y slug no vacios ni invalidos; precio > 0; stock no negativo; imagenes validas.

Puertos expuestos
- `PRODUCT_WRITE`, `PRODUCT_READONLY` (exportado para Inventory/Orders/Admin).

Adaptadores implementados
- Prisma write/read; servicio `ProductCategoryService` usa `CategoryRepositoryPort` sin acoplar dominio Category.

Endpoints
- POST/DELETE/POST restore /products; PUT /products/:id/stock; GET /products, /products/search, /products/low-stock, /products/:id.

Integraciones
- Depende de Categories via puerto `CategoryRepositoryPort`; exporta `PRODUCT_READONLY` para Inventory/Orders/Admin.

Diagrama textual
- HTTP -> ProductsController -> DTO -> Mapper -> UseCase -> (ProductRepository|Category service) -> Prisma adapters -> DB -> Mapper -> DTO.

Notas de diseño
- Stock basico en dominio producto; movimientos detallados se delegan a Inventory.

Razon de aislamiento
- No importa entidades externas; usa IDs y puertos para categoria, permitiendo cambiar proveedor de categorias sin tocar dominio producto.
