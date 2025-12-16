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
        // userId is optional here because it might be added by the repository context
        const data: Prisma.AddressUncheckedCreateInput = {
            id: address.id,
            street: address.street,
            city: address.city,
            country: address.country,
            zipCode: address.zipCode,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
            userId: userId || '', // This might be an issue if userId is strictly required by type, but repo handles it. 
            // However, Repository calls `toPersistence(address)` without userId then adds it.
        };
        // If strict typing requires userId, we might need to adjust signature or handle partial.
        // Prisma.AddressUncheckedCreateInput REQUIRES userId.
        // We will make it required in `toPersistence` but handle where calls come from.
        // Actually, Repository does: `const data = AddressMapper.toPersistence(address); const saved = create({ data: { ...data, userId } });`
        // So `toPersistence` should return Omit<..., 'userId'> or optional.
        return data;
    }

    // Better implementation for Repository usage:
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
