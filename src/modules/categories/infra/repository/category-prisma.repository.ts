import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICategoryRepository } from '../../domain/interfaces/category.repository';
import { CategoryEntity } from '../../domain/entity/category.entity';
import { prismaToCategoryEntity } from '../mappers/prisma-to-entity.mapper';

@Injectable()
export class CategoryPrismaRepository implements ICategoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(category: CategoryEntity): Promise<CategoryEntity> {
        const created = await this.prisma.category.create({ data: { id: category.id, name: category.name } });
        return prismaToCategoryEntity(created);
    }

    async findById(id: string): Promise<CategoryEntity | null> {
        const found = await this.prisma.category.findUnique({ where: { id } });
        return prismaToCategoryEntity(found);
    }

    async findAll(): Promise<CategoryEntity[]> {
        const rows = await this.prisma.category.findMany();
        return rows.map(prismaToCategoryEntity);
    }
}
