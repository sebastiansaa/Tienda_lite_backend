import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserStatus } from '../../domain/v-o/user-status.vo';
import UserRepositoryPort from '../ports/user.repository.port';
import GetUserProfileUsecase from '../usecases/get-user-profile.usecase';
import UpdateUserProfileUsecase from '../usecases/update-user-profile.usecase';
import AddAddressUsecase from '../usecases/add-address.usecase';
import UpdateAddressUsecase from '../usecases/update-address.usecase';
import DeleteAddressUsecase from '../usecases/delete-address.usecase';
import ChangeUserStatusUsecase from '../usecases/change-user-status.usecase';
import ListUsersUsecase from '../usecases/list-users.usecase';
import GetUserProfileQuery from '../queries/get-user-profile.query';
import UpdateUserProfileCommand from '../commands/update-user-profile.command';
import AddAddressCommand from '../commands/add-address.command';
import UpdateAddressCommand from '../commands/update-address.command';
import DeleteAddressCommand from '../commands/delete-address.command';
import ChangeUserStatusCommand from '../commands/change-user-status.command';
import ListUsersQuery from '../queries/list-users.query';

class InMemoryUserRepo implements UserRepositoryPort {
    constructor(private store: Map<string, UserEntity>) { }

    async findById(id: string): Promise<UserEntity | null> {
        return this.store.get(id) ?? null;
    }

    async findByIdWithAddresses(id: string): Promise<UserEntity | null> {
        return this.findById(id);
    }

    async listAll(): Promise<UserEntity[]> {
        return Array.from(this.store.values());
    }

    async save(user: UserEntity): Promise<UserEntity> {
        this.store.set(user.id, user);
        return user;
    }

    async addAddress(userId: string, address: AddressEntity): Promise<AddressEntity> {
        const user = this.store.get(userId);
        if (!user) throw new Error('User not found');
        // address already added in entity, repo just acknowledges
        return address;
    }

    async updateAddress(_userId: string, address: AddressEntity): Promise<AddressEntity> {
        return address;
    }

    async deleteAddress(_userId: string, _addressId: string): Promise<void> {
        return;
    }

    async changeStatus(userId: string, status: UserStatus): Promise<UserEntity> {
        const user = this.store.get(userId);
        if (!user) throw new Error('User not found');
        user.changeStatus(status);
        this.store.set(user.id, user);
        return user;
    }
}

const makeUser = () => new UserEntity({
    id: 'user-1',
    email: 'ada@example.com',
    name: 'Ada',
    phone: '+34123456789',
    status: 'ACTIVE',
    preferences: { theme: 'dark' },
    addresses: [
        {
            id: 'addr-1',
            street: 'Main 1',
            city: 'Madrid',
            country: 'Spain',
            zipCode: '28001',
        },
    ],
});

describe('User usecases (application layer)', () => {
    let repo: InMemoryUserRepo;
    beforeEach(() => {
        repo = new InMemoryUserRepo(new Map([['user-1', makeUser()]]));
    });

    it('gets profile with addresses', async () => {
        const uc = new GetUserProfileUsecase(repo);
        const res = await uc.execute(new GetUserProfileQuery('user-1'));
        expect(res?.id).toBe('user-1');
        expect(res?.addresses.length).toBe(1);
    });

    it('updates profile fields', async () => {
        const uc = new UpdateUserProfileUsecase(repo);
        const updated = await uc.execute(new UpdateUserProfileCommand('user-1', 'Ada L', null, { lang: 'es' }));
        expect(updated.name).toBe('Ada L');
        expect(updated.preferences).toEqual({ lang: 'es' });
    });

    it('adds an address', async () => {
        const uc = new AddAddressUsecase(repo);
        const address = await uc.execute(new AddAddressCommand('user-1', 'New St', 'Barcelona', 'Spain', '08001'));
        expect(address.city).toBe('Barcelona');
        const refreshed = await repo.findByIdWithAddresses('user-1');
        expect(refreshed?.addresses.length).toBe(2);
    });

    it('updates an address', async () => {
        const uc = new UpdateAddressUsecase(repo);
        const updated = await uc.execute(new UpdateAddressCommand('user-1', 'addr-1', 'New St', undefined, undefined, '99999'));
        expect(updated.street).toBe('New St');
        expect(updated.zipCode).toBe('99999');
    });

    it('deletes an address', async () => {
        const uc = new DeleteAddressUsecase(repo);
        await uc.execute(new DeleteAddressCommand('user-1', 'addr-1'));
        const refreshed = await repo.findByIdWithAddresses('user-1');
        expect(refreshed?.addresses.length).toBe(0);
    });

    it('changes user status', async () => {
        const uc = new ChangeUserStatusUsecase(repo);
        const updated = await uc.execute(new ChangeUserStatusCommand('user-1', 'SUSPENDED'));
        expect(updated.status).toBe('SUSPENDED');
    });

    it('lists users', async () => {
        const uc = new ListUsersUsecase(repo);
        const users = await uc.execute(new ListUsersQuery());
        expect(users).toHaveLength(1);
    });
});
