import { ApiProperty } from '@nestjs/swagger';

export class AdminPaymentResponseDto {
    @ApiProperty({ example: 'payment-uuid' })
    id!: string;

    @ApiProperty({ example: 'order-uuid' })
    orderId!: string;

    @ApiProperty({ example: 'user-uuid' })
    userId!: string;

    @ApiProperty({ type: Number, example: 120.5 })
    amount!: number;

    @ApiProperty({ example: 'PAID' })
    status!: string;

    @ApiProperty({ example: 'FAKE' })
    provider!: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt!: Date;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z' })
    updatedAt!: Date;
}

export default AdminPaymentResponseDto;
