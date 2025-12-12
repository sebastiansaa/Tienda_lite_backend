import { ProductReadDto } from '../dtos/product.read.dto';

export interface ProductReadOnlyPort {
    // DTO-returning read methods used by other contexts
    findDtoById?(id: number): Promise<ProductReadDto | null>;
    findAllDto?(params?: { page?: number; limit?: number }): Promise<ProductReadDto[]>;
    searchByNameDto?(name: string): Promise<ProductReadDto[]>;
}

export default ProductReadOnlyPort;
