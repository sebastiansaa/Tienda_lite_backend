import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const adminHash = await bcrypt.hash('Admin123!', 10);
        const userHash = await bcrypt.hash('User123!', 10);

        const result = await prisma.user.createMany({
            data: [
                {
                    email: 'admin@example.com',
                    passwordHash: adminHash,
                    roles: ['admin'],
                },
                {
                    email: 'user@example.com',
                    passwordHash: userHash,
                    roles: ['user'],
                },
            ],
            skipDuplicates: true,
        });

        console.log(`Seed de usuarios completado. Registros insertados: ${result.count}`);
    } catch (error) {
        console.error('Error al ejecutar seed de usuarios', error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

main();
