import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './api/controller/user.controller';
import { USER_REPOSITORY, USER_READONLY } from './constants';
import { UserPrismaRepository } from './infra/repository/user-prisma.repository';
import { UserReadOnlyAdapter } from './infra/adapters/user-readonly.adapter';
import {
    GetUserProfileUsecase,
    UpdateUserProfileUsecase,
    AddAddressUsecase,
    UpdateAddressUsecase,
    DeleteAddressUsecase,
    ChangeUserStatusUsecase,
    ListUsersUsecase,
} from './application/usecases';
import UserRepositoryPort from './application/ports/user.repository.port';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [UserController],
    providers: [
        { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
        { provide: USER_READONLY, useClass: UserReadOnlyAdapter },
        { provide: GetUserProfileUsecase, useFactory: (repo: UserRepositoryPort) => new GetUserProfileUsecase(repo), inject: [USER_REPOSITORY] },
        { provide: UpdateUserProfileUsecase, useFactory: (repo: UserRepositoryPort) => new UpdateUserProfileUsecase(repo), inject: [USER_REPOSITORY] },
        { provide: AddAddressUsecase, useFactory: (repo: UserRepositoryPort) => new AddAddressUsecase(repo), inject: [USER_REPOSITORY] },
        { provide: UpdateAddressUsecase, useFactory: (repo: UserRepositoryPort) => new UpdateAddressUsecase(repo), inject: [USER_REPOSITORY] },
        { provide: DeleteAddressUsecase, useFactory: (repo: UserRepositoryPort) => new DeleteAddressUsecase(repo), inject: [USER_REPOSITORY] },
        { provide: ChangeUserStatusUsecase, useFactory: (repo: UserRepositoryPort) => new ChangeUserStatusUsecase(repo), inject: [USER_REPOSITORY] },
        { provide: ListUsersUsecase, useFactory: (repo: UserRepositoryPort) => new ListUsersUsecase(repo), inject: [USER_REPOSITORY] },
    ],
    exports: [USER_READONLY],
})
export class UserModule { }
