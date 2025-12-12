import UserRepositoryPort from '../ports/user.repository.port';
import ListUsersQuery from '../queries/list-users.query';
import { UserEntity } from '../../domain/entity/user.entity';

export class ListUsersUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(_query: ListUsersQuery): Promise<UserEntity[]> {
        return this.userRepo.listAll();
    }
}

export default ListUsersUsecase;
