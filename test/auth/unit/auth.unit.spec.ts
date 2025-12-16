import { RegisterUserUseCase } from '../../../src/contexts/auth/app/usecases/register.usecase';
import { UserAlreadyExistsError } from '../../../src/contexts/auth/domain/errors/auth.errors';
import { UserEntity } from '../../../src/contexts/auth/domain/entity/user.entity';
import { RefreshTokenEntity } from '../../../src/contexts/auth/domain/entity/refresh-token.entity';

const makeDeps = () => {
    const userRepo = {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        save: jest.fn(),
    };
    const refreshRepo = {
        save: jest.fn(),
        findByHash: jest.fn(),
        revokeByUserId: jest.fn(),
    };
    const tokenService = {
        signAccessToken: jest.fn().mockResolvedValue('access'),
        signRefreshToken: jest.fn().mockResolvedValue('refresh'),
        verifyAccessToken: jest.fn(),
        verifyRefreshToken: jest.fn(),
        hashToken: jest.fn().mockResolvedValue('hashed-refresh-token-value-xxxxxxxx'),
        compareTokenHash: jest.fn(),
        getRefreshExpirationDate: jest.fn().mockReturnValue(new Date('2099-01-01')),
    };
    const passwordHasher = {
        hash: jest.fn().mockResolvedValue('very-long-mocked-password-hash-value'),
        compare: jest.fn(),
    };
    return { userRepo, refreshRepo, tokenService, passwordHasher };
};

describe('RegisterUserUseCase (unit)', () => {
    it('registers a user and persists refresh token', async () => {
        const deps = makeDeps();
        deps.userRepo.save.mockImplementation(async (u: UserEntity) => u);
        const usecase = new RegisterUserUseCase(
            deps.userRepo as any,
            deps.refreshRepo as any,
            deps.tokenService as any,
            deps.passwordHasher as any,
        );

        const result = await usecase.execute({ email: 'u@test.com', password: 'Secret123!' });

        expect(deps.userRepo.findByEmail).toHaveBeenCalledWith('u@test.com');
        expect(deps.refreshRepo.revokeByUserId).toHaveBeenCalled();
        expect(result.tokens.accessToken).toBe('access');
        expect(deps.refreshRepo.save).toHaveBeenCalledWith(expect.any(RefreshTokenEntity));
    });

    it('throws if user already exists', async () => {
        const deps = makeDeps();
        deps.userRepo.findByEmail.mockResolvedValue(new UserEntity({ email: 'u@test.com', passwordHash: 'very-long-mocked-password-hash-value' }));
        const usecase = new RegisterUserUseCase(
            deps.userRepo as any,
            deps.refreshRepo as any,
            deps.tokenService as any,
            deps.passwordHasher as any,
        );

        await expect(usecase.execute({ email: 'u@test.com', password: 'Secret123!' })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
