Categories domain

Small module for product categories. Contains:

- domain/entity/category.entity.ts
- domain/interfaces/category.repository.ts
- app/commands/create-category.command.ts
- app/usecases/create-category.usecase.ts
- api/controller/categories.controller.ts
- infra/repository/category-prisma.repository.ts

Flow: HTTP -> DTO -> Command -> UseCase -> Repository
