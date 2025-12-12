import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    sortOrder: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty({ nullable: true })
    deletedAt: string | null;
}