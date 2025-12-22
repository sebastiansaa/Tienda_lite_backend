import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class InitiatePaymentDto {
    @ApiPropertyOptional({ example: 'order-uuid-123', description: 'Si no se envía, se genera una orden PENDING automáticamente' })
    @IsOptional()
    @IsString()
    orderId?: string;

    @ApiProperty({ example: 120.5 })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiPropertyOptional({ example: 'eur' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({ example: 'pm_tok_123', description: 'Token de método de pago (card token)' })
    @IsOptional()
    @IsString()
    paymentMethodToken?: string;

    @ApiPropertyOptional({ description: 'Snapshot de items usados para crear la orden si no existe', type: () => [Object] })
    @IsOptional()
    @IsArray()
    items?: any[];
}
