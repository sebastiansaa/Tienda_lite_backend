Categories

- Proposito: administrar categorias del catalogo.
- Responsabilidades: crear, actualizar, listar y eliminar categorias; ofrecer puerto compartido para otros contextos.

Capas
- Domain: `CategoryEntity` con validaciones basicas (nombre, slug), interfaces y errores.
- Application: casos CreateCategory, UpdateCategory, GetCategory, ListCategories, DeleteCategory; puerto `ICategoryRepository`.
- Infrastructure: `PrismaCategoryRepository` y `CategorySharedAdapter` (implementa `CategoryRepositoryPort` para productos sin acoplar dominios).
- API: `CategoriesController`, DTOs, `CategoryApiMapper`; rutas de escritura protegidas por JwtAuthGuard + RolesGuard.
- Domain solo aplica a este contexto de negocio.

Invariantes
- Nombre y slug no vacios; unicidad gestionada en BD.

Puertos expuestos
- `CATEGORY_REPOSITORY`; exporta token `CategoryRepositoryPort` para consumo externo.

Adaptadores implementados
- Prisma para repo; shared adapter para exponer lectura ligera a productos.

Endpoints
- POST /categories, GET /categories, GET /categories/:id, PATCH /categories/:id, DELETE /categories/:id.

Integraciones
- Consumido por Products via `CategoryRepositoryPort`; depende de Auth para operaciones admin.

Diagrama textual
- HTTP -> CategoriesController -> DTO -> Mapper -> UseCase -> CategoryRepositoryPort -> Prisma adapter -> DB -> Mapper -> DTO.

Notas de diseño
- Mantiene puerto ligero para compartir sin filtrar entidades del dominio.

Razon de aislamiento
- Productos solo conocen IDs y puerto de lectura; evita compartir entidades o reglas internas de categoria.
