import { Prisma, User as UserPrisma, Address as AddressPrisma } from '@prisma/client';
import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';

export const prismaToUser = (user: UserPrisma, addresses: AddressPrisma[] = []): UserEntity => {
    return new UserEntity({
        id: user.id,
        email: user.email,
        name: user.name ?? 'User',
        phone: user.phone ?? null,
        status: (user.status as any) ?? 'ACTIVE',
        preferences: user.preferences as Record<string, unknown> | null,
        addresses: addresses.map((a) => ({
            id: a.id,
            street: a.street,
            city: a.city,
            country: a.country,
            zipCode: a.zipCode,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        })),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
};

export const userToPrisma = (user: UserEntity): Prisma.UserUncheckedCreateInput => ({
    id: user.id,
    email: user.email,
    passwordHash: '', // Auth context manages credentials; placeholder to satisfy schema if required
    roles: [],
    name: user.name,
    phone: user.phone,
    status: user.status,
    preferences: (user.preferences ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const addressToPrisma = (address: AddressEntity, userId: string): Prisma.AddressUncheckedCreateInput => ({
    id: address.id,
    userId,
    street: address.street,
    city: address.city,
    country: address.country,
    zipCode: address.zipCode,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
});
