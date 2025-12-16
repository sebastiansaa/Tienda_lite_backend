import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class AdjustStockDto {
    @ApiProperty({ example: 5 })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    quantity: number;

    @ApiProperty({ example: 'MANUAL_ADJUSTMENT' })
    @IsString()
    @MinLength(1)
    reason: string;
}
