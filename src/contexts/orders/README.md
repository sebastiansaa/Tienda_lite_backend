Orders domain

Responsible for order lifecycle (create, fetch). Contains:

- domain/entity/order.entity.ts
- domain/interfaces/order.repository.ts
- app/commands/create-order.command.ts
- app/usecases/create-order.usecase.ts
- api/dtos/create-order.dto.ts
- infra/repository/order-prisma.repository.ts

Example flow: create order via POST /orders -> DTO -> Command -> UseCase -> Repository (Prisma)
