# Categories Context

Clasificación y agrupación lógica de productos en el catálogo para facilitar la navegación y el filtrado por el cliente.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y mappers para la consulta de categorías.
- `app/`: Casos de uso para listar y obtener detalles de categorías.
- `domain/`: Entidad Category, Value Objects y errores de unicidad/formato.
- `infra/`: Adaptadores Prisma para la persistencia y lectura de categorías.

## Casos de Uso y Endpoints

- `GET /categories`: Recupera el listado completo de categorías activas.
- `GET /categories/:id`: Obtiene el detalle de una categoría específica.
- `Filtros`: Permite la clasificación de productos en otros contextos.

## Ejemplo de Uso

```typescript
// Listar todas las categorías
const categories = await listUseCase.execute();
console.log(`Disponibles: ${categories.length} categorías`);
```

## Notas de Integración

- **Seguridad**: Endpoints de consulta son públicos.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Admin**: La gestión administrativa se centraliza en `AdminContext`.
