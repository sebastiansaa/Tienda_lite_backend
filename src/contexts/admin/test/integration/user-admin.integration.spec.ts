import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AdminUserPrismaAdapter } from '../../infra/adapters/admin-user.prisma.adapter';
import { ListAdminUsersUsecase } from '../../app/usecases/list-users.usecase';
import { ChangeAdminUserStatusUsecase } from '../../app/usecases/change-user-status.usecase';
import UserAdminReadOnlyPort from '../../app/ports/user-admin.readonly.port';

describe('Admin User Integration', () => {
    let listUsersUseCase: ListAdminUsersUsecase;
    let changeStatusUseCase: ChangeAdminUserStatusUsecase;
    let prismaService: PrismaService;

    const mockDate = new Date();
    const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        phone: '123456',
        status: 'ACTIVE',
        passwordHash: 'hash',
        roles: ['user'],
        preferences: {},
        createdAt: mockDate,
        updatedAt: mockDate
    };

    const mockPrismaService = {
        user: {
            findMany: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn()
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminUserPrismaAdapter,
                { provide: PrismaService, useValue: mockPrismaService },
                {
                    provide: ListAdminUsersUsecase,
                    useFactory: (port: UserAdminReadOnlyPort) => new ListAdminUsersUsecase(port),
                    inject: [AdminUserPrismaAdapter]
                },
                {
                    provide: ChangeAdminUserStatusUsecase,
                    useFactory: (port: UserAdminReadOnlyPort) => new ChangeAdminUserStatusUsecase(port),
                    inject: [AdminUserPrismaAdapter]
                }
            ],
        }).compile();

        listUsersUseCase = module.get<ListAdminUsersUsecase>(ListAdminUsersUsecase);
        changeStatusUseCase = module.get<ChangeAdminUserStatusUsecase>(ChangeAdminUserStatusUsecase);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should list users', async () => {
        mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

        const result = await listUsersUseCase.execute();

        expect(prismaService.user.findMany).toHaveBeenCalled();
        expect(result).toHaveLength(1);
        expect(result[0].email).toBe(mockUser.email);
    });

    it('should change user status', async () => {
        const updatedUser = { ...mockUser, status: 'SUSPENDED' };
        mockPrismaService.user.update.mockResolvedValue(updatedUser);

        const result = await changeStatusUseCase.execute('user-1', 'SUSPENDED');

        expect(prismaService.user.update).toHaveBeenCalledWith({
            where: { id: 'user-1' },
            data: { status: 'SUSPENDED' }
        });
        expect(result?.status).toBe('SUSPENDED');
    });
});
