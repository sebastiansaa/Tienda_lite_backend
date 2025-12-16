import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUserWriteRepository } from '../../app/ports/user-write.repository';
import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserStatus } from '../../domain/v-o/user-status.vo';
import { UserMapper, AddressMapper } from '../mappers/user-prisma.mapper';

@Injectable()
export class UserPrismaWriteRepository implements IUserWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(user: UserEntity): Promise<UserEntity> {
        const data = UserMapper.toPersistence(user);
        const saved = await this.prisma.user.upsert({
            where: { id: user.id },
            update: data,
            create: data,
        });
        return UserMapper.toDomain(saved);
    }

    async addAddress(userId: string, address: AddressEntity): Promise<AddressEntity> {
        const data = AddressMapper.toPersistencePartial(address);
        const saved = await this.prisma.address.create({ data: { ...data, userId } });
        return AddressMapper.toDomain(saved);
    }

    async updateAddress(userId: string, address: AddressEntity): Promise<AddressEntity> {
        const data = AddressMapper.toPersistencePartial(address);
        const saved = await this.prisma.address.update({ where: { id: address.id }, data });
        return AddressMapper.toDomain(saved);
    }

    async deleteAddress(userId: string, addressId: string): Promise<void> {
        await this.prisma.address.delete({ where: { id: addressId } });
    }

    async changeStatus(userId: string, status: UserStatus): Promise<UserEntity> {
        const saved = await this.prisma.user.update({ where: { id: userId }, data: { status } });
        return UserMapper.toDomain(saved);
    }
}
