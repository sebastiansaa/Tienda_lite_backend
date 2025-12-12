import { ProductResponseDto } from './product.response.dto';

export class ProductListResponseDto {
    readonly products: ProductResponseDto[];
    readonly total: number;
}
