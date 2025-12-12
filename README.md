Tienda Lite Backend
===================

Backend modular construido con NestJS aplicando DDD y Arquitectura Hexagonal. Cada bounded context es autonomo y se comunica solo por puertos.

Filosofia arquitectural
- DDD estricto: entidades ricas, Value Objects, invariantes y errores propios por contexto de negocio.
- Hexagonal: Application define puertos, Infrastructure los implementa, API adapta HTTP; Domain no depende de frameworks.
- DRY y separacion de capas: sin logica de negocio en API/Infra; sin DTOs ni Prisma en Domain/Application.
- Tokens DI: cada puerto se identifica con constantes en `constants.ts`, facilitando el intercambio de adaptadores.
- Mappers dedicados: API mapea DTO<->Command/Query; Infra mapea ORM<->Entidad/DTO.
- Casos de uso explicitos: toda accion pasa por un UseCase que orquesta puertos y entidades.
- Autenticacion transversal: Auth provee identidad (sub, roles) sin acoplarse al dominio User.

Estructura por contexto
```
src/contexts/<contexto>/
  domain/          # Entidades, VOs, reglas, errores (no aplica a Auth/Admin)
  application/     # UseCases, commands/queries, ports (contratos)
  infrastructure/  # Adaptadores concretos (Prisma, servicios externos), mappers
  api/             # Controllers, DTOs, mappers, guards
  constants.ts     # Tokens de inyeccion
  <context>.module.ts  # Composition root
```

Bounded contexts
- Tecnicos: Auth, Admin.
- Negocio: User, Product, Category, Inventory, Cart, Order, Payment.

Comunicacion entre contextos
- Siempre via puertos definidos en Application (ej. ProductReadOnlyPort, UserReadOnlyPort, OrderReadOnlyPort).
- Sin importaciones de entidades/VO/errores de otro dominio.
- Auth solo expone identidad y roles; Admin usa proyecciones y puertos readonly.

Documentacion y Swagger
- Cada contexto tiene README propio con proposito, capas, puertos, adaptadores, endpoints e integraciones.
- Swagger habilitado; anadir decoradores en controllers y DTOs para mantener contratos claros.

Pruebas y verificacion
- Usecases y entidades se prueban aislados con mocks de puertos.
- Ejecutar `npm run test` y `npm run type` para validar casos y tipos.

Scripts basicos
- Instalacion: `npm install`
- Prisma: `npx prisma generate` y `npx prisma migrate dev --name <name>`
- Desarrollo: `npm run start:dev`
- Produccion: `npm run start:prod`
- Tests: `npm run test` | `npm run test:e2e` | `npm run test:cov`

Lineamientos de diseno
- Sin dependencias circulares entre contextos.
- Sin filtraciones de dominio hacia API o entre dominios.
- Adaptadores reemplazables cambiando solo Infrastructure/composition.
- Roles via `JwtAuthGuard` + `RolesGuard` y metadata `@Roles`.

Diagrama textual global
- HTTP -> Controller (API) -> DTO -> ApiMapper -> UseCase (Application) -> Puertos -> Adaptadores (Infrastructure) -> DB/servicios externos -> Mapper -> DTO -> HTTP.
