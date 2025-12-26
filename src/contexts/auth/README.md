# Auth Context

## Propósito

Autenticación JWT con refresh tokens y exposición de identidad (sub, roles) para otros bounded contexts.

## Endpoints

| Método | Ruta             | Propósito                                        |
| ------ | ---------------- | ------------------------------------------------ |
| `POST` | `/auth/register` | Registrar usuario con email/password             |
| `POST` | `/auth/login`    | Autenticar y emitir tokens JWT                   |
| `POST` | `/auth/refresh`  | Rotar refresh token y emitir nuevo par de tokens |
| `POST` | `/auth/logout`   | Revocar refresh tokens del usuario autenticado   |
| `GET`  | `/auth/me`       | Obtener perfil del usuario autenticado           |

**Ejemplo Request/Response:**

```json
// POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "roles": ["user"]
  }
}
```

## Guards/Seguridad

- **JwtAuthGuard**: Valida access token JWT en endpoints protegidos (`/auth/logout`, `/auth/me`)
- **RolesGuard**: Valida roles del usuario (usado por otros contextos, no en Auth)
- **Estrategias Passport**: `JwtStrategy` (access token), `RefreshJwtStrategy` (refresh token)

## Invariantes/Reglas Críticas

- **Email único**: No se permiten registros duplicados (validado en dominio + DB constraint)
- **Refresh token de un solo uso**: Cada refresh invalida el token anterior (rotación automática)
- **Logout revoca todos los refresh tokens**: No solo el actual, sino todos los del usuario
- **Password hasheado con bcrypt**: Nunca se almacena en texto plano (rounds: 10)

## Estados Relevantes

**Flujo de Autenticación:**

```
[Register] → UNAUTHENTICATED
    ↓
[Login] → AUTHENTICATED (access + refresh tokens)
    ↓
[Access Expired] → UNAUTHENTICATED
    ↓
[Refresh] → AUTHENTICATED (nuevos tokens)
    ↓
[Logout] → UNAUTHENTICATED (tokens revocados)
```

| Estado            | Descripción                     | Impacto Frontend/BC                       |
| ----------------- | ------------------------------- | ----------------------------------------- |
| `AUTHENTICATED`   | Usuario con access token válido | Puede acceder a endpoints protegidos      |
| `UNAUTHENTICATED` | Sin token o token expirado      | Redirige a `/auth/login`                  |
| `REFRESH_VALID`   | Refresh token vigente           | Permite renovar access token sin re-login |
| `REFRESH_REVOKED` | Refresh token revocado (logout) | Requiere login completo                   |

## Config/Integración

### Variables de Entorno

- `JWT_SECRET`: Clave para firmar access tokens
- `JWT_EXPIRES_IN`: Expiración de access token (recomendado: `15m`)
- `JWT_REFRESH_SECRET`: Clave para firmar refresh tokens
- `JWT_REFRESH_EXPIRES_IN`: Expiración de refresh token (recomendado: `7d`)

### Dependencias Externas

- **Prisma**: Persistencia de `User` y `RefreshToken` en PostgreSQL
- **bcrypt**: Hashing de passwords
- **@nestjs/jwt**: Emisión y validación de tokens JWT
- **@nestjs/passport**: Estrategias de autenticación

### Tokens DI Expuestos

- `AUTH_USER_REPOSITORY`: Repositorio de usuarios (usado por otros BC)
- `AUTH_REFRESH_TOKEN_REPOSITORY`: Repositorio de refresh tokens
- `AUTH_TOKEN_SERVICE`: Servicio de emisión/validación de JWT
- `AUTH_PASSWORD_HASHER`: Servicio de hashing de passwords

## Notas Arquitectónicas

- **Contexto técnico**: No modela reglas de negocio, solo seguridad
- **Aislamiento**: No depende de otros bounded contexts
- **Guards reutilizables**: `JwtAuthGuard` y `RolesGuard` exportados para uso global
