import { ApiProperty } from '@nestjs/swagger';

export class AdminOrderResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    userId!: string;

    @ApiProperty()
    status!: string;

    @ApiProperty({ type: Number })
    totalAmount!: number;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export default AdminOrderResponseDto;
