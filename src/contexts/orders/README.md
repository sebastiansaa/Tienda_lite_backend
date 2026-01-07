# Orders Context

Gestiona el ciclo de vida de los pedidos, desde la creación a partir del carrito hasta la gestión de estados (PENDING, PAID, COMPLETED, CANCELLED).

## Estructura de Carpetas

- `api/`: Controladores para que el usuario gestione sus propios pedidos.
- `app/`: Casos de uso (crear desde carrito, cancelar, marcar pago).
- `domain/`: Entidad Order, lógica de máquina de estados y errores de propiedad.
- `infra/`: Adaptadores de persistencia y puertos para el panel administrativo.

## Casos de Uso y Endpoints

- `POST /orders/from-cart`: Crea un pedido usando los productos del carrito actual.
- `GET /orders`: Listado de pedidos del usuario autenticado.
- `GET /orders/:id`: Detalle de un pedido (requiere validación de dueño).
- `PATCH /orders/:id/cancel`: Cancela pedidos pendientes.
- `Admin Management`: Listado global y cierre de órdenes (vía AdminContext).

## Ejemplo de Uso

```typescript
// Crear orden desde carrito
const order = await createOrderUseCase.execute({ userId: 'user-123' });
console.log(`Orden creada: ${order.id}`);
```

## Notas de Integración

- **Seguridad**: Requiere `JwtAuthGuard`.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Roles**: Solo Admin puede marcar órdenes como COMPLETED.
