import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICategoryWriteRepository } from '../../app/ports/category-write.repository';
import { CategoryEntity } from '../../domain/entity/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaCategoryWriteRepository implements ICategoryWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(category: CategoryEntity): Promise<CategoryEntity> {
        const data = CategoryMapper.toPersistence(category);

        if (category.id) {
            const updated = await this.prisma.category.update({
                where: { id: category.id },
                data: { ...data, updatedAt: new Date() },
            });
            return CategoryMapper.toDomain(updated);
        }

        const created = await this.prisma.category.create({ data });
        return CategoryMapper.toDomain(created);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.category.update({
            where: { id },
            data: { deletedAt: new Date(), active: false, updatedAt: new Date() },
        });
    }
}
