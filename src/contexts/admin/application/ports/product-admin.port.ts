export interface AdminProductSummary {
    id: number;
    title: string;
    price: number;
    stock: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductAdminReadOnlyPort {
    listProducts(): Promise<AdminProductSummary[]>;
    getProductById(id: number): Promise<AdminProductSummary | null>;
    updateProduct(id: number, data: Partial<Omit<AdminProductSummary, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AdminProductSummary | null>;
}

export default ProductAdminReadOnlyPort;
