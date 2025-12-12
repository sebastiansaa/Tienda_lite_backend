import { RegisterUserCommand } from '../commands';
import { UserRepositoryPort } from '../ports/user.repository';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token.repository';
import { TokenServicePort } from '../ports/token.service.port';
import { PasswordHasherPort } from '../ports/password-hasher.port';
import { UserEntity } from '../../domain/entity/user.entity';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';
import { AuthResult } from './types';
import { UserAlreadyExistsError } from '../../domain/errors/auth.errors';

export class RegisterUserUsecase {
    constructor(
        private readonly userRepo: UserRepositoryPort,
        private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
        private readonly tokenService: TokenServicePort,
        private readonly passwordHasher: PasswordHasherPort,
    ) { }

    async execute(command: RegisterUserCommand): Promise<AuthResult> {
        const existing = await this.userRepo.findByEmail(command.email);
        if (existing) {
            throw new UserAlreadyExistsError();
        }

        const passwordHash = await this.passwordHasher.hash(command.password);
        const user = new UserEntity({ email: command.email, passwordHash, roles: ['user'] });
        const saved = await this.userRepo.save(user);

        const tokens = await this.generateTokens(saved);
        await this.persistRefreshToken(saved.id, tokens.refreshToken);

        return { user: saved, tokens };
    }

    private async generateTokens(user: UserEntity) {
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
