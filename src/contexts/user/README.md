User

- Proposito: gestionar perfil de usuario y direcciones; exponer lectura basica para otros contextos.
- Responsabilidades: CRUD de perfil, manejo de direcciones, cambio de estado y listado administrativo.

Capas
- Domain: `UserEntity`, `AddressEntity`; VOs `Email`, `Name`, `Phone`, `UserStatus`, `AddressId`, `City`, `Country`, `Street`, `ZipCode`, timestamps; errores de validacion.
- Application: casos de uso GetUserProfile, UpdateUserProfile, AddAddress, UpdateAddress, DeleteAddress, ChangeUserStatus, ListUsers; puertos `UserRepositoryPort`, `UserReadOnlyPort`.
- Infrastructure: `UserPrismaRepository` (repo completo), `UserReadOnlyAdapter` (consulta ligera), mappers en infra.
- API: `UserController`, DTOs y `UserApiMapper`; protegido con JwtAuthGuard y RolesGuard para rutas admin.

Invariantes
- Email valido y unico (validacion en VO y BD).
- UserStatus restringido a valores permitidos; direcciones requieren campos obligatorios.

Puertos expuestos
- `USER_REPOSITORY` (lectura/escritura), `USER_READONLY` (read-model cross-context).

Adaptadores implementados
- Prisma: repo principal y readonly adapter (consulta directa a tabla user/address).

Endpoints
- GET/PATCH /users/me; POST/PATCH/DELETE /users/me/addresses/:id; admin: GET /users, GET /users/:id, PATCH /users/:id/status.

Integraciones
- Consumido por Order/Payment/Admin via `USER_READONLY`; depende de Auth para identidad/roles.

Diagrama textual
- HTTP -> UserController -> DTO -> Mapper -> UseCase -> UserRepositoryPort -> PrismaAdapter -> DB -> Mapper -> DTO.

Notas de diseño
- DTOs y mappers encapsulan Address -> command; domain agrega/reemplaza direcciones con invariantes.

Razon de aislamiento
- No expone entidades a otros contextos; solo ofrece proyecciones via puerto readonly, manteniendo reglas de estado dentro del dominio User.
