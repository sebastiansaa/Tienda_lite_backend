import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthUserPrismaAdapter } from '../../infra/persistence/auth-user.prisma.adapter';
import { RefreshTokenPrismaAdapter } from '../../infra/persistence/refresh-token.prisma.adapter';
import { RegisterUserUseCase } from '../../app/usecases/register.usecase';
import { LoginUserUseCase } from '../../app/usecases/login.usecase';
import { UserRepositoryPort } from '../../app/ports/auth-user.repository.port';
import { RefreshTokenRepositoryPort } from '../../app/ports/refresh-token.repository.port';
import { TokenServicePort } from '../../app/ports/token.service.port';
import { PasswordHasherPort } from '../../app/ports/password-hasher.port';
import { RegisterUserInput, LoginUserInput } from '../../app/inputs';

describe('Auth Context Integration', () => {
    let registerUseCase: RegisterUserUseCase;
    let loginUseCase: LoginUserUseCase;
    let prismaService: PrismaService;

    const mockDate = new Date();
    const mockUserDb = {
        id: 'user-1',
        email: 'test@test.com',
        passwordHash: 'hashed_password_secure_long',
        roles: ['user'],
        createdAt: mockDate,
        updatedAt: mockDate
    };

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
        },
        refreshToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            deleteMany: jest.fn(),
        }
    };

    const mockTokenService: TokenServicePort = {
        signAccessToken: jest.fn().mockResolvedValue('access_token'),
        signRefreshToken: jest.fn().mockResolvedValue('refresh_token'),
        verifyAccessToken: jest.fn(),
        verifyRefreshToken: jest.fn(),
        hashToken: jest.fn().mockResolvedValue('hashed_token'),
        compareTokenHash: jest.fn(),
        getRefreshExpirationDate: jest.fn().mockReturnValue(new Date())
    };

    const mockPasswordHasher: PasswordHasherPort = {
        hash: jest.fn().mockResolvedValue('hashed_password_secure_long'),
        compare: jest.fn().mockResolvedValue(true)
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthUserPrismaAdapter,
                RefreshTokenPrismaAdapter,
                { provide: PrismaService, useValue: mockPrismaService },
                {
                    provide: RegisterUserUseCase,
                    useFactory: (
                        userRepo: UserRepositoryPort,
                        refreshRepo: RefreshTokenRepositoryPort,
                    ) => new RegisterUserUseCase(userRepo, refreshRepo, mockTokenService, mockPasswordHasher),
                    inject: [AuthUserPrismaAdapter, RefreshTokenPrismaAdapter]
                },
                {
                    provide: LoginUserUseCase,
                    useFactory: (
                        userRepo: UserRepositoryPort,
                        refreshRepo: RefreshTokenRepositoryPort,
                    ) => new LoginUserUseCase(userRepo, refreshRepo, mockTokenService, mockPasswordHasher),
                    inject: [AuthUserPrismaAdapter, RefreshTokenPrismaAdapter]
                }
            ],
        }).compile();

        registerUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
        loginUseCase = module.get<LoginUserUseCase>(LoginUserUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should register a new user', async () => {
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.upsert.mockResolvedValue(mockUserDb);
        mockPrismaService.refreshToken.create.mockResolvedValue({
            id: 'rt-1',
            userId: 'user-1',
            tokenHash: 'hashed_token',
            expiresAt: mockDate,
            createdAt: mockDate
        });

        const input = new RegisterUserInput('test@test.com', 'password123');
        const result = await registerUseCase.execute(input);

        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
        expect(mockPrismaService.user.upsert).toHaveBeenCalled();
        expect(result.user.email).toBe('test@test.com');
        expect(result.tokens.accessToken).toBe('access_token');
    });

    it('should login an existing user', async () => {
        mockPrismaService.user.findUnique.mockResolvedValue(mockUserDb);
        mockPrismaService.refreshToken.create.mockResolvedValue({
            id: 'rt-1',
            userId: 'user-1',
            tokenHash: 'hashed_token',
            expiresAt: mockDate,
            createdAt: mockDate
        });

        const input = new LoginUserInput('test@test.com', 'password123');
        const result = await loginUseCase.execute(input);

        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
        expect(result.user.id).toBe('user-1');
        expect(result.tokens.accessToken).toBe('access_token');
    });
});
