import UserRepositoryPort from '../ports/user.repository.port';
import DeleteAddressCommand from '../commands/delete-address.command';

export class DeleteAddressUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(cmd: DeleteAddressCommand): Promise<void> {
        const user = await this.userRepo.findByIdWithAddresses(cmd.userId);
        if (!user) throw new Error('User not found');
        user.deleteAddress(cmd.addressId);
        await this.userRepo.save(user);
        await this.userRepo.deleteAddress(user.id, cmd.addressId);
    }
}

export default DeleteAddressUsecase;
