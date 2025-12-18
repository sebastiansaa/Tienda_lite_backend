import { ApiProperty } from '@nestjs/swagger';

export class AdminInventoryResponseDto {
    @ApiProperty({ example: 10 })
    productId!: number;

    @ApiProperty({ example: 120 })
    onHand!: number;

    @ApiProperty({ example: 5 })
    reserved!: number;

    @ApiProperty({ example: 115 })
    available!: number;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z' })
    updatedAt!: Date;
}

export default AdminInventoryResponseDto;
