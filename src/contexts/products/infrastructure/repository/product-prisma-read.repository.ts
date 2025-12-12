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

    async findAllDto(params?: { page?: number; limit?: number }): Promise<ProductReadDto[]> {
        const args = buildFindManyArgs(params);
        const rows = await this.prisma.product.findMany(args);
        return rows.map(r => ProductPrismaMapper.toReadDto(r)).filter((d): d is ProductReadDto => d !== null);
    }

    async searchByNameDto(name: string): Promise<ProductReadDto[]> {
        const rows = await this.prisma.product.findMany({ where: { title: { contains: name, mode: 'insensitive' } }, take: 50 });
        return rows.map(r => ProductPrismaMapper.toReadDto(r)).filter((d): d is ProductReadDto => d !== null);
    }
}

export default ProductPrismaReadRepository;
