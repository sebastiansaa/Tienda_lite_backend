Cart domain

Manages user's shopping cart operations (add item, fetch). Contains:

- domain/entity/cart.entity.ts
- domain/interfaces/cart.repository.ts
- app/commands/add-item.command.ts
- app/usecases/add-item.usecase.ts
- api/dtos/add-item.dto.ts
- infra/repository/cart-prisma.repository.ts

Example flow: POST /cart/add -> DTO -> Command -> UseCase -> Repository
