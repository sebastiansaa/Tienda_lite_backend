import { ApiProperty } from '@nestjs/swagger';

export class AdminProductResponseDto {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    title!: string;

    @ApiProperty({ type: Number })
    price!: number;

    @ApiProperty()
    stock!: number;

    @ApiProperty()
    active!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export default AdminProductResponseDto;
