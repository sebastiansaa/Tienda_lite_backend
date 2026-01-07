import { GetProductReviewsQuery } from '../queries';
import { IReviewReadRepository, ProductsPort } from '../ports';
import { ReviewPagination } from '../ports/review-read.repository';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export class GetProductReviewsUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly productsPort: ProductsPort,
    ) { }

    async execute(query: GetProductReviewsQuery): Promise<ReviewPagination> {
        await this.productsPort.ensureProductExists(query.productId);
        const page = Math.max(query.filters.page ?? DEFAULT_PAGE, 1);
        const limit = Math.min(Math.max(query.filters.limit ?? DEFAULT_LIMIT, 1), 100);
        const offset = (page - 1) * limit;
        return this.readRepo.findByProduct(query.productId, { offset, limit });
    }
}

export default GetProductReviewsUseCase;
