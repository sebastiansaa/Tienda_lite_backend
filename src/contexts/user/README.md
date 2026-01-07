# User Context

Gestión de perfiles de usuario y direcciones de envío, permitiendo a los clientes mantener su información personal y preferencias actualizada.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y mappers para la exposición de perfiles.
- `app/`: Casos de uso (perfil, direcciones) y orquestación de servicios.
- `domain/`: Entidades User/Address, Value Objects y errores específicos.
- `infra/`: Adaptadores de persistencia Prisma y repositorios de datos.

## Casos de Uso y Endpoints

- `GET /users/me`: Recupera el perfil completo del usuario autenticado.
- `PATCH /users/me`: Actualización de nombre, teléfono y preferencias.
- `POST /users/me/addresses`: Registro de nuevas direcciones de envío.
- `PATCH /users/me/addresses/:id`: Edición de direcciones existentes.
- `DELETE /users/me/addresses/:id`: Remoción de direcciones del perfil.

## Ejemplo de Uso

```typescript
// Actualizar perfil de usuario
const updated = await updateProfile.execute({
  userId: 'user-uuid',
  name: 'Jane Doe',
  phone: '+123456789',
});
console.log(`Perfil de ${updated.name} actualizado`);
```

## Notas de Integración

- **Seguridad**: Requiere `JwtAuthGuard`.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Admin**: Acciones de gestión global se centralizan en `AdminContext`.
