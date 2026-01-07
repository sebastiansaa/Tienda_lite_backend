import { ReviewEntity } from '../../domain/entity/review.entity';

export interface ReviewPagination {
    reviews: ReviewEntity[];
    total: number;
}

export interface IReviewReadRepository {
    findById(id: string): Promise<ReviewEntity | null>;
    findByProduct(productId: number, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination>;
    findByUser(userId: string, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination>;
    existsByUserAndProduct(userId: string, productId: number): Promise<boolean>;
}

export default IReviewReadRepository;
