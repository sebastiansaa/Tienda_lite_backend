import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AddItemDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    productId: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsPositive()
    quantity: number;
}
