import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class InitiatePaymentDto {
    @ApiProperty({ example: 'order-uuid-123' })
    @IsString()
    orderId: string;

    @ApiProperty({ example: 120.5 })
    @IsNumber()
    @IsPositive()
    amount: number;
}
