import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { dtoToCreateOrderCommand } from '../mappers/dto-to-command.mapper';
import { CreateOrderUsecase } from '../../app/usecases/create-order.usecase';

@Controller('orders')
export class OrdersController {
    constructor(private readonly usecase: CreateOrderUsecase) { }

    @Post()
    async create(@Body() dto: CreateOrderDto) {
        const cmd = dtoToCreateOrderCommand(dto);
        return this.usecase.execute(cmd);
    }
}
