import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCategoryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
}
