# Cart Context

Gestión del carrito de compras persistente para usuarios autenticados, integrando validación de stock en tiempo real y cálculo automático de totales.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y mappers para la gestión del carrito por el usuario.
- `app/`: Casos de uso de mutación (agregar, actualizar, eliminar) y consulta.
- `domain/`: Entidades Cart/CartItem ricas, validaciones de cantidad y errores.
- `infra/`: Persistencia Prisma y adaptadores para consultar stock de productos.

## Casos de Uso y Endpoints

- `GET /cart`: Recupera el carrito actual del usuario (lo crea si no existe).
- `POST /cart/items`: Agrega un producto al carrito previa validación de stock.
- `PUT /cart/items/:productId`: Actualiza la cantidad de un ítem existente.
- `DELETE /cart/items/:productId`: Remueve un producto específico del carrito.
- `DELETE /cart`: Vacía completamente el contenido del carrito.

## Ejemplo de Uso

```typescript
// Agregar ítem al carrito
const cart = await addItemUseCase.execute({
  userId: 'user-123',
  productId: 501,
  quantity: 2,
});
console.log(`Total carrito: ${cart.totalPrice}`);
```

## Notas de Integración

- **Seguridad**: Requiere `JwtAuthGuard`.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Relaciones**: Consulta `ProductsContext` para validar stock.
