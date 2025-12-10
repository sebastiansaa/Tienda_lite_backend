import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUserRepository } from '../../domain/interfaces/user.repository';
import { UserEntity } from '../../domain/entity/user.entity';
import { prismaToUserEntity } from '../mappers/prisma-to-entity.mapper';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(user: UserEntity): Promise<UserEntity> {
        const created = await this.prisma.user.create({ data: { id: user.id, email: user.email, name: user.name } });
        return prismaToUserEntity(created);
    }

    async findById(id: string): Promise<UserEntity | null> {
        const found = await this.prisma.user.findUnique({ where: { id } });
        return prismaToUserEntity(found);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const found = await this.prisma.user.findUnique({ where: { email } });
        return prismaToUserEntity(found);
    }
}
