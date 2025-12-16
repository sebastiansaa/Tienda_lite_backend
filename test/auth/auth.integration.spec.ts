import * as fs from 'fs';
import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../../src/contexts/auth/auth.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RegisterUserUseCase } from '../../src/contexts/auth/app/usecases/register.usecase';

if (fs.existsSync('.env.test')) require('dotenv').config({ path: '.env.test' });
const hasDb = Boolean(process.env.DATABASE_URL);
const suite = hasDb ? describe : describe.skip;

suite('Auth Integration Tests (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let register: RegisterUserUseCase;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AuthModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        register = moduleRef.get(RegisterUserUseCase);
    });

    beforeEach(async () => {
        await prisma.refreshToken.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('registers a user and persists refresh token', async () => {
        const res = await register.execute({ email: 'int@example.test', password: 'Password123!' });
        expect(res.user.email).toBe('int@example.test');
        // refresh token saved
        const tokens = await prisma.refreshToken.findMany({ where: { userId: res.user.id } });
        expect(tokens.length).toBeGreaterThanOrEqual(1);
    });
});
