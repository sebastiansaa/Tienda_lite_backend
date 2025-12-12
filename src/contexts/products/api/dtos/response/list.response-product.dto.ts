import { ResponseProductDto } from './response-product.dto';

export class ListResponseProductDto {
    readonly products: ResponseProductDto[];
    readonly total: number;
}
