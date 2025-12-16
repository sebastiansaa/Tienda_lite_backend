# Auth Context

- **Proposito**: autenticacion y emision/rotacion de tokens JWT; manejo de refresh tokens.
- **Responsabilidades**: registrar, autenticar, refrescar, revocar tokens y exponer identidad (sub, roles) para otros contextos.

## Capas

### Domain

- Entidades: `User` (credenciales basicas) y `RefreshToken`.
- VOs: `Email`, `PasswordHash`, `Role`.
- Errores: `auth.*`.
- **Nota**: Este dominio es técnico, no de negocio. Modela invariantes de seguridad (email válido, hash válido, roles permitidos, expiración de tokens), no al “usuario del negocio”.

### App

- UseCases: `RegisterUser`, `LoginUser`, `RefreshToken`, `RevokeRefreshToken`, `GetAuthenticatedUser`.
- Puertos: `UserRepositoryPort`, `RefreshTokenRepositoryPort`, `TokenServicePort`, `PasswordHasherPort`.
- Inputs: Objetos de entrada ubicados en `application/inputs/` (NO se usa CQRS/Commands/Queries).

### Infra

- Repositorios: Prisma para `User` y `RefreshToken`.
- Servicios: `JwtTokenService` (JWT), `BcryptPasswordService` (hash).
- Guards/Strategies: `JwtStrategy`, `RefreshJwtStrategy`, `JwtAuthGuard`, `RolesGuard`.

### API

- `AuthController`, DTOs (`LoginDto`, `RegisterDto`, `RefreshDto`), `AuthApiMapper`.

## Puertos expuestos (Tokens DI)

- `AUTH_USER_REPOSITORY`
- `AUTH_REFRESH_TOKEN_REPOSITORY`
- `AUTH_TOKEN_SERVICE`
- `AUTH_PASSWORD_HASHER`

## Adaptadores implementados

- **Prisma**: `AuthUserPrismaAdapter`, `RefreshTokenPrismaAdapter`.
- **Servicios**: `JwtTokenService` (JWT), `BcryptPasswordService` (hash).
- **Guards**: `JwtAuthGuard`, `RolesGuard`.

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Integraciones

- Ninguna dependencia de dominio externo.
- Otros contextos consumen identidad via Guards y Decoradores proporcionados por este módulo.

## Diseño

- **Contexto tecnico**: Sin reglas de negocio ajenas.
- **Aislamiento**: Evita acoplarse al dominio User. Solo expone identidad y tokens.
