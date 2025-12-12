import { ProductReadDto } from '../dtos/product.read.dto';

export interface ProductReadOnlyPort {
    // DTO-returning read methods used by other contexts
    findDtoById?(id: number): Promise<ProductReadDto | null>;
    findAllDto?(params?: { page?: number; limit?: number }): Promise<{ products: ProductReadDto[]; total: number }>;
    searchByNameDto?(name: string, params?: { page?: number; limit?: number }): Promise<{ products: ProductReadDto[]; total: number }>;
}

export default ProductReadOnlyPort;
