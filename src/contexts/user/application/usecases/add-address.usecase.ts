import UserRepositoryPort from '../ports/user.repository.port';
import AddAddressCommand from '../commands/add-address.command';
import { AddressEntity } from '../../domain/entity/address.entity';

export class AddAddressUsecase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(cmd: AddAddressCommand): Promise<AddressEntity> {
        const user = await this.userRepo.findByIdWithAddresses(cmd.userId);
        if (!user) throw new Error('User not found');
        const address = user.addAddress({
            street: cmd.street,
            city: cmd.city,
            country: cmd.country,
            zipCode: cmd.zipCode,
        });
        await this.userRepo.save(user);
        await this.userRepo.addAddress(user.id, address);
        return address;
    }
}

export default AddAddressUsecase;
