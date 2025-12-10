import { Expose, Transform } from "class-transformer";

export class ResponseProductDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    price: number;

    @Expose()
    description: string;

    @Expose()
    slug: string;

    @Expose()
    categoryId: number;

    @Expose()
    images: string[];

    @Expose()
    stock: number;

    @Expose()
    @Transform(({ value }) => value.toISOString())
    createdAt: string;

    @Expose()
    @Transform(({ value }) => value.toISOString()) //LocalDateTime a ISO String
    updatedAt: string;

    @Expose()
    active: boolean;
}