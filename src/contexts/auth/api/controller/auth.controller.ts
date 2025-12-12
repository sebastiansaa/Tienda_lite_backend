import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { RegisterAuthDto, LoginAuthDto, RefreshTokenDto } from '../dtos/request';
import { AuthResponseDto, AuthUserDto } from '../dtos/response';
import { AuthApiMapper } from '../mappers/auth-api.mapper';
import { RegisterUserUsecase, LoginUserUsecase, RefreshTokenUsecase, RevokeRefreshTokenUsecase, GetAuthenticatedUserUsecase } from '../../application/usecases';
import { RevokeRefreshTokenCommand } from '../../application/commands';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUserUsecase: RegisterUserUsecase,
        private readonly loginUserUsecase: LoginUserUsecase,
        private readonly refreshTokenUsecase: RefreshTokenUsecase,
        private readonly revokeRefreshTokenUsecase: RevokeRefreshTokenUsecase,
        private readonly getAuthenticatedUserUsecase: GetAuthenticatedUserUsecase,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email and password' })
    @ApiResponse({ status: 201, description: 'User registered', type: AuthResponseDto })
    async register(@Body() dto: RegisterAuthDto): Promise<AuthResponseDto> {
        const command = AuthApiMapper.toRegisterCommand(dto);
        const result = await this.registerUserUsecase.execute(command);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
    async login(@Body() dto: LoginAuthDto): Promise<AuthResponseDto> {
        const command = AuthApiMapper.toLoginCommand(dto);
        const result = await this.loginUserUsecase.execute(command);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Rotate refresh token and issue a new token pair' })
    @ApiResponse({ status: 200, description: 'New tokens issued', type: AuthResponseDto })
    async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
        const command = AuthApiMapper.toRefreshCommand(dto);
        const result = await this.refreshTokenUsecase.execute(command);
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
        const command = new RevokeRefreshTokenCommand(user.sub);
        await this.revokeRefreshTokenUsecase.execute(command);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get the authenticated user profile' })
    @ApiResponse({ status: 200, description: 'User profile', type: AuthUserDto })
    async me(@Req() req: Request & { user?: { sub: string } }): Promise<AuthUserDto> {
        const user = req.user as { sub: string };
        const query = AuthApiMapper.toGetAuthenticatedUserQuery(user.sub);
        const entity = await this.getAuthenticatedUserUsecase.execute(query);
        return AuthApiMapper.toUserDto(entity);
    }
}
