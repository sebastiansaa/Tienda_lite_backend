import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserStatus } from '../../domain/v-o/user-status.vo';

export interface UserRepositoryPort {
    findById(id: string): Promise<UserEntity | null>;
    findByIdWithAddresses(id: string): Promise<UserEntity | null>;
    listAll(): Promise<UserEntity[]>;
    save(user: UserEntity): Promise<UserEntity>;
    addAddress(userId: string, address: AddressEntity): Promise<AddressEntity>;
    updateAddress(userId: string, address: AddressEntity): Promise<AddressEntity>;
    deleteAddress(userId: string, addressId: string): Promise<void>;
    changeStatus(userId: string, status: UserStatus): Promise<UserEntity>;
}

export default UserRepositoryPort;
