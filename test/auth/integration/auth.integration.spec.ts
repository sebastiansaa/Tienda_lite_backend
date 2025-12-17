import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthUserPrismaAdapter } from 'src/contexts/auth/infra/persistence/auth-user.prisma.adapter';
import { RefreshTokenPrismaAdapter } from 'src/contexts/auth/infra/persistence/refresh-token.prisma.adapter';
import { RegisterUserUseCase } from 'src/contexts/auth/app/usecases/register.usecase';
import { LoginUserUseCase } from 'src/contexts/auth/app/usecases/login.usecase';
import { UserRepositoryPort } from 'src/contexts/auth/app/ports/auth-user.repository.port';
import { RefreshTokenRepositoryPort } from 'src/contexts/auth/app/ports/refresh-token.repository.port';
import { TokenServicePort } from 'src/contexts/auth/app/ports/token.service.port';
import { PasswordHasherPort } from 'src/contexts/auth/app/ports/password-hasher.port';
import { RegisterUserInput, LoginUserInput } from 'src/contexts/auth/app/inputs';

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
        updatedAt: mockDate,
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
        },
    } as unknown as PrismaService;

    const mockTokenService: TokenServicePort = {
        signAccessToken: jest.fn().mockResolvedValue('access_token'),
        signRefreshToken: jest.fn().mockResolvedValue('refresh_token'),
        verifyAccessToken: jest.fn(),
        verifyRefreshToken: jest.fn(),
        hashToken: jest.fn().mockResolvedValue('hashed_token'),
        compareTokenHash: jest.fn(),
        getRefreshExpirationDate: jest.fn().mockReturnValue(new Date()),
    };

    const mockPasswordHasher: PasswordHasherPort = {
        hash: jest.fn().mockResolvedValue('hashed_password_secure_long'),
        compare: jest.fn().mockResolvedValue(true),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthUserPrismaAdapter,
                RefreshTokenPrismaAdapter,
                { provide: PrismaService, useValue: mockPrismaService },
                {
                    provide: RegisterUserUseCase,
                    useFactory: (userRepo: UserRepositoryPort, refreshRepo: RefreshTokenRepositoryPort) =>
                        new RegisterUserUseCase(userRepo, refreshRepo, mockTokenService, mockPasswordHasher),
                    inject: [AuthUserPrismaAdapter, RefreshTokenPrismaAdapter],
                },
                {
                    provide: LoginUserUseCase,
                    useFactory: (userRepo: UserRepositoryPort, refreshRepo: RefreshTokenRepositoryPort) =>
                        new LoginUserUseCase(userRepo, refreshRepo, mockTokenService, mockPasswordHasher),
                    inject: [AuthUserPrismaAdapter, RefreshTokenPrismaAdapter],
                },
            ],
        }).compile();

        registerUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
        loginUseCase = module.get<LoginUserUseCase>(LoginUserUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should register a new user', async () => {
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
        (prismaService.user.upsert as jest.Mock).mockResolvedValue(mockUserDb);
        (prismaService.refreshToken.create as jest.Mock).mockResolvedValue({
            id: 'rt-1',
            userId: 'user-1',
            tokenHash: 'hashed_token',
            expiresAt: mockDate,
            createdAt: mockDate,
        });

        const input = new RegisterUserInput('test@test.com', 'password123');
        const result = await registerUseCase.execute(input);

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
        expect(prismaService.user.upsert).toHaveBeenCalled();
        expect(result.user.email).toBe('test@test.com');
        expect(result.tokens.accessToken).toBe('access_token');
    });

    it('should login an existing user', async () => {
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUserDb);
        (prismaService.refreshToken.create as jest.Mock).mockResolvedValue({
            id: 'rt-1',
            userId: 'user-1',
            tokenHash: 'hashed_token',
            expiresAt: mockDate,
            createdAt: mockDate,
        });

        const input = new LoginUserInput('test@test.com', 'password123');
        const result = await loginUseCase.execute(input);

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
        expect(result.user.id).toBe('user-1');
        expect(result.tokens.accessToken).toBe('access_token');
    });
});