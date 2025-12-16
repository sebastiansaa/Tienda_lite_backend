import { Test, TestingModule } from '@nestjs/testing';
import { AddAddressUseCase } from '../../app/usecases/add-address.usecase';
import { AddAddressCommand } from '../../app/commands/add-address.command';
import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserNotFoundError } from '../../domain/errors/user.errors';

describe('AddAddressUseCase Integration', () => {
    let usecase: AddAddressUseCase;
    let readRepo: any;
    let writeRepo: any;

    const mockUser = new UserEntity({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test',
        status: 'ACTIVE',
        addresses: []
    });

    beforeEach(async () => {
        readRepo = { findByIdWithAddresses: jest.fn() };
        writeRepo = { addAddress: jest.fn() };

        // Manual injection validation
        usecase = new AddAddressUseCase(readRepo, writeRepo);
    });

    it('should add address successfully', async () => {
        readRepo.findByIdWithAddresses.mockResolvedValue(mockUser);
        writeRepo.addAddress.mockResolvedValue(new AddressEntity({
            street: 'St', city: 'Ct', country: 'Co', zipCode: '000'
        }));

        const command = new AddAddressCommand(
            'user-1',
            'St',
            'Ct',
            'Co',
            '000'
        );

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
