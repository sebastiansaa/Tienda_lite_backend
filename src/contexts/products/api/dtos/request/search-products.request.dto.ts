import { IsString, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductsRequestDto {
    @IsString()
    @MinLength(1)
    readonly query: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly limit?: number;
}
