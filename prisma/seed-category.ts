import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.category.createMany({
            data: [
                {
                    title: 'Ropa',
                    slug: 'ropa',
                    image: 'https://example.com/categorias/ropa.jpg',
                    description: 'Prendas y accesorios',
                    sortOrder: 1,
                },
                {
                    title: 'Tecnologia',
                    slug: 'tecnologia',
                    image: 'https://example.com/categorias/tecnologia.jpg',
                    description: 'Dispositivos y gadgets',
                    sortOrder: 2,
                },
                {
                    title: 'Hogar',
                    slug: 'hogar',
                    image: 'https://example.com/categorias/hogar.jpg',
                    description: 'Articulos para el hogar',
                    sortOrder: 3,
                },
                {
                    title: 'Gaming',
                    slug: 'gaming',
                    image: 'https://example.com/categorias/gaming.jpg',
                    description: 'Consolas y accesorios',
                    sortOrder: 4,
                },
            ],
            skipDuplicates: true,
        });

        console.log(`Seed de categorias completado. Registros insertados: ${result.count}`);
    } catch (error) {
        console.error('Error al ejecutar seed de categorias', error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

main();
