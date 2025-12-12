import UserRepositoryPort from '../ports/user.repository.port';
import ChangeUserStatusCommand from '../commands/change-user-status.command';
import { UserEntity } from '../../domain/entity/user.entity';

export class ChangeUserStatusUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(cmd: ChangeUserStatusCommand): Promise<UserEntity> {
        const user = await this.userRepo.findByIdWithAddresses(cmd.userId);
        if (!user) throw new Error('User not found');
        user.changeStatus(cmd.status);
        return this.userRepo.changeStatus(user.id, cmd.status);
    }
}

export default ChangeUserStatusUsecase;
