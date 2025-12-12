export class AuthTokensDto {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly tokenType: 'Bearer';
}
