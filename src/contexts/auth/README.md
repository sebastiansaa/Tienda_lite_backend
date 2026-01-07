# Auth Context

Gestión de autenticación basada en JWT, proporcionando registro, login, rotación de tokens (refresh tokens) y revocación de acceso.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y decoradores para exponer autenticación.
- `app/`: Casos de uso de autenticación, lógica de tokens y validaciones.
- `domain/`: Entidades de usuario base, tokens y lógica de hashing.
- `infra/`: Estrategias de Passport (JWT), guards y repositorios Prisma.

## Casos de Uso y Endpoints

- `POST /auth/register`: Registro de nuevos usuarios con email único.
- `POST /auth/login`: Autenticación y emisión de par de tokens (Access/Refresh).
- `POST /auth/refresh`: Renovación de Access Token usando Refresh Token.
- `POST /auth/logout`: Revocación total de tokens del usuario.
- `GET /auth/me`: Verificación de identidad y obtención de perfil básico.

## Ejemplo de Uso

```typescript
// Login de usuario
const { accessToken, user } = await loginUseCase.execute({
  email: 'user@example.com',
  password: 'securePassword123',
});
console.log(`Bienvenido ${user.name}`);
```

## Notas de Integración

- **Seguridad**: Implementa `JwtAuthGuard` y `RolesGuard` para uso global.
- **Validación**: Passwords hasheados con bcrypt.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
