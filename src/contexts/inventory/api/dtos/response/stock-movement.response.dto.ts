import { ApiProperty } from '@nestjs/swagger';

export class StockMovementResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 1 })
    productId: number;

    @ApiProperty({ enum: ['INCREASE', 'DECREASE', 'RESERVATION', 'RELEASE'] })
    type: string;

    @ApiProperty({ example: 'ORDER' })
    reason: string;

    @ApiProperty({ example: 3 })
    quantity: number;

    @ApiProperty({ example: 100 })
    onHandAfter: number;

    @ApiProperty({ example: 5 })
    reservedAfter: number;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;
}
