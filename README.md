Perfecto, Sebastián. Te paso el texto completo ya corregido y coherente, con las mejoras que comentamos:

🛒 Tienda Lite
Tienda Lite es una aplicación ejemplo de e-commerce construida con NestJS, diseñada para demostrar un patrón arquitectural basado en:

- Domain-Driven Design (DDD)
- Arquitectura Hexagonal (puertos y adaptadores)
- Organización vertical por dominios
- TypeScript estricto
  Cada dominio es autónomo y contiene su propia estructura de carpetas (domain, application, api, infrastructure), lo que asegura claridad, modularidad y transferibilidad.

---

## 🚀 Inicio rápido

1. Copia `.env.example` a `.env` y completa las variables necesarias:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `STRIPE_SECRET`
   - etc.

2. Instala dependencias:

   ```bash
   npm install

   ```

3. Genera el cliente Prisma y aplica migraciones:
   npx prisma generate
   npx prisma migrate dev --name init

4. Ejecuta en modo desarrollo
   npm run start:dev

5. Accede a la documentación API (Swagger):
   http://localhost:3000/api/docs

Scripts principales:

# desarrollo

npm run start

# modo watch (hot reload)

npm run start:dev

# producción

npm run start:prod

# tests unitarios

npm run test

# tests end-to-end

npm run test:e2e

# cobertura de tests

npm run test:cov

Filosofía arquitecturalEste proyecto aplica una aproximación estricta de DDD + Hexagonal, con organización vertical por dominio

Cada dominio contiene 4 capas principales:

- Domain
  - Núcleo puro del negocio.
  - Entidades, Value Objects (VO), lógica y errores específicos.
  - No depende de frameworks ni librerías externas.

  - Application (app)
    - Casos de uso (UseCases) y Commands.
    - Orquesta la ejecución del dominio.
    - Recibe comandos puros y usa puertos para persistencia/servicios externos.

- API
  - Adaptadores de presentación (Controllers, DTOs, mappers).
  - Mapea HTTP → DTO → Command → UseCase → respuesta.
  - No contiene lógica de negocio.

- Infrastructure
  - Adaptadores técnicos e implementaciones concretas.
  - Repositorios (ej. Prisma), mappers, configuración.
  - Implementa los puertos definidos en domain.

🔄 Flujo de datos (puro)- Controller (HTTP) recibe un DTO.

- Mapper (API) convierte el DTO en un Command.
- UseCase (Application) recibe el Command, valida y usa entidades/puertos.
- Infra Repository implementa el puerto y persiste/fetch en DB.
- UseCase devuelve un objeto de dominio o primitivo.
- Controller responde al cliente.

✅ Ventajas- Testabilidad: UseCases y entidades pueden probarse sin frameworks.

- Escalabilidad: cambiar la infraestructura (Prisma → Mongo, memoria → Redis) solo requiere un nuevo adaptador.
- Separación de responsabilidades: cada capa tiene un rol claro y auditable.
- Transferibilidad: cada dominio es autónomo y puede migrarse fácilmente a otro proyecto.

📘 Convenciones por capa- DTO: contrato de entrada/salida acoplado a HTTP.

- Controller: recibe peticiones, transforma DTO → Command y delega a UseCase.
- Command: objeto simple que representa la intención de un caso de uso.
- UseCase: orquestador de operaciones del dominio.
- Entity: encapsula comportamiento e invariantes del negocio.
- Value Object (VO): objetos inmutables que modelan conceptos semánticos (ej. ProductId, Money, Email).
- Repository interface (Puerto): contrato que el dominio espera para persistencia.
- Infrastructure Repository (Adaptador): implementación concreta del puerto (ej. Prisma).
- Mapper: traduce entre formatos (DTO → Command, Prisma → Entity, Entity → DTO).

📂 Estructura de carpeta
src/
├── modules/
│ ├── usuarios/
│ │ ├── domain/
│ │ ├── application/
│ │ ├── api/
│ │ └── Infrastructure/
│ ├── products/
│ ├── categories/
│ ├── orders/
│ └── cart/
└── prisma/
├── schema.prisma
└── prisma.service.ts

    Estructura de un Modulo

src/
└── modules/
└── usuarios/ # Dominio "Usuarios"
├── domain/ # 1. Núcleo del dominio (puro)
│ ├── entity/
│ │ └── user.entity.ts
│ ├── v-o/ # Value Objects
│ │ └── email.vo.ts
│ ├── interfaces/
│ │ └── user.repository.ts # Puerto (contrato)
│ ├── errors/
│ │ └── user.errors.ts
│ └── helpers/
│ │ └── user.helpers.ts
│ └── rules/
│  
 ├── application/ # 2. Lógica de aplicación (orquestación pura)
│ ├── usecases/
│ │ ├── create-user.usecase.ts
│ │ └── find-user-by-id.usecase.ts
│ ├── commands/
│ │ └── create-user.command.ts
│ └── ports/
│ └── user.service.port.ts
│  
 │
├── api/ # 3. Adaptador de presentación (entrada HTTP)
│ ├── controller/
│ │ └── user.controller.ts
│ ├── dtos/
│ │ └── create-user.dto.ts
│ ├── mappers/
│ │ └── dto-to-command.mapper.ts
│ └── user.module.ts # Módulo NestJS (composition root)
│
└── Infrastructure/ # 4. Adaptador técnico (salida)
├── mappers/
│ └── prisma-to-entity.mapper.ts
├── repository/
│ └── user-prisma.repository.ts
├── filter/
│ └── user.filter.ts
└── config/
└── user.config.ts
