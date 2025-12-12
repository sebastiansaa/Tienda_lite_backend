import { AuthUserDto } from './auth-user.dto';
import { AuthTokensDto } from './auth-tokens.dto';

export class AuthResponseDto {
    readonly user: AuthUserDto;
    readonly tokens: AuthTokensDto;
}
