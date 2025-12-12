export class ResponseProductDto {
    readonly id: number;
    readonly title: string;
    readonly slug: string;
    readonly price: number;
    readonly description: string;
    readonly stock: number;
    readonly active: boolean;
    readonly images: string[];
    readonly categoryId: number;
    readonly createdAt: string; // ISO string
    readonly updatedAt: string; // ISO string
}
