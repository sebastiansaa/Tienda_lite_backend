import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IReviewReadRepository, ReviewPagination } from '../../app/ports/review-read.repository';
import ReviewEntity from '../../domain/entity/review.entity';
import { ReviewPrismaMapper } from '../mappers/review-prisma.mapper';

@Injectable()
export class ReviewPrismaReadRepository implements IReviewReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<ReviewEntity | null> {
        const row = await this.prisma.review.findUnique({ where: { id } });
        return row ? ReviewPrismaMapper.toDomain(row) : null;
    }

    async findByProduct(productId: number, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination> {
        const skip = filters?.offset ?? 0;
        const take = filters?.limit ?? 20;
        const [rows, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { productId },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.review.count({ where: { productId } }),
        ]);
        return { reviews: rows.map((row) => ReviewPrismaMapper.toDomain(row)), total };
    }

    async findByUser(userId: string, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination> {
        const skip = filters?.offset ?? 0;
        const take = filters?.limit ?? 20;
        const [rows, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.review.count({ where: { userId } }),
        ]);
        return { reviews: rows.map((row) => ReviewPrismaMapper.toDomain(row)), total };
    }

    async existsByUserAndProduct(userId: string, productId: number): Promise<boolean> {
        const review = await this.prisma.review.findFirst({
            where: { userId, productId },
            select: { id: true },
        });
        return Boolean(review);
    }
}

export default ReviewPrismaReadRepository;
