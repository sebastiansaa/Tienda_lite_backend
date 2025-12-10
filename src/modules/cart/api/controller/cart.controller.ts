import { Body, Controller, Post } from '@nestjs/common';
import { AddItemRequestDto } from '../dtos/add-item.dto';
import { dtoToAddItemCommand } from '../mappers/dto-to-command.mapper';
import { AddItemUsecase } from '../../app/usecases/add-item.usecase';

@Controller('cart')
export class CartController {
    constructor(private readonly usecase: AddItemUsecase) { }

    @Post('add')
    async addItem(@Body() dto: AddItemRequestDto) {
        const cmd = dtoToAddItemCommand(dto);
        return this.usecase.execute(cmd);
    }
}
