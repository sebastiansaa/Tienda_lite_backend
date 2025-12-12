import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateItemDto {
    @ApiProperty({ example: 3 })
    @IsInt()
    @IsPositive()
    quantity: number;
}
