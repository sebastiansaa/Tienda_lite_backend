import { LoginUserCommand } from '../commands';
import { UserRepositoryPort } from '../ports/user.repository';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token.repository';
import { TokenServicePort } from '../ports/token.service.port';
import { PasswordHasherPort } from '../ports/password-hasher.port';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';
import { AuthResult } from './types';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';

export class LoginUserUsecase {
    constructor(
        private readonly userRepo: UserRepositoryPort,
        private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
        private readonly tokenService: TokenServicePort,
        private readonly passwordHasher: PasswordHasherPort,
    ) { }

    async execute(command: LoginUserCommand): Promise<AuthResult> {
        const user = await this.userRepo.findByEmail(command.email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const valid = await this.passwordHasher.compare(command.password, user.passwordHash);
        if (!valid) {
            throw new InvalidCredentialsError();
        }

        const tokens = await this.generateTokens(user);
        await this.persistRefreshToken(user.id, tokens.refreshToken);
        return { user, tokens };
    }

    private async generateTokens(user: { id: string; roles: string[] }) {
        const payload = { sub: user.id, roles: user.roles };
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
