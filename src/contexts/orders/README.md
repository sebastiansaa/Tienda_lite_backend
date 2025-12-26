# Orders Context

## Propósito

Gestionar ciclo de vida completo de órdenes de compra con transiciones de estado y validación de ownership.

## Endpoints

| Método  | Ruta                   | Propósito                                        |
| ------- | ---------------------- | ------------------------------------------------ |
| `POST`  | `/orders/from-cart`    | Crear orden desde carrito del usuario            |
| `POST`  | `/orders`              | Crear orden con items específicos                |
| `GET`   | `/orders`              | Listar órdenes del usuario autenticado           |
| `GET`   | `/orders/:id`          | Obtener orden por ID (validación de ownership)   |
| `PATCH` | `/orders/:id/cancel`   | Cancelar orden en estado PENDING                 |
| `PATCH` | `/orders/:id/pay`      | Marcar orden como pagada                         |
| `PATCH` | `/orders/:id/complete` | Marcar orden como completada (debe estar pagada) |

**Ejemplo Request/Response:**

```json
// POST /orders/from-cart
{}  // Usa el carrito actual del usuario

// Response 201
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "status": "PENDING",
  "totalAmount": 129.99,
  "items": [
    { "productId": 1, "quantity": 2, "price": 49.99, "lineTotal": 99.98 },
    { "productId": 3, "quantity": 1, "price": 30.01, "lineTotal": 30.01 }
  ],
  "createdAt": "2025-12-26T12:00:00Z"
}
```

## Guards/Seguridad

- **JwtAuthGuard**: Todos los endpoints requieren autenticación
- **Ownership validation**: Usuario solo puede ver/modificar sus propias órdenes
- **Sin roles específicos**: Cualquier usuario autenticado gestiona sus órdenes
- **ValidationPipe**: Validación automática de DTOs

## Invariantes/Reglas Críticas

- **Máquina de estados estricta**: Solo transiciones válidas permitidas (ver diagrama)
- **Orden no vacía**: Debe tener al menos un item con cantidad > 0
- **Validación de stock**: Verifica disponibilidad de productos al crear orden
- **Ownership inmutable**: Usuario asignado a orden no puede cambiar

## Estados Relevantes

**Máquina de Estados:**

```
         ┌─────────┐
         │ PENDING │ ◄─── Order created
         └────┬────┘
              │
      ┌───────┼───────┐
      │               │
   [pay]          [cancel]
      │               │
      ▼               ▼
 ┌────────┐    ┌───────────┐
 │  PAID  │    │ CANCELLED │ (final)
 └───┬────┘    └───────────┘
     │
 [complete]
     │
     ▼
┌───────────┐
│ COMPLETED │ (final)
└───────────┘
```

| Estado      | Descripción                     | Transiciones Permitidas |
| ----------- | ------------------------------- | ----------------------- |
| `PENDING`   | Orden creada, pendiente de pago | → PAID, → CANCELLED     |
| `PAID`      | Pago confirmado                 | → COMPLETED             |
| `COMPLETED` | Orden entregada (final)         | —                       |
| `CANCELLED` | Orden cancelada (final)         | —                       |

## Config/Integración

### Dependencias Externas

- **Prisma**: Persistencia en PostgreSQL (tabla `Order`, `OrderItem`)
- **Products Context**: Valida stock y decrementa inventario vía `PRODUCT_WRITE_REPOSITORY`
- **Cart Context**: Lee carrito para crear orden vía `CART_REPOSITORY`

### Tokens DI Expuestos

- `ORDER_REPOSITORY`: Repositorio de órdenes (usado por Payment, Admin contexts)

## Notas Arquitectónicas

- **Agregado Order**: `OrderEntity` contiene colección de `OrderItemEntity` y `CustomerInfo` VO
- **Transiciones de estado**: Validadas en dominio con métodos `markAsPaid()`, `markAsCompleted()`, `cancel()`
- **Decremento de stock**: Ejecutado al crear orden, rollback manual si falla transacción
