import { ApiProperty } from '@nestjs/swagger';

export class AdminPaymentResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    orderId!: string;

    @ApiProperty()
    userId!: string;

    @ApiProperty({ type: Number })
    amount!: number;

    @ApiProperty()
    status!: string;

    @ApiProperty()
    provider!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export default AdminPaymentResponseDto;
