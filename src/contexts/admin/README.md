Admin

- Proposito: capa tecnica de orquestacion para vistas y operaciones administrativas, sin dominio propio.
- Responsabilidades: exponer consultas y acciones seguras sobre usuarios, productos, ordenes, pagos e inventario con puertos read-only.

Capas

- app: usecases de listado/detalle y acciones simples (cambiar estado de usuario, actualizar producto, cancelar/ship/complete orden, ajustar stock) sobre puertos admin.

- infra: adaptadores Prisma por recurso (user/product/order/payment/inventory) que implementan los puertos readonly.

- API: AdminController, DTOs, mapper plano; protegido con JwtAuthGuard + RolesGuard (rol admin).

- Domain: no aplica (contexto tecnico).

Puertos expuestos

- Read-only: UserAdminReadOnlyPort, ProductAdminReadOnlyPort, OrderAdminReadOnlyPort, PaymentAdminReadOnlyPort, InventoryAdminReadOnlyPort.

Adaptadores implementados

- Prisma: admin-user.prisma.adapter.ts, admin-product.prisma.adapter.ts, admin-order.prisma.adapter.ts, admin-payment.prisma.adapter.ts, admin-inventory.prisma.adapter.ts.

Endpoints principales (todos bajo prefijo /admin, rol admin requerido)

- Usuarios: GET /admin/users, GET /admin/users/:id, PATCH /admin/users/:id/status.
- Productos: GET /admin/products, GET /admin/products/:id, PATCH /admin/products/:id.
- Categorías: GET /admin/categories, GET /admin/categories/:id, POST /admin/categories, PATCH /admin/categories/:id, DELETE /admin/categories/:id.
- Órdenes: GET /admin/orders, GET /admin/orders/:id, POST /admin/orders/:id/cancel|ship|complete.
- Pagos: GET /admin/payments, GET /admin/payments/:id.
- Inventario: GET /admin/inventory, GET /admin/inventory/:productId, PATCH /admin/inventory/:productId/adjust.

Integraciones

- Lee datos directamente via Prisma sin tocar dominios ajenos; depende de Auth para autenticacion/roles.
- Consumidores front deben usar el prefijo `/admin/*` con rol admin.

Diagrama textual

- HTTP -> AdminController -> DTO -> Mapper -> UseCase -> AdminPort -> PrismaAdapter -> DB -> respuesta -> Mapper -> DTO.

Notas de diseño

- Solo lectura/modificaciones acotadas; no se crean reglas nuevas de negocio aqui.
- Usa tokens ADMIN\_\* para DI y mantener independencia de implementaciones.

Razon de aislamiento

- Evita exponer entidades o invariantes de otros dominios; opera sobre proyecciones/summary y mantiene Auth como unica dependencia transversal.

Resumen operativo
- Propósito: proyecciones y acciones acotadas para admins sobre usuarios/productos/órdenes/pagos/inventario/categorías.
- Endpoints: `/admin/users`, `/admin/products`, `/admin/orders`, `/admin/payments`, `/admin/inventory`, `/admin/categories`.
- Roles requeridos: admin (JwtAuthGuard + RolesGuard).
- Estados: refleja estados de cada recurso (usuarios ACTIVE/SUSPENDED/DELETED; órdenes pending/paid/completed/cancelled; pagos pending/succeeded/failed; inventario onHand/reserved; categorías activas/inactivas).
