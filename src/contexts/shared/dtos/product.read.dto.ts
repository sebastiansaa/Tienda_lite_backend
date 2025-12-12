export interface ProductReadDto {
    id: number;
    title: string;
    price: number;
    stock: number;
    image?: string; // only the first image
    slug?: string;
}

export default ProductReadDto;
