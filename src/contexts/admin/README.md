Admin

- Proposito: capa tecnica de orquestacion para vistas y operaciones administrativas, sin dominio propio.
- Responsabilidades: exponer consultas y acciones seguras sobre usuarios, productos, ordenes, pagos e inventario con puertos read-only.

Capas
- Application: usecases de listado/detalle y acciones simples (cambiar estado de usuario, actualizar producto, cancelar/ship/complete orden, ajustar stock) sobre puertos admin.
- Infrastructure: adaptadores Prisma por recurso (user/product/order/payment/inventory) que implementan los puertos readonly.
- API: AdminController, DTOs, mapper plano; protegido con JwtAuthGuard + RolesGuard (rol admin).
- Domain: no aplica (contexto tecnico).

Puertos expuestos
- Read-only: UserAdminReadOnlyPort, ProductAdminReadOnlyPort, OrderAdminReadOnlyPort, PaymentAdminReadOnlyPort, InventoryAdminReadOnlyPort.

Adaptadores implementados
- Prisma: admin-user.prisma.adapter.ts, admin-product.prisma.adapter.ts, admin-order.prisma.adapter.ts, admin-payment.prisma.adapter.ts, admin-inventory.prisma.adapter.ts.

Endpoints principales (todos bajo /admin, rol admin requerido)
- Usuarios: GET /users, GET /users/:id, PATCH /users/:id/status.
- Productos: GET /products, GET /products/:id, PATCH /products/:id.
- Ordenes: GET /orders, GET /orders/:id, POST /orders/:id/cancel|ship|complete.
- Pagos: GET /payments, GET /payments/:id.
- Inventario: GET /inventory, GET /inventory/:productId, PATCH /inventory/:productId/adjust.

Integraciones
- Lee datos directamente via Prisma sin tocar dominios ajenos; depende de Auth para autenticacion/roles.

Diagrama textual
- HTTP -> AdminController -> DTO -> Mapper -> UseCase -> AdminPort -> PrismaAdapter -> DB -> respuesta -> Mapper -> DTO.

Notas de diseño
- Solo lectura/modificaciones acotadas; no se crean reglas nuevas de negocio aqui.
- Usa tokens ADMIN_* para DI y mantener independencia de implementaciones.

Razon de aislamiento
- Evita exponer entidades o invariantes de otros dominios; opera sobre proyecciones/summary y mantiene Auth como unica dependencia transversal.
