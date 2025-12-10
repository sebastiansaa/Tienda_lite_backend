import { AddItemRequestDto } from '../dtos/add-item.dto';
import { AddItemCommand } from '../../app/commands/add-item.command';

export const dtoToAddItemCommand = (dto: AddItemRequestDto) => new AddItemCommand(dto.userId, dto.item as any);
