# Inventory Context

## Propósito

Gestionar movimientos de inventario (entradas, salidas, reservas) con trazabilidad de operaciones.

## Endpoints

| Método | Ruta                              | Propósito                             |
| ------ | --------------------------------- | ------------------------------------- |
| `GET`  | `/inventory/:productId`           | Obtener inventario actual de producto |
| `GET`  | `/inventory/:productId/movements` | Historial de movimientos de producto  |
| `POST` | `/inventory/:productId/increase`  | Aumentar stock (entrada de mercancía) |
| `POST` | `/inventory/:productId/decrease`  | Disminuir stock (salida manual)       |
| `POST` | `/inventory/:productId/reserve`   | Reservar stock para orden             |
| `POST` | `/inventory/:productId/release`   | Liberar reserva cancelada             |

## Guards/Seguridad

- **Endpoints públicos**: `GET /inventory/:productId`, `GET /inventory/:productId/movements`
- **Endpoints admin**: `POST /inventory/*` (requieren rol `admin`)
- **ValidationPipe**: Validación de cantidades y razones de movimiento

## Invariantes/Reglas Críticas

- **Stock no negativo**: Decrementos y reservas validan disponibilidad antes de aplicar
- **Reservas limitadas**: Stock reservado no puede exceder stock disponible (onHand - reserved ≥ 0)
- **Trazabilidad obligatoria**: Todo movimiento requiere `reason` (auditoría)
- **Sincronización con Products**: Actualiza stock en Products context tras cada movimiento

## Estados Relevantes

| Estado         | Descripción                             | Cálculo                                |
| -------------- | --------------------------------------- | -------------------------------------- |
| `AVAILABLE`    | Stock disponible para compra            | `onHand - reserved > 0`                |
| `RESERVED`     | Stock reservado para órdenes pendientes | `reserved > 0`                         |
| `OUT_OF_STOCK` | Sin stock disponible                    | `onHand - reserved = 0`                |
| `LOW_STOCK`    | Stock bajo umbral                       | `onHand < 10` (hardcoded en Dashboard) |

**Diagrama de flujo típico:**

```
Entrada → increase() → onHand += cantidad
Venta → reserve() → reserved += cantidad → order confirmed → decrease() → onHand -= cantidad, reserved -= cantidad
Cancelación → release() → reserved -= cantidad
```

## Config/Integración

### Variables de Entorno

- **No requiere variables específicas**: Usa configuración de Prisma del módulo global

### Dependencias Externas

- **Prisma**: Persistencia en PostgreSQL (tabla `Inventory`, `InventoryMovement`)
- **Products Context**: Sincroniza stock vía puerto (no directamente implementado actualmente)

### Tokens DI Expuestos

- `INVENTORY_REPOSITORY`: Repositorio de inventario (usado por Orders, Admin contexts)

## Notas Arquitectónicas

- **Historial de movimientos**: Tabla `InventoryMovement` registra cada ajuste (increase, decrease, reserve, release) con `reason` y timestamp
- **Stock calculado**: `Inventory` almacena `onHand` y `reserved`, disponible se calcula como `onHand - reserved`
- **Validaciones en dominio**: Entidad valida que decrease/reserve no causen stock negativo
