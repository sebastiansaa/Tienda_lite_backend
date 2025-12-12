Auth

- Proposito: autenticacion y emision/rotacion de tokens JWT; manejo de refresh tokens.
- Responsabilidades: registrar, autenticar, refrescar, revocar tokens y exponer identidad (sub, roles) para otros contextos.

Capas
- Domain: entidades `User` (credenciales basicas) y `RefreshToken`; VOs `Email`, `PasswordHash`, `Role`; errores auth.*.
- Application: casos de uso RegisterUser, LoginUser, RefreshToken, RevokeRefreshToken, GetAuthenticatedUser; puertos `UserRepositoryPort`, `RefreshTokenRepositoryPort`, `TokenServicePort`, `PasswordHasherPort`.
- Infrastructure: repos Prisma para user/refresh, servicios JWT y bcrypt, estrategias/guards (JwtStrategy, RefreshJwtStrategy, JwtAuthGuard, RolesGuard).
- API: AuthController, DTOs login/register/refresh, mapper AuthApiMapper.

Puertos expuestos
- `AUTH_USER_REPOSITORY`, `AUTH_REFRESH_TOKEN_REPOSITORY`, `AUTH_TOKEN_SERVICE`, `AUTH_PASSWORD_HASHER`.

Adaptadores implementados
- Prisma: AuthUserPrismaRepository, RefreshTokenPrismaRepository.
- Servicios: JwtTokenService (JWT), BcryptPasswordService (hash).
- Guards: JwtAuthGuard, RolesGuard exportados.

Endpoints
- POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout, GET /auth/me.

Integraciones
- Ninguna dependencia de dominio externo; otros contextos consumen identidad via guards y decoradores.

Diagrama textual
- HTTP -> AuthController -> DTO -> Mapper -> UseCase -> (Repo|Token|Hasher ports) -> Adaptadores (Prisma/JWT/Bcrypt) -> respuesta -> Mapper -> DTO.

Notas de diseño
- Contexto tecnico sin reglas de negocio ajenas; roles se leen del payload.

Razon de aislamiento
- Evita acoplarse al dominio User; solo expone identidad y tokens, permitiendo evolucionar credenciales sin tocar otros contextos.
