User

- Proposito: gestionar perfil de usuario y direcciones; exponer lectura basica para otros contextos.
- Responsabilidades: CRUD de perfil, manejo de direcciones, cambio de estado y listado administrativo.

  Capas

- Domain: UserEntity, AddressEntity; VOs Email, Name, Phone, UserStatus, AddressId, City, Country, Street, ZipCode, timestamps; errores de validacion.

- app: casos GetUserProfile, UpdateUserProfile, AddAddress, UpdateAddress, DeleteAddress, ChangeUserStatus, ListUsers; puertos `IUserReadRepository`, `IUserWriteRepository`, `UserReadOnlyPort`.

- infra: repos separados `UserPrismaReadRepository` y `UserPrismaWriteRepository`; `UserReadOnlyAdapter` (consulta ligera), mappers infra.

- API: UserController, DTOs y UserApiMapper; protegido con JwtAuthGuard y RolesGuard para rutas admin; `ValidationPipe` con whitelist/transform.

  CQRS

- Separación lectura/escritura cuando aplica.
- Write: UpdateUserProfile, AddAddress, UpdateAddress, DeleteAddress, ChangeUserStatus usando `IUserWriteRepository`.
- Read: GetUserProfile, ListUsers usando `IUserReadRepository` y `UserReadOnlyPort`.
- Repos Prisma divididos en write/read + adapter readonly cross-context.
- Providers expuestos: `USER_READ_REPOSITORY`, `USER_WRITE_REPOSITORY`, `USER_READONLY`.

  Invariantes

- Email valido y unico.
- UserStatus restringido a valores permitidos.
- Direcciones requieren campos obligatorios.

  Puertos expuestos

- USER_READ_REPOSITORY y USER_WRITE_REPOSITORY (lectura/escritura separadas).
- USER_READONLY (read-model cross-context).

  Adaptadores implementados

- Prisma: repositorio principal (write/read) y adaptador readonly para consultas directas.

  Endpoints

- GET/PATCH /users/me
- POST/PATCH/DELETE /users/me/addresses/:id
- Admin: GET /users, GET /users/:id, PATCH /users/:id/status

  Integraciones

- Consumido por Order/Payment/Admin via USER_READONLY.
- Depende de Auth para identidad/roles.

  Diagrama textual

- HTTP → UserController → DTO → Mapper → UseCase → (UserRepositoryPort UserReadOnlyPort) → PrismaAdapter → DB → Mapper → DTO.

  Notas de diseño

- DTOs y mappers encapsulan Address → command.
- El dominio agrega/reemplaza direcciones aplicando invariantes.

  Razon de aislamiento

- No expone entidades a otros contextos; solo proyecciones via puerto readonly.
- Mantiene reglas de estado dentro del dominio User.

Resumen operativo
- Propósito: gestionar perfil y direcciones de usuario; exponer lectura básica.
- Endpoints: `GET/PATCH /users/me`, `POST/PATCH/DELETE /users/me/addresses/:id`, admin `GET /admin/users`, `GET /admin/users/:id`, `PATCH /admin/users/:id/status`.
- Roles requeridos: JWT; admin para endpoints `/admin/users*`.
- Estados: usuario `ACTIVE|SUSPENDED|DELETED`; direcciones activas/eliminadas.
