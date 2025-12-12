import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    @IsUrl()
    image: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}
