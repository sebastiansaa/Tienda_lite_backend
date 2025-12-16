import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';

describe('UserEntity', () => {
    const validProps = {
        id: '123',
        email: 'test@example.com',
        name: 'John Doe',
        phone: '1234567890',
        status: 'ACTIVE' as const,
        preferences: {},
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    it('should create a valid user', () => {
        const user = new UserEntity(validProps);
        expect(user).toBeDefined();
        expect(user.id).toBe(validProps.id);
        expect(user.email).toBe(validProps.email);
    });

    it('should update profile', () => {
        const user = new UserEntity(validProps);
        user.updateProfile({ name: 'Jane Doe', phone: '0987654321' });
        expect(user.name).toBe('Jane Doe');
        expect(user.phone).toBe('0987654321');
    });

    it('should add address', () => {
        const user = new UserEntity(validProps);
        const address = user.addAddress({
            street: 'Main St',
            city: 'City',
            country: 'Country',
            zipCode: '12345'
        });
        expect(user.addresses.length).toBe(1);
        expect(address).toBeInstanceOf(AddressEntity);
    });

    it('should delete address', () => {
        const user = new UserEntity(validProps);
        const address = user.addAddress({
            street: 'Main St',
            city: 'City',
            country: 'Country',
            zipCode: '12345'
        });
        user.deleteAddress(address.id);
        expect(user.addresses.length).toBe(0);
    });

    it('should change status', () => {
        const user = new UserEntity(validProps);
        user.changeStatus('SUSPENDED');
        expect(user.status).toBe('SUSPENDED');
    });
});
