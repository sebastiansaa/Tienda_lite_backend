import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { RegisterAuthDto, LoginAuthDto, RefreshTokenDto } from '../dtos/request';
import { AuthResponseDto, AuthUserDto } from '../dtos/response';
import { AuthApiMapper } from '../mappers/auth-api.mapper';
import { RegisterUserUseCase, LoginUserUseCase, RefreshTokenUseCase, RevokeRefreshTokenUseCase, GetAuthenticatedUserUseCase } from '../../app/usecases';
import { RevokeRefreshTokenInput } from '../../app/inputs';
import { JwtAuthGuard } from '../../infra/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly revokeRefreshTokenUseCase: RevokeRefreshTokenUseCase,
        private readonly getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email and password' })
    @ApiResponse({ status: 201, description: 'User registered', type: AuthResponseDto })
    async register(@Body() dto: RegisterAuthDto): Promise<AuthResponseDto> {
        const input = AuthApiMapper.toRegisterInput(dto);
        const result = await this.registerUserUseCase.execute(input);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
    async login(@Body() dto: LoginAuthDto): Promise<AuthResponseDto> {
        const input = AuthApiMapper.toLoginInput(dto);
        const result = await this.loginUserUseCase.execute(input);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Rotate refresh token and issue a new token pair' })
    @ApiResponse({ status: 200, description: 'New tokens issued', type: AuthResponseDto })
    async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
        const input = AuthApiMapper.toRefreshInput(dto);
        const result = await this.refreshTokenUseCase.execute(input);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Revoke refresh tokens for the authenticated user' })
    @ApiResponse({ status: 204, description: 'Tokens revoked' })
    async logout(@Req() req: Request & { user?: { sub: string } }): Promise<void> {
        const user = req.user as { sub: string };
        const input = new RevokeRefreshTokenInput(user.sub);
        await this.revokeRefreshTokenUseCase.execute(input);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get the authenticated user profile' })
    @ApiResponse({ status: 200, description: 'User profile', type: AuthUserDto })
    async me(@Req() req: Request & { user?: { sub: string } }): Promise<AuthUserDto> {
        const user = req.user as { sub: string };
        const input = AuthApiMapper.toGetAuthenticatedUserInput(user.sub);
        const entity = await this.getAuthenticatedUserUseCase.execute(input);
        return AuthApiMapper.toUserDto(entity);
    }
}
