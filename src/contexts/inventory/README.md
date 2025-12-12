Inventory

- Proposito: gestionar existencias, reservas y movimientos de stock por producto.
- Responsabilidades: aumentar/disminuir stock, reservar/liberar, consultar disponibilidad y registrar movimientos.

Capas
- Domain: `InventoryItemEntity`, `StockMovementEntity`; VOs para cantidades y fechas; errores `InsufficientStock`, `InvalidMovement`, `NegativeStock`.
- Application: usecases IncreaseStock, DecreaseStock, ReserveStock, ReleaseStock, GetStock, ListMovements; puertos `InventoryRepositoryPort`, `ProductReadOnlyPort`.
- Infrastructure: `InventoryPrismaRepository` (persiste items/movements), `ProductReadOnlyAdapter` para leer productos via `PRODUCT_READONLY`.
- API: `InventoryController`, DTOs, `InventoryApiMapper`; admin guard en mutaciones.

Invariantes
- onHand y reserved no negativos; movimientos registran before/after; no se reserva mas de lo disponible.

Puertos expuestos
- `INVENTORY_REPOSITORY`, `INVENTORY_PRODUCT_READONLY` (interno), `INVENTORY_ORDER_READONLY` reservado para futuras integraciones.

Adaptadores implementados
- Prisma repo; product read adapter consume puerto de Products.

Endpoints
- GET /inventory/:productId, GET /inventory/:productId/movements, POST /inventory/:productId/increase|decrease|reserve|release.

Integraciones
- Consume Products (read-only) para validar existencia; puede ser consultado por Admin; usada por Orders a traves de StockServiceAdapter (en contexto Orders).

Diagrama textual
- HTTP -> InventoryController -> DTO -> Mapper -> UseCase -> (Inventory repo | ProductRead port) -> Prisma/Adapter -> DB -> Mapper -> DTO.

Notas de diseño
- Movimientos quedan auditados con razones; reserva/liberacion mantienen consistencia de onHand/reserved.

Razon de aislamiento
- Stock se modela fuera de Productos; solo se comparten proyecciones y IDs, evitando mezclar reglas de catalogo con inventario.
