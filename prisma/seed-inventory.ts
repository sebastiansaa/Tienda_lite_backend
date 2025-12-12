import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomStock(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    try {
        const products = await prisma.product.findMany();

        if (products.length === 0) {
            console.log('No hay productos para inicializar inventario.');
            return;
        }

        const entries = products.map((product) => ({
            productId: product.id,
            onHand: randomStock(10, 50),
            reserved: 0,
        }));

        const result = await prisma.inventoryItem.createMany({
            data: entries,
            skipDuplicates: true,
        });

        console.log(`Seed de inventario completado. Registros insertados: ${result.count}`);
    } catch (error) {
        console.error('Error al ejecutar seed de inventario', error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

main();
