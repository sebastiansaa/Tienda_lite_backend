import { Injectable } from "@nestjs/common";
import { ICategoryRepository } from "../../application/ports/category.repository";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CategoryEntity } from "../../domain/entity/category.entity";
import { CategoryMapper } from "../mappers/category.mapper";

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
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

    async findById(id: number): Promise<CategoryEntity | null> {
        const found = await this.prisma.category.findUnique({
            where: { id }
        });
        return found ? CategoryMapper.toDomain(found) : null;
    }

    async findBySlug(slug: string): Promise<CategoryEntity | null> {
        const found = await this.prisma.category.findUnique({
            where: { slug }
        });
        return found ? CategoryMapper.toDomain(found) : null;
    }

    async findAll(): Promise<CategoryEntity[]> {
        const found = await this.prisma.category.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: 'asc' }
        });
        return found.map(CategoryMapper.toDomain);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.category.update({
            where: { id },
            data: { deletedAt: new Date(), active: false, updatedAt: new Date() }
        });
    }
}
