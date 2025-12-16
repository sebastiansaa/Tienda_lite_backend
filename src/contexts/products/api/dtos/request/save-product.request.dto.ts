import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsInt, Min } from 'class-validator';

export class SaveProductRequestDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly id?: number;

    @IsString()
    readonly title: string;

    @IsString()
    readonly slug: string;

    @IsNumber()
    @Min(0)
    readonly price: number;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    readonly stock?: number;

    @IsOptional()
    @IsBoolean()
    readonly active?: boolean;

    @IsArray()
    @IsString({ each: true })
    readonly images: string[];

    @IsInt()
    @Min(1)
    readonly categoryId: number;
}
