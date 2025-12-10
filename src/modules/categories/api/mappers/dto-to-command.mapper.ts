import { CreateCategoryDto } from '../dtos/create-category.dto';
import { CreateCategoryCommand } from '../../app/commands/create-category.command';

export const dtoToCreateCategoryCommand = (dto: CreateCategoryDto) => new CreateCategoryCommand(dto.name);
