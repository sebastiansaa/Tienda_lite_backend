import { ApiProperty } from '@nestjs/swagger';

export class AdminUserResponseDto {
    @ApiProperty({ example: 'user-uuid-1' })
    id!: string;

    @ApiProperty({ example: 'ada@example.com' })
    email!: string;

    @ApiProperty({ example: 'Ada Lovelace' })
    name!: string;

    @ApiProperty({ nullable: true, example: '+34123456789' })
    phone!: string | null;

    @ApiProperty({ example: 'ACTIVE' })
    status!: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt!: Date;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z' })
    updatedAt!: Date;
}

export default AdminUserResponseDto;
