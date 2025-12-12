import UserRepositoryPort from '../ports/user.repository.port';
import UpdateAddressCommand from '../commands/update-address.command';
import { AddressEntity } from '../../domain/entity/address.entity';

export class UpdateAddressUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(cmd: UpdateAddressCommand): Promise<AddressEntity> {
        const user = await this.userRepo.findByIdWithAddresses(cmd.userId);
        if (!user) throw new Error('User not found');
        const address = user.updateAddress(cmd.addressId, {
            street: cmd.street,
            city: cmd.city,
            country: cmd.country,
            zipCode: cmd.zipCode,
        });
        await this.userRepo.save(user);
        await this.userRepo.updateAddress(user.id, address);
        return address;
    }
}

export default UpdateAddressUsecase;
