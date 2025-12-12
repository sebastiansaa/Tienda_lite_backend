import { IsInt, Min } from 'class-validator';

export class UpdateStockRequestDto {
    @IsInt()
    @Min(0)
    readonly quantity: number;
}
