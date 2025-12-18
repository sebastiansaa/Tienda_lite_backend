import { Test } from '@nestjs/testing';
import { AdminModule } from 'src/contexts/admin/admin.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ADMIN_USER_READ } from 'src/contexts/admin/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('AdminUserPrismaAdapter integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AdminModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(ADMIN_USER_READ as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('listUsers returns users', async () => {
        await prisma.user.create({ data: { email: 'u1@test', passwordHash: 'x', roles: ['user'], name: 'U1', phone: null } });
        await prisma.user.create({ data: { email: 'u2@test', passwordHash: 'x', roles: ['user'], name: 'U2', phone: null } });

        const list = await repo.listUsers();
        expect(list.length).toBeGreaterThanOrEqual(2);
        expect(list[0].email).toBeDefined();
    });

    it('getUserById returns the user', async () => {
        const created = await prisma.user.create({ data: { email: 'detail@test', passwordHash: 'x', roles: ['user'], name: 'Detail', phone: null } });
        const res = await repo.getUserById(created.id);
        expect(res).not.toBeNull();
        expect(res?.email).toBe('detail@test');
    });

    it('changeStatus updates status', async () => {
        const created = await prisma.user.create({ data: { email: 'status@test', passwordHash: 'x', roles: ['user'], name: 'Status', phone: null } });
        const changed = await repo.changeStatus(created.id, 'INACTIVE');
        expect(changed).not.toBeNull();
        expect(changed?.status).toBe('INACTIVE');

        const found = await prisma.user.findUnique({ where: { id: created.id } });
        expect(found?.status).toBe('INACTIVE');
    });
});
