# Admin Context (Centralized Administration Orchestrator)

## Propósito

El contexto `Admin` actúa como el **Orquestador Central** de todas las operaciones administrativas de la plataforma. Su responsabilidad es centralizar los puntos de entrada para la gestión de usuarios, productos, categorías e inventario, delegando la ejecución real a los dominios correspondientes mediante un patrón de **Ports and Adapters** (Hexagonal Architecture).

### Objetivos Clave:

- **Centralización**: Todos los endpoints `/admin/*` residen aquí.
- **Desacoplamiento**: El orquestador no conoce detalles de implementación de otros dominios; se comunica mediante interfaces (Ports).
- **Consolidación de Métricas**: Proporciona un dashboard unificado con datos agregados de múltiples contextos.

## Arquitectura (Hexagonal)

El contexto Admin define **Ports** (interfaces) que representan las necesidades administrativas. Cada dominio interesado implementa un **Adapter** para satisfacer ese Port.

### Flujo de Comunicación:

1. `AdminController` recibe el request.
2. `AdminController` llama a un `Port` (ej: `ProductAdminPort`).
3. El `Adapter` del dominio (ej: `ProductAdminAdapter` en el contexto `Products`) recibe la llamada.
4. El `Adapter` ejecuta los Casos de Uso internos de su propio dominio.

## Endpoints

### Dashboard (Métricas)

- `GET /admin/dashboard`: Estadísticas globales (ventas, usuarios, stock bajo).

### Usuarios

- `GET /admin/users`: Listado completo de usuarios.
- `GET /admin/users/:id`: Perfil detallado de usuario.
- `PATCH /admin/users/:id/status`: Activar/Inactivar usuarios.

### Productos

- `POST /admin/products`: Crear o actualizar productos.
- `GET /admin/products/low-stock`: Consultar productos con bajo inventario.
- `PUT /admin/products/:id/stock`: Ajustar stock base.
- `DELETE /admin/products/:id`: Eliminación física o lógica.
- `POST /admin/products/:id/restore`: Restaurar productos eliminados lógicamente.
- `POST /admin/products/:id/upload-image`: Gestión de assets de productos.

### Categorías

- `POST /admin/categories`: Crear nuevas categorías.
- `PATCH /admin/categories/:id`: Editar metadatos de categoría.
- `DELETE /admin/categories/:id`: Eliminar categorías.

### Inventario (Ajustes Granulares)

- `POST /admin/inventory/:productId/increase`: Incrementar stock con motivo.
- `POST /admin/inventory/:productId/decrease`: Disminuir stock con motivo.

## Seguridad

- **Autenticación**: Todos los endpoints requieren un JWT válido (`JwtAuthGuard`).
- **Autorización**: Acceso restringido exclusivamente a usuarios con rol `admin` (`RolesGuard` + `@Roles('admin')`).

## Formato de Respuesta Uniforme

Todas las respuestas siguen la estructura: `{ "statusCode": number, "message": string, "data": any | null }`. Incluso las operaciones `void` devuelven `data: null`.

## Estándar de Tipado (Gold Standard)

- **DTOs de Dominio**: Se utilizan los DTOs originales de cada contexto para garantizar la consistencia en la validación y documentación de Swagger.
- **Strict Typing**: Uso de interfaces explícitas para todos los Ports y tipos de retorno definidos en lugar de `any`.
