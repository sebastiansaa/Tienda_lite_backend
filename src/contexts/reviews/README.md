# Reviews Context

Sistema de reseñas para productos de la tienda. Garantiza que solo clientes con compras completadas puedan opinar y mantiene respuestas públicas sin exponer datos sensibles.

## Estructura de Carpetas

- `api/`: Controlador HTTP, DTOs y mapper que transforman comandos/queries ↔ respuestas.
- `app/`: Casos de uso CQRS, comandos/queries y puertos hacia repositorios/adaptadores.
- `domain/`: `ReviewEntity`, Value Objects (ID, Rating, Comment, Reviewer, Product) y errores de dominio.
- `infra/`: Implementaciones Prisma y adaptadores a Auth, User, Products y Orders.
- `constants.ts`: Tokens de inyección para repositorios y puertos externos.
- `reviews.module.ts`: Módulo Nest que cablea dependencias y expone el controlador.

## Endpoints

### Públicos

- `GET /reviews/product/:productId`: Lista paginada de reseñas públicas de un producto (sin datos del autor).

### Usuario Autenticado (`JwtAuthGuard`)

- `POST /reviews`: Crea o reemplaza reseña propia para un producto comprado (1 reseña por producto).
- `GET /reviews/me`: Lista reviews privadas del usuario autenticado (incluye metadata interna).
- `DELETE /reviews/:id`: Elimina reseña propia de forma permanente.

## Reglas de Negocio

- Solo usuarios con órdenes completadas que incluyan el producto pueden crear reseña.
- Un usuario no puede crear más de una reseña por producto; el comando realiza upsert controlado.
- Comentarios son sanitizados (trim, colapsar espacios) y ratings forzados al rango `[1,5]`.
- Las respuestas públicas nunca incluyen identificadores de usuario.

## Integraciones

- **Auth**: `ReviewsAuthAdapter` valida la identidad del usuario autenticado.
- **User**: `ReviewsUserAdapter` delega en el `UserVerificationPort` expuesto por `UserContext` para garantizar que el usuario exista y esté activo.
- **Products**: `ReviewsProductAdapter` usa el `ProductValidationPort` de `ProductsContext` para chequear disponibilidad.
- **Orders**: `ReviewsOrdersAdapter` consume `OrderPurchaseHistoryPort` de `OrdersContext` para confirmar compras completadas antes de permitir reseñas.

## Persistencia

- Repositorios Prisma (`Read`/`Write`) separados para lecturas paginadas y mutaciones.
- Mapper transforma `Prisma.Review` ↔ `ReviewEntity` asegurando consistencia de VOs.
- Consultas públicas filtran campos sensibles y ordenan por `createdAt` descendente.
