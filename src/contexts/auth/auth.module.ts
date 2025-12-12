import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthController } from './api/controller/auth.controller';
import { RegisterUserUsecase, LoginUserUsecase, RefreshTokenUsecase, RevokeRefreshTokenUsecase, GetAuthenticatedUserUsecase } from './application/usecases';
import { UserRepositoryPort } from './application/ports/user.repository';
import { RefreshTokenRepositoryPort } from './application/ports/refresh-token.repository';
import { TokenServicePort } from './application/ports/token.service.port';
import { PasswordHasherPort } from './application/ports/password-hasher.port';
import { AUTH_PASSWORD_HASHER, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE, AUTH_USER_REPOSITORY } from './constants';
import { AuthUserPrismaRepository } from './infra/repository/user-prisma.repository';
import { RefreshTokenPrismaRepository } from './infra/repository/refresh-token-prisma.repository';
import { JwtTokenService } from './infra/services/jwt-token.service';
import { BcryptPasswordService } from './infra/services/bcrypt-password.service';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { RefreshJwtStrategy } from './infra/strategies/refresh-jwt.strategy';
import { JwtAuthGuard } from './infra/guards/jwt-auth.guard';
import { RolesGuard } from './infra/guards/roles.guard';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('AUTH_JWT_SECRET') ?? 'changeme',
                signOptions: { algorithm: 'HS256' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        PrismaService,
        { provide: AUTH_USER_REPOSITORY, useClass: AuthUserPrismaRepository },
        { provide: AUTH_REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenPrismaRepository },
        { provide: AUTH_TOKEN_SERVICE, useClass: JwtTokenService },
        { provide: AUTH_PASSWORD_HASHER, useClass: BcryptPasswordService },
        JwtStrategy,
        RefreshJwtStrategy,
        JwtAuthGuard,
        RolesGuard,
        {
            provide: RegisterUserUsecase,
            useFactory: (
                userRepo: UserRepositoryPort,
                refreshRepo: RefreshTokenRepositoryPort,
                tokenService: TokenServicePort,
                passwordHasher: PasswordHasherPort,
            ) => new RegisterUserUsecase(userRepo, refreshRepo, tokenService, passwordHasher),
            inject: [AUTH_USER_REPOSITORY, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE, AUTH_PASSWORD_HASHER],
        },
        {
            provide: LoginUserUsecase,
            useFactory: (
                userRepo: UserRepositoryPort,
                refreshRepo: RefreshTokenRepositoryPort,
                tokenService: TokenServicePort,
                passwordHasher: PasswordHasherPort,
            ) => new LoginUserUsecase(userRepo, refreshRepo, tokenService, passwordHasher),
            inject: [AUTH_USER_REPOSITORY, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE, AUTH_PASSWORD_HASHER],
        },
        {
            provide: RefreshTokenUsecase,
            useFactory: (
                userRepo: UserRepositoryPort,
                refreshRepo: RefreshTokenRepositoryPort,
                tokenService: TokenServicePort,
            ) => new RefreshTokenUsecase(userRepo, refreshRepo, tokenService),
            inject: [AUTH_USER_REPOSITORY, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE],
        },
        {
            provide: RevokeRefreshTokenUsecase,
            useFactory: (refreshRepo: RefreshTokenRepositoryPort) => new RevokeRefreshTokenUsecase(refreshRepo),
            inject: [AUTH_REFRESH_TOKEN_REPOSITORY],
        },
        {
            provide: GetAuthenticatedUserUsecase,
            useFactory: (userRepo: UserRepositoryPort) => new GetAuthenticatedUserUsecase(userRepo),
            inject: [AUTH_USER_REPOSITORY],
        },
    ],
    exports: [JwtAuthGuard, RolesGuard, AUTH_USER_REPOSITORY, AUTH_TOKEN_SERVICE],
})
export class AuthModule { }
