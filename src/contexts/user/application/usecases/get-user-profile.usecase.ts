import UserRepositoryPort from '../ports/user.repository.port';
import GetUserProfileQuery from '../queries/get-user-profile.query';
import { UserEntity } from '../../domain/entity/user.entity';

export class GetUserProfileUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(query: GetUserProfileQuery): Promise<UserEntity | null> {
        return this.userRepo.findByIdWithAddresses(query.userId);
    }
}

export default GetUserProfileUsecase;
