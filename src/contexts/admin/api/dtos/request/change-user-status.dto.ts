import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeUserStatusDto {
    @ApiProperty({ example: 'SUSPENDED' })
    @IsString()
    status!: string;
}

export default ChangeUserStatusDto;
