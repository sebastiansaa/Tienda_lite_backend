# Tienda Lite Backend

Backend modular construido con NestJS aplicando DDD y Arquitectura Hexagonal. Cada bounded context es autonomo y se comunica solo por puertos.

Filosofia arquitectural

- DDD estricto: entidades ricas, Value Objects, invariantes y errores propios por contexto de negocio.
- Hexagonal: Application define puertos, Infrastructure los implementa, API adapta HTTP; Domain no depende de frameworks.
- DRY y separacion de capas: sin logica de negocio en API/Infra; sin DTOs ni Prisma en Domain/Application.
- Tokens DI: cada puerto se identifica con constantes en `constants.ts`, facilitando el intercambio de adaptadores.
- Mappers dedicados: API mapea DTO<->Command/Query; Infra mapea ORM<->Entidad/DTO.
- Casos de uso explicitos: toda accion pasa por un UseCase que orquesta puertos y entidades.
- Autenticacion transversal: Auth provee identidad (sub, roles) sin acoplarse al dominio User.
- TypeScript estricto: sin any, sin castings inseguros; tipado fuerte en VOs, entidades, puertos y mappers.

CQRS

- Aplicado en contextos de negocio donde hay lectura/escritura diferenciada (Product, Inventory, Order, etc.).
- Separación estricta entre lectura y escritura en Application cuando corresponde.
- Commands modifican estado usando puertos write; Queries solo leen usando puertos readonly.
- Repositorios y puertos divididos en read/write por contexto cuando aplica.
- Cuando un contexto define puertos separados de lectura y escritura (CQRS), la infraestructura debe proveer adaptadores separados (ej. ProductPrismaWriteRepository y ProductPrismaReadRepository). Un puerto = un adaptador.
- Controllers mapean DTO → Command/Query según corresponda.

Estructura por contexto

```
src/contexts/<contexto>/
  domain/          # Entidades, VOs, reglas, errores (no aplica a Auth/Admin)
  app/     # UseCases, commands/queries, ports (contratos)
  infra/  # Adaptadores concretos (Prisma, servicios externos), mappers
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

 Estructura de pruebas

La capa de testing sigue la misma separación modular del backend y replica la arquitectura hexagonal en tres niveles: unit, integration y e2e. Cada tipo de prueba valida un nivel distinto del sistema.

Organización de carpetas

src/contexts/<context>/unit/        # Unit tests puros (entidades, VOs, usecases con mocks)
test/<context>/integration/         # Integraciones reales (Nest + Prisma + módulos reales)
test/<context>/unit/                # Unit tests de API (controllers/DTO) cuando no usan Nest real
test/e2e/                           # Pruebas end-to-end de la aplicación completa

Tipos de pruebas

Unit tests
- No usan NestJS ni Prisma.
- Mockean todos los puertos definidos en Application.
- Validan reglas de dominio, invariantes, VOs, entidades y casos de uso.
- Se ejecutan rápido y garantizan que el dominio es puro y determinista.

Integration tests
- Usan el módulo real del contexto (<context>.module.ts).
- Ejecutan casos de uso reales contra adaptadores concretos (Prisma).
- Requieren .env.test y una base de datos de test.
- Limpian tablas antes de cada suite para asegurar aislamiento.
- Verifican wiring, tokens DI, mappers y persistencia.

E2E tests
- Levantan la aplicación completa con NestFactory.
- Cubren flujos reales de negocio: auth → productos → stock → órdenes → pagos.
- Usan base de datos de test y teardown completo entre ejecuciones.
- Validan contratos HTTP, guards, roles, DTOs y comportamiento transversal.

 Limpieza y aislamiento
Cada suite de integración y E2E ejecuta:
- truncado de tablas relevantes
- recreación de datos mínimos (ej. usuarios, productos, stock)
- cierre explícito de Prisma al finalizar

Esto garantiza reproducibilidad y evita contaminación entre contextos.

 Comandos
- npm run test — unit + integration
- npm run test:e2e — pruebas end-to-end
- npm run test:cov — cobertura
- npm run type — verificación estricta de tipos


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
