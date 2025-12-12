import { Module } from '@nestjs/common';
import { UsersController } from './api/controller/users.controller';
import { CreateUserUsecase } from './app/usecases/create-user.usecase';
import { UserPrismaRepository } from './infra/repository/user-prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [UsersController],
    providers: [CreateUserUsecase, UserPrismaRepository, PrismaService],
    exports: [CreateUserUsecase],
})
export class UsersModule { }
