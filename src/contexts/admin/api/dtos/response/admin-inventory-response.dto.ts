import { ApiProperty } from '@nestjs/swagger';

export class AdminInventoryResponseDto {
    @ApiProperty()
    productId!: number;

    @ApiProperty()
    onHand!: number;

    @ApiProperty()
    reserved!: number;

    @ApiProperty()
    available!: number;

    @ApiProperty()
    updatedAt!: Date;
}

export default AdminInventoryResponseDto;
