import { ApiProperty } from '@nestjs/swagger';

export class AdminProductResponseDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'Camiseta básica' })
    title!: string;

    @ApiProperty({ type: Number, example: 19.99 })
    price!: number;

    @ApiProperty({ example: 120 })
    stock!: number;

    @ApiProperty({ example: true })
    active!: boolean;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt!: Date;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z' })
    updatedAt!: Date;
}

export default AdminProductResponseDto;
