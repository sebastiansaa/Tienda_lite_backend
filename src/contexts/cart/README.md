# Cart Context

## Propósito

Gestionar carrito de compras del usuario autenticado con validación de stock y cálculo de totales.

## Endpoints

| Método   | Ruta                     | Propósito                                  |
| -------- | ------------------------ | ------------------------------------------ |
| `GET`    | `/cart`                  | Obtener carrito del usuario autenticado    |
| `POST`   | `/cart/items`            | Agregar producto al carrito                |
| `PUT`    | `/cart/items/:productId` | Actualizar cantidad de producto en carrito |
| `DELETE` | `/cart/items/:productId` | Eliminar producto del carrito              |
| `DELETE` | `/cart`                  | Vaciar carrito completo                    |

## Guards/Seguridad

- **JwtAuthGuard**: Todos los endpoints requieren autenticación
- **Sin roles específicos**: Cualquier usuario autenticado puede gestionar su carrito
- **ValidationPipe**: Validación automática de DTOs con whitelist

## Invariantes/Reglas Críticas

- **Un carrito por usuario**: Cada usuario tiene un único carrito activo
- **Cantidad > 0**: No se permiten cantidades negativas o cero (eliminar item en su lugar)
- **Validación de stock**: Verifica disponibilidad del producto antes de agregar/actualizar
- **Cálculo automático de totales**: Total del carrito se recalcula en cada operación

## Estados Relevantes

| Estado         | Descripción                    | Impacto Frontend/BC                |
| -------------- | ------------------------------ | ---------------------------------- |
| `EMPTY`        | Carrito sin items              | Frontend muestra "carrito vacío"   |
| `WITH_ITEMS`   | Carrito con productos          | Muestra resumen y permite checkout |
| `ITEM_ADDED`   | Producto agregado exitosamente | Actualiza contador de items        |
| `ITEM_REMOVED` | Producto eliminado             | Recalcula total                    |

## Config/Integración

### Variables de Entorno

- **No requiere variables específicas**: Usa configuración de Prisma del módulo global

### Dependencias Externas

- **Prisma**: Persistencia en PostgreSQL (tabla `Cart`, `CartItem`)
- **Products Context**: Valida existencia y stock de productos vía `PRODUCT_READONLY_PORT`

### Eventos

- **No publica eventos**: Operaciones síncronas
- **No consume eventos**: Autónomo

### Tokens DI Expuestos

- `CART_REPOSITORY`: Repositorio de carritos (usado por Orders context)

## Notas Arquitectónicas

- **Agregado Cart**: `CartEntity` contiene colección de `CartItemEntity`
- **Validación de productos**: Usa puerto readonly de Products para verificar stock sin acoplar entidades
- **Auto-creación**: Si usuario no tiene carrito, se crea automáticamente en primer `GET`
