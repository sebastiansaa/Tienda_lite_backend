import { GetAuthenticatedUserQuery } from '../queries';
import { UserRepositoryPort } from '../ports/user.repository';
import { UserNotFoundError } from '../../domain/errors/auth.errors';
import { UserEntity } from '../../domain/entity/user.entity';

export class GetAuthenticatedUserUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(query: GetAuthenticatedUserQuery): Promise<UserEntity> {
        const user = await this.userRepo.findById(query.userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        return user;
    }
}
