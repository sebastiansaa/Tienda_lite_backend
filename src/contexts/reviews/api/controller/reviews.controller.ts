import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import type { AuthUserPayload } from '../../../shared/interfaces/auth-user-payload.interface';
import { CreateReviewRequestDto } from '../dtos/request/create-review.request.dto';
import { ListProductReviewsRequestDto } from '../dtos/request/list-product-reviews.request.dto';
import { ListUserReviewsRequestDto } from '../dtos/request/list-user-reviews.request.dto';
import { ReviewPrivateResponseDto } from '../dtos/response/review-private.response.dto';
import { ReviewPrivateListResponseDto } from '../dtos/response/review-private-list.response.dto';
import { ReviewPublicListResponseDto } from '../dtos/response/review-public-list.response.dto';
import { ReviewApiMapper } from '../mappers/review-api.mapper';
import { CreateReviewUseCase, DeleteReviewUseCase, GetProductReviewsUseCase, GetUserReviewsUseCase } from '../../app/usecases';
import { DeleteReviewCommand } from '../../app/commands';

@ApiTags('reviews')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly createReview: CreateReviewUseCase,
        private readonly deleteReview: DeleteReviewUseCase,
        private readonly productReviews: GetProductReviewsUseCase,
        private readonly userReviews: GetUserReviewsUseCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('Review created successfully')
    @ApiOperation({ summary: 'Crear review para un producto (requiere compra previa)' })
    @ApiResponse({ status: 201, type: ReviewPrivateResponseDto })
    async create(
        @CurrentUser() user: AuthUserPayload,
        @Body() dto: CreateReviewRequestDto,
    ): Promise<ReviewPrivateResponseDto> {
        const command = ReviewApiMapper.toCreateReviewCommand(dto, user.sub);
        const review = await this.createReview.execute(command);
        return ReviewApiMapper.toPrivateDto(review);
    }

    @Get('product/:productId')
    @ResponseMessage('Product reviews retrieved successfully')
    @ApiOperation({ summary: 'Listar reviews públicas de un producto' })
    @ApiResponse({ status: 200, type: ReviewPublicListResponseDto })
    async listByProduct(
        @Param('productId', ParseIntPipe) productId: number,
        @Query() dto: ListProductReviewsRequestDto,
    ): Promise<ReviewPublicListResponseDto> {
        const query = ReviewApiMapper.toProductReviewsQuery(productId, dto);
        const result = await this.productReviews.execute(query);
        return ReviewApiMapper.toPublicList(result);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('User reviews retrieved successfully')
    @ApiOperation({ summary: 'Listar reviews creadas por el usuario autenticado' })
    @ApiResponse({ status: 200, type: ReviewPrivateListResponseDto })
    async listMine(
        @CurrentUser() user: AuthUserPayload,
        @Query() dto: ListUserReviewsRequestDto,
    ): Promise<ReviewPrivateListResponseDto> {
        const query = ReviewApiMapper.toUserReviewsQuery(user.sub, dto);
        const result = await this.userReviews.execute(query);
        return ReviewApiMapper.toPrivateList(result);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('Review deleted successfully')
    @ApiOperation({ summary: 'Eliminar review propia' })
    @ApiResponse({ status: 204 })
    async delete(
        @CurrentUser() user: AuthUserPayload,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        const command = new DeleteReviewCommand(id, user.sub);
        await this.deleteReview.execute(command);
    }
}
