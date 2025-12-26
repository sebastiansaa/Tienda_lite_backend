# Categories Context

## Propósito

Gestionar categorías de productos con jerarquía simple (sin subcategorías) y validación de unicidad.

## Endpoints

| Método   | Ruta              | Propósito                                         |
| -------- | ----------------- | ------------------------------------------------- |
| `GET`    | `/categories`     | Listar todas las categorías                       |
| `GET`    | `/categories/:id` | Obtener categoría por ID                          |
| `POST`   | `/categories`     | Crear nueva categoría (admin)                     |
| `PATCH`  | `/categories/:id` | Actualizar categoría (admin)                      |
| `DELETE` | `/categories/:id` | Eliminar categoría (admin, solo si sin productos) |

## Guards/Seguridad

- **Endpoints públicos**: `GET /categories`, `GET /categories/:id`
- **Endpoints admin**: `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id` (requieren rol `admin`)
- **ValidationPipe**: Validación de nombres y slugs

## Invariantes/Reglas Críticas

- **Nombre único**: No se permiten categorías con nombres duplicados
- **Slug único**: Generado automáticamente desde nombre, debe ser único
- **No eliminar con productos**: Categoría con productos asociados no puede eliminarse
- **Nombre no vacío**: Requiere al menos 2 caracteres

## Estados Relevantes

| Estado          | Descripción                       | Impacto Frontend/BC              |
| --------------- | --------------------------------- | -------------------------------- |
| `ACTIVE`        | Categoría visible y usable        | Aparece en filtros y formularios |
| `WITH_PRODUCTS` | Categoría con productos asociados | No eliminable                    |
| `EMPTY`         | Categoría sin productos           | Eliminable por admin             |

## Config/Integración

### Variables de Entorno

- **No requiere variables específicas**: Usa configuración de Prisma del módulo global

### Dependencias Externas

- **Prisma**: Persistencia en PostgreSQL (tabla `Category`)

### Eventos

- **No publica eventos**: Operaciones síncronas
- **No consume eventos**: Autónomo

### Tokens DI Expuestos

- `CATEGORY_REPOSITORY_PORT`: Puerto de lectura para Products context (validación de categoría)

## Notas Arquitectónicas

- **Contexto simple**: Sin jerarquías ni subcategorías (flat structure)
- **Usado por Products**: Products valida existencia de categoría vía puerto, sin acoplar entidades
- **Caché recomendado**: Categorías cambian poco, candidato para caché en memoria
