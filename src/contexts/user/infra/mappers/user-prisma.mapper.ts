import { Prisma, User as UserPrisma, Address as AddressPrisma } from '@prisma/client';
import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserStatus } from '../../domain/v-o/user-status.vo';

const allowedStatuses: UserStatus[] = ['ACTIVE', 'SUSPENDED', 'DELETED'];

const normalizeStatus = (status?: string | null): UserStatus => {
    if (status && allowedStatuses.includes(status as UserStatus)) return status as UserStatus;
    return 'ACTIVE';
};

export class AddressMapper {
    static toDomain(address: AddressPrisma): AddressEntity {
        return new AddressEntity({
            id: address.id,
            street: address.street,
            city: address.city,
            country: address.country,
            zipCode: address.zipCode,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
        });
    }

    static toPersistence(address: AddressEntity, userId?: string): Prisma.AddressUncheckedCreateInput {
        const data: Prisma.AddressUncheckedCreateInput = {
            id: address.id,
            street: address.street,
            city: address.city,
            country: address.country,
            zipCode: address.zipCode,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
            userId: userId || '',
        };
        return data;
    }
    static toPersistencePartial(address: AddressEntity): Omit<Prisma.AddressUncheckedCreateInput, 'userId'> {
        return {
            id: address.id,
            street: address.street,
            city: address.city,
            country: address.country,
            zipCode: address.zipCode,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
        };
    }
}

export class UserMapper {
    static toDomain(user: UserPrisma, addresses: AddressPrisma[] = []): UserEntity {
        return new UserEntity({
            id: user.id,
            email: user.email,
            name: user.name ?? 'User',
            phone: user.phone ?? null,
            status: normalizeStatus(user.status),
            preferences: user.preferences as Record<string, unknown> | null,
            addresses: addresses.map(AddressMapper.toDomain),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    static toPersistence(user: UserEntity): Prisma.UserUncheckedCreateInput {
        return {
            id: user.id,
            email: user.email,
            passwordHash: '',
            roles: [],
            name: user.name,
            phone: user.phone,
            status: user.status,
            preferences: (user.preferences ?? Prisma.JsonNull) as Prisma.InputJsonValue,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
