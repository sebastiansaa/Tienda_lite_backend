import { CreateUserCommand } from '../../app/commands/create-user.command';
import { CreateUserDto } from '../dtos/create-user.dto';

export const dtoToCreateUserCommand = (dto: CreateUserDto) =>
    new CreateUserCommand(dto.email, dto.name, dto.password);
