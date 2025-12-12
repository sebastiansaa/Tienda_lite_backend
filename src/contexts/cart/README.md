Cart

- Proposito: gestionar el carrito del usuario autenticado (agregar, actualizar cantidades, eliminar y vaciar) garantizando precios recalculados.
- Responsabilidades: mantener items y cantidades, recalcular totales con servicio de pricing, validar cantidades y existencia de productos.

Capas
- Domain: `CartEntity`, `CartItemEntity`; VOs `CartId`, `UserId`, `ProductId`, `Quantity`, `Price`; errores `CartNotFound`, `DuplicateCartItem`, `InvalidQuantity`, `InvalidProduct`.
- Application: casos de uso `AddItemToCart`, `UpdateItemQuantity`, `RemoveItem`, `GetCart`, `ClearCart`; puertos `CartRepositoryPort`, `PricingServicePort`.
- Infrastructure: `CartPrismaRepository` (implementa repo), `CartPricingService` (servicio de precios), mapper Prisma↔Entidad incluido en repo.
- API: `CartController`, DTOs de entrada/salida, `CartApiMapper`; protegido con `JwtAuthGuard`.

Invariantes y reglas
- Cantidad siempre positiva; productos duplicados en el carrito se rechazan.
- Totales se recalculan en cada mutacion via `PricingServicePort`.

Puertos expuestos
- `CartRepositoryPort` (persistencia del carrito).
- `PricingServicePort` (calculo de totales y descuentos simples).

Adaptadores implementados
- Prisma: `CartPrismaRepository` (infra/repository/cart-prisma.repository.ts).
- Pricing in-memory: `CartPricingService` (infra/services/cart-pricing.service.ts).

Endpoints
- `GET /cart` obtener carrito actual.
- `POST /cart/items` agregar item.
- `PUT /cart/items/:productId` actualizar cantidad.
- `DELETE /cart/items/:productId` eliminar item.
- `DELETE /cart` vaciar carrito.

Integraciones
- Consume productos via `ProductsModule` para validaciones (solo a traves de puerto de pricing/adaptador).
- Usa Auth para identificar al usuario.

Diagrama textual
- HTTP -> Controller -> DTO -> ApiMapper -> UseCase -> (Repository|Pricing service ports) -> Adaptadores (Prisma / Pricing) -> DB/respuesta -> Mapper -> DTO -> HTTP.

Notas de diseño
- Carrito se crea on-demand si no existe (entidad vacia).
- Errores de dominio se mapean a HTTP en controller.

Razon de aislamiento
- El dominio del carrito no conoce detalles de producto ni precios concretos; solo usa puertos y VOs, permitiendo cambiar motor de precios o persistencia sin afectar el negocio.
