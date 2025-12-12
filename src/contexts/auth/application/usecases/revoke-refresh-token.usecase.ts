import { RevokeRefreshTokenCommand } from '../commands';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token.repository';

export class RevokeRefreshTokenUsecase {
    constructor(private readonly refreshTokenRepo: RefreshTokenRepositoryPort) { }

    async execute(command: RevokeRefreshTokenCommand): Promise<void> {
        await this.refreshTokenRepo.revokeByUserId(command.userId);
    }
}
