import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateStockDto {
    @ApiProperty({ example: 10, description: 'Quantity to update, increase or decrease' })
    @IsInt()
    @Min(1)
    quantity: number;
}
