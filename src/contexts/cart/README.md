Cart

- Propósito: gestionar el carrito del usuario autenticado (agregar, actualizar cantidades, eliminar y vaciar), garantizando precios recalculados y consistencia de stock básico.
- Responsabilidades: mantener items y cantidades, validar productos y cantidades, recalcular totales vía servicio de pricing, exponer lectura del carrito actual.

Capas
Domain

- Entidades:
- CartEntity
- CartItemEntity
- Value Objects:
- CartId, UserId, ProductId, Quantity, Price
- Reglas:
- cantidad positiva
- no permitir items duplicados
- totales calculados solo vía puerto de pricing
- Errores:
- CartNotFound
- DuplicateCartItem
- InvalidQuantity
- InvalidProduct

App
Casos de uso (CQRS):
Commands (write)

- AddItemToCart
- UpdateItemQuantity
- RemoveItem
- ClearCart
  Queries (read)
- GetCart
  Puertos
- `ICartReadRepository` (lectura del carrito)
- `ICartWriteRepository` (escritura del carrito)
- `PricingServicePort` (cálculo de totales y validación de producto/precio)

Infra

- Persistencia:
- `CartPrismaReadRepository` (implementa `ICartReadRepository`)
- `CartPrismaWriteRepository` (implementa `ICartWriteRepository`)
- Servicios:
- `CartPricingService` (implementa `PricingServicePort`)
- Mappers:
- `CartPrismaMapper` (Prisma ↔ Entidad)

API

- `CartController`
- DTOs request/response
- `CartApiMapper`
- Protegido con `JwtAuthGuard`

CQRS

- Separación total lectura/escritura.
- Write:
- `AddItemToCart`, `UpdateItemQuantity`, `RemoveItem`, `ClearCart`
- usan `ICartReadRepository` + `ICartWriteRepository` + `PricingServicePort`
- Read:
- `GetCart`
- usa `ICartReadRepository`
- Handlers separados por carpeta (simetría con Products).
- CommandBus para mutaciones, QueryBus para lecturas.

Invariantes

- Cantidad siempre positiva (Quantity > 0).
- No se permiten productos duplicados en el carrito.
- Totales siempre recalculados en cada comando.
- El carrito se crea on-demand si no existe.
- El dominio no conoce precios concretos, solo VOs y puertos.
- El dominio no conoce productos, solo ProductId.

Puertos expuestos

- `ICartReadRepository`
- `ICartWriteRepository`
- `PricingServicePort`
  Exportables para otros contextos si fuera necesario (por ejemplo, Orders).

Adaptadores implementados

- **Prisma**:
  - `CartPrismaReadRepository` (infra/persistence/cart-prisma-read.repository.ts)
  - `CartPrismaWriteRepository` (infra/persistence/cart-prisma-write.repository.ts)
- Pricing in-memory:
  `CartPricingService` (infra/services/cart-pricing.service.ts)

## Endpoints

- `GET /cart` → obtener carrito actual (Query)
- `POST /cart/items` → agregar item (Command)
- `PUT /cart/items/:productId` → actualizar cantidad (Command)
- `DELETE /cart/items/:productId` → eliminar item (Command)
- `DELETE /cart` → vaciar carrito (Command)

Integraciones

- Consume productos vía ProductsModule solo a través del PricingServicePort (validación de existencia y precio).
- Usa Auth para identificar al usuario (JwtAuthGuard).
- No depende directamente de ProductEntity ni ProductRepository.

Diagrama textual
-HTTP (API) -> CartController -> DTO -> ApiMapper-> (Command|Query) -> CommandBus/QueryBus -> UseCase Handler
-> (CartRepositoryPort | PricingServicePort) -> Adaptadores (Prisma / Pricing) -> DB / Servicio externo -> Mapper -> DTO -> HTTP

Notas de diseño
• El carrito no almacena precios finales, solo los recibe del servicio de pricing.
• El carrito se crea automáticamente si no existe para el usuario.
• Los errores de dominio se mapean a HTTP en el controller.
• El dominio es completamente puro: sin Prisma, sin DTOs, sin NestJS.

Razón de aislamiento

- El dominio del carrito no conoce productos, precios ni stock real.
  Solo conoce:
- ProductId
- Quantity
- Price como VO
- PricingServicePort para obtener totales
  Esto permite:
- cambiar motor de precios
- cambiar proveedor de productos
- cambiar persistencia
- sin tocar el dominio ni los casos de uso

Resumen operativo
- Propósito: gestionar carrito autenticado con totales recalculados.
- Endpoints: `GET /cart`, `POST /cart/items`, `PUT /cart/items/:productId`, `DELETE /cart/items/:productId`, `DELETE /cart`.
- Roles requeridos: JWT.
- Estados: carrito crea on-demand; errores `CartNotFound|DuplicateCartItem|InvalidQuantity|InvalidProduct`.
