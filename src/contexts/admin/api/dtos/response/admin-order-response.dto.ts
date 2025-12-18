import { ApiProperty } from '@nestjs/swagger';

export class AdminOrderResponseDto {
    @ApiProperty({ example: 'order-uuid' })
    id!: string;

    @ApiProperty({ example: 'user-uuid' })
    userId!: string;

    @ApiProperty({ example: 'PENDING' })
    status!: string;

    @ApiProperty({ type: Number, example: 89.9 })
    totalAmount!: number;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt!: Date;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z' })
    updatedAt!: Date;
}

export default AdminOrderResponseDto;
