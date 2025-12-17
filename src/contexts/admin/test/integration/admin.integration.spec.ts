import * as fs from 'fs';
import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { AdminModule } from 'src/contexts/admin/admin.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAdminUserDetailsUsecase } from 'src/contexts/admin/app/usecases/get-user-details.usecase';

// Load .env.test if present
if (fs.existsSync('.env.test')) require('dotenv').config({ path: '.env.test' });

const hasDb = Boolean(process.env.DATABASE_URL);
const suite = hasDb ? describe : describe.skip;

suite('Admin Integration Tests (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let getUserDetails: GetAdminUserDetailsUsecase;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AdminModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        getUserDetails = moduleRef.get(GetAdminUserDetailsUsecase);
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('creates a user in prisma and retrieves it through the admin usecase', async () => {
        const created = await prisma.user.create({
            data: {
                email: 'integration@example.test',
                passwordHash: 'x',
                roles: ['user'],
                name: 'Integration',
                phone: null,
                status: 'ACTIVE',
            },
        });

        const res = await getUserDetails.execute(created.id);
        expect(res).not.toBeNull();
        expect(res?.email).toBe('integration@example.test');
        expect(res?.id).toBe(created.id);
    });
});
