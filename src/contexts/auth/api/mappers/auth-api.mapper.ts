import { RegisterAuthDto, LoginAuthDto, RefreshTokenDto } from '../dtos/request';
import { AuthResponseDto, AuthTokensDto, AuthUserDto } from '../dtos/response';
import { RegisterUserCommand, LoginUserCommand, RefreshTokenCommand } from '../../application/commands';
import { GetAuthenticatedUserQuery } from '../../application/queries';
import { UserEntity } from '../../domain/entity/user.entity';
import { TokenPair } from '../../application/ports/token.service.port';

export class AuthApiMapper {
    static toRegisterCommand(dto: RegisterAuthDto): RegisterUserCommand {
        return new RegisterUserCommand(dto.email, dto.password);
    }

    static toLoginCommand(dto: LoginAuthDto): LoginUserCommand {
        return new LoginUserCommand(dto.email, dto.password);
    }

    static toRefreshCommand(dto: RefreshTokenDto): RefreshTokenCommand {
        return new RefreshTokenCommand(dto.refreshToken);
    }

    static toGetAuthenticatedUserQuery(userId: string): GetAuthenticatedUserQuery {
        return new GetAuthenticatedUserQuery(userId);
    }

    static toResponse(user: UserEntity, tokens: TokenPair): AuthResponseDto {
        return {
            user: this.toUserDto(user),
            tokens: this.toTokensDto(tokens),
        };
    }

    static toUserDto(user: UserEntity): AuthUserDto {
        return {
            id: user.id,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }

    static toTokensDto(tokens: TokenPair): AuthTokensDto {
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenType: 'Bearer',
        };
    }
}
