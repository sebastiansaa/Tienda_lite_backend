import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    description: string;

    @IsInt()
    @Min(0)
    stock: number;

    @IsOptional()
    active?: boolean = true;

    @IsInt()
    @Min(1)
    categoryId: number;

    @IsArray()
    @IsString({ each: true })
    @IsUrl({ require_tld: false }, { each: true })
    images: string[];
}