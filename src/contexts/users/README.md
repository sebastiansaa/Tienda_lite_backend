Users domain

This module follows the vertical DDD hexagonal structure. Files of interest:

- domain/entity/user.entity.ts — User entity representing core data and behavior.
- domain/interfaces/user.repository.ts — repository port used by usecases.
- app/commands/create-user.command.ts — command object used to create users.
- app/usecases/create-user.usecase.ts — usecase that implements the create user flow.
- api/dtos/create-user.dto.ts — request shape for new users.
- api/mappers/dto-to-command.mapper.ts — maps DTO → Command.
- api/controller/users.controller.ts — Controller adapter exposing POST /users.
- infra/repository/user-prisma.repository.ts — Prisma implementation of repository.

Flow example: Controller receives DTO → Mapper converts to CreateUserCommand → CreateUserUsecase.execute(command) → UseCase uses UserRepositoryPort → UserPrismaRepository persists user.
