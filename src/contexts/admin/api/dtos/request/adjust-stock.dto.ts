import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AdjustStockDto {
    @ApiProperty({ description: 'Cantidad a ajustar (puede ser negativa)' })
    @IsInt()
    quantity!: number;

    @ApiProperty({ description: 'Motivo del ajuste' })
    @IsString()
    reason!: string;
}

export default AdjustStockDto;
