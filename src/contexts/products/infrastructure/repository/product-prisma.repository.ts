import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IProductRepository } from '../../application/ports/product.repository';
import { ProductReadOnlyPort } from 'src/contexts/shared/ports/product.readonly.repository';
import { ProductEntity } from '../../domain/entity';
import { ProductReadDto } from 'src/contexts/shared/dtos/product.read.dto';
import ProductPrismaMapper from '../mappers/ProductPrismaMapper';
import { buildFindManyArgs } from '../filter/product.filter';
import { StockInsufficientError } from '../../domain/errors/stock.errors';

@Injectable()
//Este repo esta implementando 2 contratos : el contrato completo de escritura/lectura del dominio (IProductRepository) y el contrato ligero para consumo cross-context (ProductReadOnlyPort). Eso evita duplicar lógica de acceso a BD mientras mantiene separados los contratos (puertos).

export class ProductPrismaWriteRepository implements IProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(product: ProductEntity): Promise<ProductEntity> {
        // Si el producto tiene id lo consideramos flujo de actualización
        if (typeof product.id === 'number') {
            const exists = await this.prisma.product.findUnique({ where: { id: product.id } });
            if (exists) {
                const updated = await this.prisma.product.update({ where: { id: product.id }, data: ProductPrismaMapper.toUpdateInput(product) });
                const entity = ProductPrismaMapper.toDomain(updated);
                if (!entity) throw new Error('Failed to map updated product');
                return entity;
            }
        }

        // Flujo de creación: dejar que la BD genere el id
        const created = await this.prisma.product.create({ data: ProductPrismaMapper.toCreateInput(product) });
        const entity = ProductPrismaMapper.toDomain(created);
        if (!entity) throw new Error('Failed to map created product');
        return entity;
    }

    async deleteById(id: number, soft?: boolean): Promise<void> {
        if (soft === false) {
            await this.prisma.product.delete({ where: { id } });
            return;
        }
        // soft delete — set active false
        await this.prisma.product.update({ where: { id }, data: { active: false } });
    }

    async restoreById(id: number): Promise<ProductEntity> {
        const updated = await this.prisma.product.update({ where: { id }, data: { active: true } });
        const entity = ProductPrismaMapper.toDomain(updated);
        if (!entity) throw new Error('Failed to map restored product');
        return entity;
    }

    async updateStock(id: number, quantity: number): Promise<ProductEntity> {
        const updated = await this.prisma.product.update({ where: { id }, data: { stock: quantity } });
        const entity = ProductPrismaMapper.toDomain(updated);
        if (!entity) throw new Error('Failed to map updated product stock');
        return entity;
    }

    async decrementStock(id: number, quantity: number): Promise<ProductEntity> {
        if (quantity <= 0) throw new Error('Quantity must be positive');

        // Ejecutamos la actualización y la lectura dentro de una transacción para
        // garantizar que la operación de decremento y la posterior lectura sean
        // consistentes entre sí. La actualización sigue usando la condición
        // `stock >= quantity` para evitar pasar a stock negativo.
        const [res, updated] = await this.prisma.$transaction([
            this.prisma.product.updateMany({ where: { id, stock: { gte: quantity } }, data: { stock: { decrement: quantity } } }),
            this.prisma.product.findUnique({ where: { id } }),
        ]);

        if (res.count === 0) {
            throw new StockInsufficientError();
        }

        const entity = ProductPrismaMapper.toDomain(updated);
        if (!entity) throw new Error('Failed to map product after decrement');
        return entity;
    }

    async findById(id: number): Promise<ProductEntity | null> {
        const found = await this.prisma.product.findUnique({ where: { id } });
        if (!found) return null;
        return ProductPrismaMapper.toDomain(found);
    }

    async findAll(params?: { page?: number; limit?: number }): Promise<ProductEntity[]> {
        const args = buildFindManyArgs(params);
        const rows = await this.prisma.product.findMany(args);
        return rows.map(ProductPrismaMapper.toDomain).filter((p): p is ProductEntity => p !== null);
    }

    async findLowStock(threshold: number): Promise<ProductEntity[]> {
        const rows = await this.prisma.product.findMany({ where: { stock: { lt: threshold } }, orderBy: { stock: 'asc' } });
        return rows.map(ProductPrismaMapper.toDomain).filter((p): p is ProductEntity => p !== null);
    }

    async searchByName(name: string): Promise<ProductEntity[]> {
        const rows = await this.prisma.product.findMany({ where: { title: { contains: name, mode: 'insensitive' } }, take: 50 });
        return rows.map(ProductPrismaMapper.toDomain).filter((p): p is ProductEntity => p !== null);
    }


}

export default ProductPrismaWriteRepository;
