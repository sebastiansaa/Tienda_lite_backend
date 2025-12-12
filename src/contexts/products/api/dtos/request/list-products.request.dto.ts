import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProductsRequestDto {
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
