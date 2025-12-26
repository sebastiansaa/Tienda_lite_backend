# Admin Context

## Propósito

Proporcionar una interfaz centralizada para **Métricas, Analíticas y Dashboard** de la tienda.

- **Nota Arquitectónica**: Este contexto **NO** realiza operaciones CRUD (Crear, Editar, Listar, Borrar) sobre entidades de negocio (Producto, Orden, Usuario). Cada una de esas responsabilidades pertenece a su propio Contexto (`/products`, `/users`, `/orders`, `/inventory`) y es consumida directamente por el frontend administrativo.
- El contexto `Admin` actúa como un **Agregador de Lectura** para facilitar vistas globales.

## Endpoints

| Método | Ruta               | Propósito                                                 | Guards                           |
| :----- | :----------------- | :-------------------------------------------------------- | :------------------------------- |
| `GET`  | `/admin/dashboard` | Obtener métricas agregadas (Usuarios, Ventas, Stock Bajo) | `JwtAuthGuard`, `Roles('admin')` |

**Ejemplo Response:**

```json
// GET /admin/dashboard
{
  "totalUsers": 1523,
  "totalRevenue": 45687.5,
  "totalOrders": 892,
  "pendingOrdersCount": 23,
  "lowStockProductsCount": 7
}
```

## Seguridad

- Todos los endpoints están protegidos por `JwtAuthGuard`.
- Requieren el rol explícito `admin`.

## Invariantes y Reglas

- **Solo Lectura Agregada**: El Admin Context no debe modificar el estado de las órdenes o el stock; eso es responsabilidad de `OrderContext` y `InventoryContext`.
- **Performance**: Las consultas de dashboard deben estar optimizadas (usando `count`, `sum` o agregaciones en DB) para no cargar grandes volúmenes de datos en memoria.

## Config/Integración

### Dependencias

- **PrismaService**: Realiza consultas de agregación transversales a toda la base de datos

### Tokens DI

- `GetDashboardStatsUsecase`: Único caso de uso que agrega métricas desde Prisma

**Arquitectura Limpia:**

```
Frontend Admin → llama directo a:
  - /products/* (CRUD productos)
  - /inventory/* (ajustes stock)
  - /orders/* (gestión órdenes)
  - /admin/dashboard (métricas agregadas)
```
