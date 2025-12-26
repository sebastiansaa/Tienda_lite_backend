# User Context

## Propósito

Gestionar perfiles de usuario, direcciones de envío y estados de cuenta (ACTIVE, INACTIVE, BANNED).

## Endpoints

| Método   | Ruta                      | Propósito                                    |
| -------- | ------------------------- | -------------------------------------------- |
| `GET`    | `/users/me`               | Obtener perfil del usuario autenticado       |
| `PATCH`  | `/users/me`               | Actualizar perfil (name, phone, preferences) |
| `POST`   | `/users/me/addresses`     | Agregar dirección de envío                   |
| `PATCH`  | `/users/me/addresses/:id` | Actualizar dirección existente               |
| `DELETE` | `/users/me/addresses/:id` | Eliminar dirección                           |
| `GET`    | `/users/:id`              | Obtener perfil de usuario (admin)            |
| `GET`    | `/users`                  | Listar todos los usuarios (admin)            |
| `PATCH`  | `/users/:id/status`       | Cambiar estado de usuario (admin)            |

## Guards/Seguridad

- **JwtAuthGuard + RolesGuard**: Todos los endpoints requieren autenticación
- **Endpoints públicos (autenticados)**: `/users/me`, `/users/me/addresses/*`
- **Endpoints admin**: `/users/:id`, `/users`, `/users/:id/status` (requieren rol `admin`)
- **ValidationPipe**: Validación automática de DTOs con UUID validation para addressId

## Invariantes/Reglas Críticas

- **Email único**: Validado en Auth context, User solo almacena referencia
- **Direcciones con ownership**: Usuario solo puede modificar sus propias direcciones
- **Estados válidos**: ACTIVE (default), INACTIVE (suspendido temporalmente), BANNED (bloqueado permanentemente)
- **Dirección completa**: Requiere street, city, country, zipCode (validado en VO)

## Estados Relevantes

| Estado           | Descripción                       | Impacto Frontend/BC                          |
| ---------------- | --------------------------------- | -------------------------------------------- |
| `ACTIVE`         | Usuario activo                    | Puede realizar operaciones normalmente       |
| `INACTIVE`       | Usuario suspendido                | Login bloqueado, órdenes existentes visibles |
| `BANNED`         | Usuario bloqueado permanentemente | Login bloqueado, acceso denegado             |
| `WITH_ADDRESSES` | Usuario con direcciones guardadas | Checkout pre-llena direcciones               |

## Config/Integración

### Variables de Entorno

- **No requiere variables específicas**: Usa configuración de Prisma del módulo global

### Dependencias Externas

- **Prisma**: Persistencia en PostgreSQL (tabla `User`, `Address`)
- **Auth Context**: Comparte tabla `User` pero no importa entidades (solo IDs)

### Eventos

- **No publica eventos**: Operaciones síncronas
- **No consume eventos**: Autónomo

### Tokens DI Expuestos

- `USER_REPOSITORY`: Repositorio de usuarios (usado por Auth, Admin contexts)

## Notas Arquitectónicas

- **Separación Auth/User**: Auth maneja credenciales y tokens, User maneja perfil y datos de negocio
- **Agregado User**: `UserEntity` contiene colección de `AddressEntity` (VOs)
- **Preferences JSON**: Campo flexible para configuraciones futuras (theme, notifications, etc.)
