import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOrderCommand } from '../../app/commands/create-order.command';

export const dtoToCreateOrderCommand = (dto: CreateOrderDto) => new CreateOrderCommand(dto.userId, dto.items as any, dto.total);
