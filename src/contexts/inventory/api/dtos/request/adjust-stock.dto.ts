import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class AdjustStockDto {
    @ApiProperty({ example: 5 })
    @IsInt()
    @IsPositive()
    quantity: number;

    @ApiProperty({ example: 'MANUAL_ADJUSTMENT' })
    @IsString()
    reason: string;
}
