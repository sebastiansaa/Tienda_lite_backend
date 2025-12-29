import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { StockInsufficientError, NegativeStockError, InvalidStockError } from '../../products/domain/errors/stock.errors';
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
    ProductHasStockError,
} from '../../products/domain/errors/product.errors';
import { UserNotFoundError } from '../../auth/domain/errors/auth.errors';
import { InvalidTitleError, InvalidImageUrlError, InvalidSlugError as SharedInvalidSlugError } from '../errors/shared.errors';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.BAD_REQUEST;
        const message = exception.message ?? 'Bad Request';

        if (exception instanceof StockInsufficientError) {
            status = HttpStatus.CONFLICT;
            // StockInsufficientError suele venir de StockVO (operación de decremento)
            // Para la regla de entidad de borrar producto con stock, mapeamos abajo ProductHasStockError a CONFLICT
        } else if (exception instanceof NegativeStockError || exception instanceof InvalidStockError) {
            status = HttpStatus.BAD_REQUEST;
        } else if (exception instanceof ImageNotFoundError) {
            status = HttpStatus.NOT_FOUND;
        } else if (exception instanceof DesactiveProductError || exception instanceof ActiveProductError) {
            status = HttpStatus.CONFLICT;
        } else if (exception instanceof InvalidCategoryError) {
            status = HttpStatus.NOT_FOUND;
        } else if (
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
        } else if (exception instanceof ProductHasStockError) {
            status = HttpStatus.CONFLICT;
        } else if (exception instanceof InvalidTitleError || exception instanceof InvalidImageUrlError || exception instanceof SharedInvalidSlugError) {
            status = HttpStatus.BAD_REQUEST;
        } else if (exception instanceof UserNotFoundError) {
            status = HttpStatus.NOT_FOUND;
        }

        response.status(status).json({
            statusCode: status,
            error: exception.name,
            message,
        });
    }
}

export default DomainExceptionFilter;
