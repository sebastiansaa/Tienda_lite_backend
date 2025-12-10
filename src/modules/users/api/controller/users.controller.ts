import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { dtoToCreateUserCommand } from '../mappers/dto-to-command.mapper';
import { CreateUserUsecase } from '../../app/usecases/create-user.usecase';
import { UserRepositoryPort } from '../../app/ports/user.repository.port';

@Controller('users')
export class UsersController {
    constructor(private readonly usecase: CreateUserUsecase) { }

    @Post()
    async create(@Body() dto: CreateUserDto) {
        const command = dtoToCreateUserCommand(dto);
        return this.usecase.execute(command);
    }
}
