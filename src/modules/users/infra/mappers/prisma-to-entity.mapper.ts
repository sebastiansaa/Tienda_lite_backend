import { UserEntity } from '../../domain/entity/user.entity';

export const prismaToUserEntity = (p: any): UserEntity => {
    if (!p) return null as any;
    return new UserEntity(p.id, p.email, p.name ?? undefined);
};
