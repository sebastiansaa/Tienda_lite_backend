import { AddAddressUseCase } from 'src/contexts/users/app/usecases/add-address.usecase';
import { AddAddressCommand } from 'src/contexts/users/app/commands/add-address.command';
import { UserEntity } from 'src/contexts/users/domain/entity/user.entity';
import { AddressEntity } from 'src/contexts/users/domain/entity/address.entity';
import { UserNotFoundError } from 'src/contexts/users/domain/errors/user.errors';

describe('AddAddressUseCase Integration', () => {
    let usecase: AddAddressUseCase;
    let readRepo: { findByIdWithAddresses: jest.Mock };
    let writeRepo: { addAddress: jest.Mock };

    const mockUser = new UserEntity({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test',
        status: 'ACTIVE',
        addresses: [],
    } as any);

    beforeEach(() => {
        readRepo = { findByIdWithAddresses: jest.fn() };
        writeRepo = { addAddress: jest.fn() };
        usecase = new AddAddressUseCase(readRepo as any, writeRepo as any);
    });

    it('should add address successfully', async () => {
        readRepo.findByIdWithAddresses.mockResolvedValue(mockUser);
        writeRepo.addAddress.mockResolvedValue(new AddressEntity({ street: 'St', city: 'Ct', country: 'Co', zipCode: '000' } as any));

        const command = new AddAddressCommand('user-1', 'St', 'Ct', 'Co', '000');
        const result = await usecase.execute(command);

        expect(readRepo.findByIdWithAddresses).toHaveBeenCalledWith('user-1');
        expect(writeRepo.addAddress).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it('should throw if user not found', async () => {
        readRepo.findByIdWithAddresses.mockResolvedValue(null);

        const command = new AddAddressCommand('user-1', 'S', 'C', 'C', '0');

        await expect(usecase.execute(command)).rejects.toThrow(UserNotFoundError);
    });
});