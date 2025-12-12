Orders

- Proposito: orquestar la creacion y ciclo de vida de ordenes de compra del usuario.
- Responsabilidades: crear orden desde carrito o items, validar disponibilidad/precio, transicionar estados (pending, paid, completed, cancelled), listar y consultar.

Capas
- Domain: `OrderEntity`, `OrderItemEntity`; VOs `OrderId`, `UserId`, `ProductId`, `Quantity`, `Price`, `TotalAmount`, `OrderStatus`, timestamps; errores `EmptyOrder`, `ProductUnavailable`, `InvalidOrderState`, `OrderOwnership`.
- Application: usecases CreateOrderFromCart, CreateOrderFromItems, GetOrderById, ListOrdersForUser, CancelOrder, MarkOrderAsPaid, MarkOrderAsCompleted; puertos `OrderRepositoryPort`, `CartReadOnlyPort`, `ProductReadOnlyPort`, `PricingServicePort`, `StockServicePort`.
- Infrastructure: `PrismaOrderRepository` (persistencia), adaptadores `CartReadOnlyAdapter`, `ProductReadOnlyAdapter`, `PricingServiceAdapter`, `StockServiceAdapter` que consumen otros contextos via puertos.
- API: `OrdersController`, DTOs, `OrderApiMapper`; protegido con JwtAuthGuard.

Invariantes
- Orden debe tener al menos un item; cantidades positivas; estados siguen flujo Pending -> Paid -> Completed o Cancelled; ownership valida userId.

Puertos expuestos
- Tokens `ORDER_REPOSITORY`, `ORDER_CART_READONLY`, `ORDER_PRODUCT_READONLY`, `ORDER_PRICING_SERVICE`, `ORDER_STOCK_SERVICE` (para inyeccion interna y potencial reuse).

Adaptadores implementados
- Prisma repo; cart/product read adapters; pricing and stock adapters delegan a pricing/cart/inventory services.

Endpoints
- POST /orders/from-cart, POST /orders (items), GET /orders, GET /orders/:id, PATCH /orders/:id/cancel|pay|complete.

Integraciones
- Consume Cart, Products, Inventory a traves de puertos; depende de Auth para usuario.

Diagrama textual
- HTTP -> OrdersController -> DTO -> Mapper -> UseCase -> (OrderRepo + external ports) -> Adapters -> external services/DB -> Mapper -> DTO.

Notas de diseño
- Evita dependencias directas de dominios externos; pricing/stock abstraidos en puertos para testear en memoria.

Razon de aislamiento
- El dominio Order solo conoce proyecciones de otros contextos; todas las verificaciones cruzadas se hacen via puertos, manteniendo reglas propias encapsuladas.
