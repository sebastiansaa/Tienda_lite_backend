import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IProductRepository } from '../../domain/interfaces/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';
import { prismaToProductEntity } from '../mappers/ProductInfraMapper.ts';

@Injectable()
export class ProductPrismaRepository implements IProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(product: ProductEntity): Promise<ProductEntity> {
        const created = await this.prisma.product.create({ data: { id: product.id, title: product.title, price: product.price, categoryId: product.categoryId } });
        return prismaToProductEntity(created);
    }

    async findById(id: string): Promise<ProductEntity | null> {
        const found = await this.prisma.product.findUnique({ where: { id } });
        return prismaToProductEntity(found);
    }

    async findAll(): Promise<ProductEntity[]> {
        const rows = await this.prisma.product.findMany();
        return rows.map(prismaToProductEntity);
    }
}
