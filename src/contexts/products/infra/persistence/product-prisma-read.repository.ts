import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProductReadOnlyPort } from 'src/contexts/shared/ports/product.readonly.repository';
import { ProductReadDto } from 'src/contexts/shared/dtos/product.read.dto';
import ProductPrismaMapper from '../mappers/product-prisma.mapper';
import { buildFindManyArgs } from '../filter/product.filter';
import { IProductReadRepository } from '../../app/ports/product-read.repository';
import { ProductEntity } from '../../domain/entity';

@Injectable()
// Repositorio de lectura: devuelve entidades de dominio y DTOs para otros contextos
export class ProductPrismaReadRepository implements ProductReadOnlyPort, IProductReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    // Domain reads (CQRS read side)
    async findById(id: number): Promise<ProductEntity | null> {
        const row = await this.prisma.product.findUnique({ where: { id } });
        return ProductPrismaMapper.toDomain(row);
    }

    async findAll(params?: { page?: number; limit?: number; categoryId?: number }): Promise<{ products: ProductEntity[]; total: number }> {
        const args = buildFindManyArgs(params);
        const [rows, total] = await Promise.all([
            this.prisma.product.findMany(args),
            this.prisma.product.count({ where: args.where }),
        ]);
        const products = rows.map(ProductPrismaMapper.toDomain).filter((p): p is ProductEntity => p !== null);
        return { products, total };
    }

    async findLowStock(threshold: number): Promise<ProductEntity[]> {
        const rows = await this.prisma.product.findMany({ where: { stock: { lt: threshold } }, orderBy: { stock: 'asc' } });
        return rows.map(ProductPrismaMapper.toDomain).filter((p): p is ProductEntity => p !== null);
    }

    async searchByName(term: string, params?: { page?: number; limit?: number }): Promise<{ products: ProductEntity[]; total: number }> {
        const args = buildFindManyArgs({ ...params, search: term });
        const [rows, total] = await Promise.all([
            this.prisma.product.findMany(args),
            this.prisma.product.count({ where: args.where }),
        ]);
        const products = rows.map(ProductPrismaMapper.toDomain).filter((p): p is ProductEntity => p !== null);
        return { products, total };
    }

    // DTO reads for cross-context ports
    async findDtoById(id: number): Promise<ProductReadDto | null> {
        const row = await this.prisma.product.findUnique({ where: { id } });
        return ProductPrismaMapper.toReadDto(row);
    }

    async findAllDto(params?: { page?: number; limit?: number }): Promise<{ products: ProductReadDto[]; total: number }> {
        const args = buildFindManyArgs(params);
        const [rows, total] = await Promise.all([
            this.prisma.product.findMany(args),
            this.prisma.product.count({ where: args.where }),
        ]);
        const products = rows.map(r => ProductPrismaMapper.toReadDto(r)).filter((d): d is ProductReadDto => d !== null);
        return { products, total };
    }

    async searchByNameDto(name: string, params?: { page?: number; limit?: number }): Promise<{ products: ProductReadDto[]; total: number }> {
        const args = buildFindManyArgs({ ...params, search: name });
        const [rows, total] = await Promise.all([
            this.prisma.product.findMany(args),
            this.prisma.product.count({ where: args.where }),
        ]);
        const products = rows.map(r => ProductPrismaMapper.toReadDto(r)).filter((d): d is ProductReadDto => d !== null);
        return { products, total };
    }
}

export default ProductPrismaReadRepository;
