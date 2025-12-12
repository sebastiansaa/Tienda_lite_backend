import { ApiProperty } from '@nestjs/swagger';

export class AdminUserResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ nullable: true })
    phone!: string | null;

    @ApiProperty()
    status!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export default AdminUserResponseDto;
