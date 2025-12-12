import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
    @ApiPropertyOptional({ description: 'Nuevo título del producto' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: 'Nuevo precio', type: Number })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiPropertyOptional({ description: 'Nuevo stock disponible' })
    @IsOptional()
    @IsInt()
    stock?: number;

    @ApiPropertyOptional({ description: 'Estado de publicación' })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export default UpdateProductDto;
