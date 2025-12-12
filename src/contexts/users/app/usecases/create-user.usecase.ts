import { CreateUserCommand } from '../commands/create-user.command';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { UserEntity } from '../../domain/entity/user.entity';
import { sanitizeEmail } from '../../domain/helpers/sanitize.helper';

export class CreateUserUsecase {
    constructor(private readonly repo: UserRepositoryPort) { }

    async execute(command: CreateUserCommand): Promise<UserEntity> {
        const email = sanitizeEmail(command.email);
        const entity = new UserEntity(Date.now().toString(), email, command.name);
        return this.repo.create(entity);
    }
}
