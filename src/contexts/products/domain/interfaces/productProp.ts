export interface ProductProps {
    id?: number;
    title: string;
    slug: string;
    price: number;        //se cambia a Decima en mapper
    description: string;
    stock: number;
    active: boolean;
    images: string[];
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}