import { GetUserReviewsQuery } from '../queries';
import { IReviewReadRepository, AuthPort, UserPort } from '../ports';
import { ReviewPagination } from '../ports/review-read.repository';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export class GetUserReviewsUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly authPort: AuthPort,
        private readonly userPort: UserPort,
    ) { }

    async execute(query: GetUserReviewsQuery): Promise<ReviewPagination> {
        await this.authPort.ensureAuthenticated(query.userId);
        await this.userPort.ensureUserExists(query.userId);
        const page = Math.max(query.filters.page ?? DEFAULT_PAGE, 1);
        const limit = Math.min(Math.max(query.filters.limit ?? DEFAULT_LIMIT, 1), 100);
        const offset = (page - 1) * limit;
        return this.readRepo.findByUser(query.userId, { offset, limit });
    }
}

export default GetUserReviewsUseCase;
