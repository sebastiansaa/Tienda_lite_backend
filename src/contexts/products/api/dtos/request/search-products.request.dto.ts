import { IsString, MinLength } from 'class-validator';

export class SearchProductsRequestDto {
    @IsString()
    @MinLength(1)
    readonly query: string;
}
