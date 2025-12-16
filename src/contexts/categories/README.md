Categories

- Proposito: administrar categorías del catálogo.
- Responsabilidades: alta/edición/baja/listado y exponer lectura ligera para otros contextos.

Capas

- Domain: `CategoryEntity` con VOs (`TitleVO`, `Slug`, `ImageUrlVO`, `SoftDeleteVO`), invariantes de título/slug, soft delete.
- app: casos CreateCategory, UpdateCategory, GetCategory, ListCategories, DeleteCategory; puertos `ICategoryWriteRepository` y `ICategoryReadRepository`.
- infra: `PrismaCategoryWriteRepository` (write) y `PrismaCategoryReadRepository` (read); `CategorySharedAdapter` expone `CategoryReadOnlyPort` usando el repo de lectura; mapper `CategoryMapper`.
- API: `CategoriesController` con `ValidationPipe` (whitelist/forbid/transform), DTOs request/response, `CategoryApiMapper`; escritura protegida con `JwtAuthGuard` + `RolesGuard`.

CQRS

- Separación lectura/escritura por tokens: `CATEGORY_WRITE_REPOSITORY` (write) y `CATEGORY_READ_REPOSITORY` (read).
- Write: CreateCategory, UpdateCategory, DeleteCategory.
- Read: GetCategory, ListCategories.
- Adapter readonly (`CategoryReadOnlyPort`) reusa el repo de lectura y se exporta para otros contextos.
- Providers exportados: `CATEGORY_WRITE_REPOSITORY`, `CATEGORY_READ_REPOSITORY`, `CategoryReadOnlyPort` (se mantiene `CATEGORY_REPOSITORY` como alias legada).

Invariantes

- Título y slug no vacíos; slug único (validado en repositorio/BD).
- sortOrder >= 0; soft delete marca `deletedAt` y `active=false`.

Puertos expuestos

- `CATEGORY_WRITE_REPOSITORY`, `CATEGORY_READ_REPOSITORY` para casos internos.
- `CategoryReadOnlyPort` para lectura ligera desde otros contextos (Products, etc.).

Adaptadores implementados

- Prisma (read/write) y adapter readonly hacia `CategoryReadOnlyPort`.

Endpoints

- POST /categories
- GET /categories
- GET /categories/:id
- PATCH /categories/:id
- DELETE /categories/:id

Integraciones

- Products consume `CategoryReadOnlyPort` para validar categorías.
- Depende de Auth para operaciones admin.

Diagrama textual

- HTTP → CategoriesController → ValidationPipe → DTO → Mapper → UseCase → (Write/Read Repo + ReadOnlyPort) → Prisma → DB → Mapper → DTO.

Notas de diseño

- Puerto readonly evita exponer entidades del dominio y desacopla Products.
- Validación en DTO + VOs del dominio mantienen integridad antes de persistir.

Razón de aislamiento

- Otros contextos solo conocen IDs y puerto readonly; no acceden a entidades ni reglas internas de Category.
