# Products Context

## Propósito

Gestionar catálogo de productos con búsqueda, categorías y control de stock.

## Endpoints

| Método   | Ruta                              | Propósito                                          |
| -------- | --------------------------------- | -------------------------------------------------- |
| `GET`    | `/products`                       | Listar productos con paginación                    |
| `GET`    | `/products/search?q=`             | Buscar productos por nombre/descripción            |
| `GET`    | `/products/low-stock?threshold=5` | Productos con stock bajo (admin)                   |
| `GET`    | `/products/:id`                   | Obtener producto por ID                            |
| `POST`   | `/products`                       | Crear/actualizar producto (admin)                  |
| `PUT`    | `/products/:id/stock`             | Actualizar stock (admin)                           |
| `DELETE` | `/products/:id`                   | Eliminar producto (soft delete por defecto, admin) |
| `DELETE` | `/products/:id?hard=true`         | Eliminar producto permanentemente (admin)          |
| `POST`   | `/products/:id/restore`           | Restaurar producto eliminado (admin)               |
| `POST`   | `/products/:id/upload-image`      | Subir imagen de producto (admin)                   |

**Ejemplo Request/Response:**

```json
// GET /products/search?q=laptop
{
  "products": [
    {
      "id": 1,
      "title": "Laptop Pro 15",
      "slug": "laptop-pro-15",
      "description": "High-performance laptop",
      "price": 1299.99,
      "stock": 15,
      "category": { "id": 2, "name": "Electronics" },
      "images": ["/uploads/laptop-pro.jpg"]
    }
  ],
  "total": 1
}
```

## Guards/Seguridad

- **Endpoints públicos**: `GET /products`, `GET /products/search`, `GET /products/:id`
- **Endpoints admin**: `POST /products`, `PUT /products/:id/stock`, `DELETE /products/:id`, `POST /products/:id/restore`, `GET /products/low-stock`, `POST /products/:id/upload-image`
- **ValidationPipe**: Validación automática de DTOs con whitelist

## Invariantes/Reglas Críticas

- **Stock no negativo**: Decrementos de stock validan disponibilidad antes de aplicar
- **Slug único**: Generado automáticamente desde título, debe ser único en DB
- **Categoría válida**: Valida existencia de categoría vía `ProductCategoryPolicy` (puerto a Categories context)
- **Precio positivo**: Price VO valida que precio > 0

## Estados Relevantes

| Estado      | Descripción                    | Impacto Frontend/BC    |
| ----------- | ------------------------------ | ---------------------- |
| `ACTIVE`    | Producto visible y disponible  | Aparece en catálogo    |
| `DELETED`   | Soft delete (no visible)       | No aparece en catálogo |
| `LOW_STOCK` | Stock < threshold (default: 5) | Alerta en panel admin  |

## Config/Integración

### Dependencias Externas

- **Prisma**: Persistencia en PostgreSQL (tablas `Product`, `Category`)
- **Categories Context**: Valida existencia de categoría vía `CategoryRepositoryPort`
- **Multer**: Upload de imágenes (storage: `./public/uploads`)

### Tokens DI Expuestos

- `PRODUCT_READ_REPOSITORY`: Puerto de lectura (usado por Cart, Orders, Inventory)
- `PRODUCT_WRITE_REPOSITORY`: Puerto de escritura (usado por Admin, Inventory)

## Notas Arquitectónicas

- **CQRS**: Repositorios separados para lectura y escritura
- **Value Objects**: `Price` (validación > 0), `Slug` (generación y unicidad)
- **Soft Delete**: Productos eliminados se marcan con `deletedAt`, recuperables con `/restore`
- **Upload de imágenes**: Genera nombre único con timestamp + random, guarda path en array `images`
