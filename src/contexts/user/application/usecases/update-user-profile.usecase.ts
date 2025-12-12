import UserRepositoryPort from '../ports/user.repository.port';
import UpdateUserProfileCommand from '../commands/update-user-profile.command';
import { UserEntity } from '../../domain/entity/user.entity';

export class UpdateUserProfileUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(cmd: UpdateUserProfileCommand): Promise<UserEntity> {
        const user = await this.userRepo.findByIdWithAddresses(cmd.userId);
        if (!user) throw new Error('User not found');
        user.updateProfile({ name: cmd.name, phone: cmd.phone, preferences: cmd.preferences });
        return this.userRepo.save(user);
    }
}

export default UpdateUserProfileUsecase;
