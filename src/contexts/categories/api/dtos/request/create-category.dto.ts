import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    slug: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
}
