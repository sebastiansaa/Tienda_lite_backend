import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto, LoginAuthDto, RefreshTokenDto } from '../dtos/request';
import { AuthResponseDto, AuthUserDto } from '../dtos/response';
import { AuthApiMapper } from '../mappers/auth-api.mapper';
import { RegisterUserUseCase, LoginUserUseCase, RefreshTokenUseCase, RevokeRefreshTokenUseCase, GetAuthenticatedUserUseCase } from '../../app/usecases';
import { RevokeRefreshTokenInput } from '../../app/inputs';
import { JwtAuthGuard } from '../../infra/guards/jwt-auth.guard';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import CurrentUser from '../decorators/current-user.decorator';

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
    @ResponseMessage('User registered successfully')
    @ApiOperation({ summary: 'Registrar un nuevo usuario con email y contraseña' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente', type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Datos de registro inválidos' })
    @ApiResponse({ status: 409, description: 'El email ya está en uso' })
    async register(@Body() dto: RegisterAuthDto): Promise<AuthResponseDto> {
        const input = AuthApiMapper.toRegisterInput(dto);
        const result = await this.registerUserUseCase.execute(input);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login successful')
    @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
    @ApiResponse({ status: 200, description: 'Login exitoso', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(@Body() dto: LoginAuthDto): Promise<AuthResponseDto> {
        const input = AuthApiMapper.toLoginInput(dto);
        const result = await this.loginUserUseCase.execute(input);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Tokens rotated successfully')
    @ApiOperation({ summary: 'Rotar refresh token y emitir nuevo par de tokens' })
    @ApiResponse({ status: 200, description: 'Tokens rotados exitosamente', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
    async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
        const input = AuthApiMapper.toRefreshInput(dto);
        const result = await this.refreshTokenUseCase.execute(input);
        return AuthApiMapper.toResponse(result.user, result.tokens);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ResponseMessage('Tokens revoked successfully')
    @ApiOperation({ summary: 'Revocar tokens del usuario autenticado' })
    @ApiResponse({ status: 204, description: 'Tokens revocados correctamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async logout(@CurrentUser() user: { sub: string }): Promise<void> {
        const input = new RevokeRefreshTokenInput(user.sub);
        await this.revokeRefreshTokenUseCase.execute(input);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('Authenticated user profile retrieved successfully')
    @ApiOperation({ summary: 'Obtener el perfil básico del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil de usuario', type: AuthUserDto })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async me(@CurrentUser() user: { sub: string }): Promise<AuthUserDto> {
        const input = AuthApiMapper.toGetAuthenticatedUserInput(user.sub);
        const entity = await this.getAuthenticatedUserUseCase.execute(input);
        return AuthApiMapper.toUserDto(entity);
    }
}
