import { RefreshTokenCommand } from '../commands';
import { UserRepositoryPort } from '../ports/user.repository';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token.repository';
import { TokenServicePort } from '../ports/token.service.port';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';
import { AuthResult } from './types';
import { RefreshTokenExpiredError, RefreshTokenNotFoundError, UserNotFoundError } from '../../domain/errors/auth.errors';

export class RefreshTokenUsecase {
    constructor(
        private readonly userRepo: UserRepositoryPort,
        private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
        private readonly tokenService: TokenServicePort,
    ) { }

    async execute(command: RefreshTokenCommand): Promise<AuthResult> {
        const payload = await this.tokenService.verifyRefreshToken(command.refreshToken);

        const tokenHash = await this.tokenService.hashToken(command.refreshToken);
        const stored = await this.refreshTokenRepo.findByHash(tokenHash);
        if (!stored) {
            throw new RefreshTokenNotFoundError();
        }
        if (stored.isExpired()) {
            throw new RefreshTokenExpiredError();
        }

        const user = await this.userRepo.findById(payload.sub);
        if (!user) {
            throw new UserNotFoundError();
        }

        const tokens = await this.generateTokens(user.id, user.roles);
        await this.persistRefreshToken(user.id, tokens.refreshToken);
        return { user, tokens };
    }

    private async generateTokens(userId: string, roles: string[]) {
        const payload = { sub: userId, roles };
        const accessToken = await this.tokenService.signAccessToken(payload);
        const refreshToken = await this.tokenService.signRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    private async persistRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.refreshTokenRepo.revokeByUserId(userId);
        const tokenHash = await this.tokenService.hashToken(refreshToken);
        const expiresAt = this.tokenService.getRefreshExpirationDate();
        const token = new RefreshTokenEntity({ userId, tokenHash, expiresAt });
        await this.refreshTokenRepo.save(token);
    }
}
