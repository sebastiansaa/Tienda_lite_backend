import { ApiProperty } from '@nestjs/swagger';

export class StockResponseDto {
    @ApiProperty({ example: 1 })
    productId: number;

    @ApiProperty({ example: 100 })
    onHand: number;

    @ApiProperty({ example: 10 })
    reserved: number;

    @ApiProperty({ example: 90 })
    available: number;
}
