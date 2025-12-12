import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

// Import domain errors
import { StockInsufficientError, NegativeStockError, InvalidStockError } from '../../contexts/products/domain/errors/stock.errors';
import {
    EmptyTitleError,
    InvalidProductTitleError,
    EmptySlugError,
    InvalidSlugError,
    NegativePriceError,
    InvalidPriceError,
    ImagesArrayNullError,
    ImagesArrayEmptyError,
    InvalidImageUrlError as ProductInvalidImageUrlError,
    ImageNotFoundError,
    DesactiveProductError,
    ActiveProductError,
    InvalidCategoryError,
} from '../../contexts/products/domain/errors/product.errors';
import { UserNotFoundError } from '../../contexts/users/domain/errors/user.errors';
import { InvalidTitleError, InvalidImageUrlError, InvalidSlugError as SharedInvalidSlugError } from '../../contexts/shared/errors/shared.errors';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.BAD_REQUEST;
        let message = exception.message ?? 'Bad Request';

        // Product / stock domain errors
        if (exception instanceof StockInsufficientError) {
            status = HttpStatus.CONFLICT;
        } else if (exception instanceof NegativeStockError || exception instanceof InvalidStockError) {
            status = HttpStatus.BAD_REQUEST;
        } else if (exception instanceof ImageNotFoundError) {
            status = HttpStatus.NOT_FOUND;
        } else if (exception instanceof DesactiveProductError || exception instanceof ActiveProductError) {
            status = HttpStatus.CONFLICT;
        } else if (exception instanceof InvalidCategoryError) {
            status = HttpStatus.NOT_FOUND;
        }

        // Product validation errors
        else if (
            exception instanceof EmptyTitleError ||
            exception instanceof InvalidProductTitleError ||
            exception instanceof EmptySlugError ||
            exception instanceof InvalidSlugError ||
            exception instanceof NegativePriceError ||
            exception instanceof InvalidPriceError ||
            exception instanceof ImagesArrayNullError ||
            exception instanceof ImagesArrayEmptyError ||
            exception instanceof ProductInvalidImageUrlError
        ) {
            status = HttpStatus.BAD_REQUEST;
        }

        // Shared validation errors
        else if (exception instanceof InvalidTitleError || exception instanceof InvalidImageUrlError || exception instanceof SharedInvalidSlugError) {
            status = HttpStatus.BAD_REQUEST;
        }

        // Users
        else if (exception instanceof UserNotFoundError) {
            status = HttpStatus.NOT_FOUND;
        }

        // For anything else that reaches here, keep 400

        const payload = {
            statusCode: status,
            error: exception.name,
            message,
        };

        response.status(status).json(payload);
    }
}
