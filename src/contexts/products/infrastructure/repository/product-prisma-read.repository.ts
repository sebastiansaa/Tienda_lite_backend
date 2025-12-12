import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProductReadOnlyPort } from 'src/contexts/shared/ports/product.readonly.repository';
import { ProductReadDto } from 'src/contexts/shared/dtos/product.read.dto';
import ProductPrismaMapper from '../mappers/ProductPrismaMapper';
import { buildFindManyArgs } from '../filter/product.filter';

@Injectable()
// Este repo está implementando el contrato ligero para consumo cross-context (ProductReadOnlyPort).
// Eso evita duplicar lógica de acceso a BD mientras mantiene separados los contratos (puertos).
export class ProductPrismaReadRepository implements ProductReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

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
