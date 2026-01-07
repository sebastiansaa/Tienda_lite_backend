# Products Context

Catálogo central de productos, integrando búsqueda avanzada, gestión de metadatos, categorías y sincronización de disponibilidad de stock.

## Estructura de Carpetas

- `api/`: Controladores públicos para búsqueda y visualización de productos.
- `app/`: Casos de uso (obtener por ID, listar con filtros, búsqueda global).
- `domain/`: Entidades ricas, Value Objects (Slug, Price, Stock) y reglas de negocio.
- `infra/`: Persistencia Prisma, mappers de datos y repositorios optimizados.

## Casos de Uso y Endpoints

- `GET /products`: Listado paginado de productos activos en el catálogo.
- `GET /products/search`: Búsqueda por similitud de texto en título/descripción.
- `GET /products/:id`: Detalle extendido de un producto por su identificador.
- `Filtrado`: Soporte de filtros por categoría y parámetros de ordenamiento.

## Ejemplo de Uso

```typescript
// Buscar productos
const { products, total } = await searchUseCase.execute({
  q: 'smartphone',
  limit: 10,
});
console.log(`Encontrados ${total} resultados`);
```

## Notas de Integración

- **Seguridad**: Endpoints públicos. Mutaciones restringidas a `AdminContext`.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Optimización**: VOs garantizan Slugs únicos y precios válidos.
