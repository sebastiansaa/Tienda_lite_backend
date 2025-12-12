import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import UserRepositoryPort from '../../application/ports/user.repository.port';
import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserStatus } from '../../domain/v-o/user-status.vo';
import { prismaToUser, addressToPrisma } from '../mappers/user-prisma.mapper';

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return prismaToUser(user, []);
    }

    async findByIdWithAddresses(id: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        const addresses = await this.prisma.address.findMany({ where: { userId: id } });
        return prismaToUser(user, addresses);
    }

    async listAll(): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
        return users.map((u) => prismaToUser(u, []));
    }

    async save(user: UserEntity): Promise<UserEntity> {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                phone: user.phone,
                status: user.status,
                preferences: (user.preferences ?? Prisma.JsonNull) as Prisma.InputJsonValue,
            },
        });
        return this.findByIdWithAddresses(user.id) as Promise<UserEntity>;
    }

    async addAddress(userId: string, address: AddressEntity): Promise<AddressEntity> {
        await this.prisma.address.create({ data: addressToPrisma(address, userId) });
        return address;
    }

    async updateAddress(_userId: string, address: AddressEntity): Promise<AddressEntity> {
        await this.prisma.address.update({
            where: { id: address.id },
            data: {
                street: address.street,
                city: address.city,
                country: address.country,
                zipCode: address.zipCode,
            },
        });
        return address;
    }

    async deleteAddress(_userId: string, addressId: string): Promise<void> {
        await this.prisma.address.delete({ where: { id: addressId } });
    }

    async changeStatus(userId: string, status: UserStatus): Promise<UserEntity> {
        await this.prisma.user.update({ where: { id: userId }, data: { status } });
        const updated = await this.findByIdWithAddresses(userId);
        if (!updated) throw new Error('User not found after status change');
        return updated;
    }
}

export default UserPrismaRepository;
