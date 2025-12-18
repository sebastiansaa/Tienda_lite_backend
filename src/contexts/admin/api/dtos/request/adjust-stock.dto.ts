import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AdminAdjustStockDto {
    @ApiProperty({ description: 'Cantidad a ajustar (puede ser negativa)' })
    @IsInt()
    quantity!: number;

    @ApiProperty({ description: 'Motivo del ajuste' })
    @IsString()
    reason!: string;
}

// Mantener compatibilidad de importación nombrada
export const AdjustStockDto = AdminAdjustStockDto;

// También exportar alias de tipo para uso en parámetros y tipado
export type AdjustStockDto = AdminAdjustStockDto;

export default AdminAdjustStockDto;
