import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { AddressDto, UpdateUserProfileDto, UserResponseDto, ChangeStatusDto } from '../dtos';
import UserApiMapper from '../mappers/user-api.mapper';
import {
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    AddAddressUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
    ChangeUserStatusUseCase,
    ListUsersUseCase,
} from '../../app/usecases';
import { UserStatus } from '../../domain/v-o/user-status.vo';
import { AddressNotFoundError, InvalidAddressError, InvalidEmailError, InvalidUserStatusError, UserNotFoundError } from '../../domain/errors/user.errors';

interface AuthUser { sub: string; roles?: string[]; }

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('users')
export class UserController {
    constructor(
        private readonly getProfile: GetUserProfileUseCase,
        private readonly updateProfile: UpdateUserProfileUseCase,
        private readonly addAddress: AddAddressUseCase,
        private readonly updateAddress: UpdateAddressUseCase,
        private readonly deleteAddress: DeleteAddressUseCase,
        private readonly changeStatus: ChangeUserStatusUseCase,
        private readonly listUsers: ListUsersUseCase,
    ) { }

    @Get('me')
    @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async me(@CurrentUser() user: AuthUser): Promise<UserResponseDto> {
        try {
            const profile = await this.getProfile.execute(user.sub);
            return UserApiMapper.toUserResponse(profile);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Patch('me')
    @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserProfileDto): Promise<UserResponseDto> {
        try {
            const command = UserApiMapper.toUpdateProfileCommand(user.sub, dto);
            const updated = await this.updateProfile.execute(command);
            return UserApiMapper.toUserResponse(updated);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post('me/addresses')
    @ApiOperation({ summary: 'Agregar dirección al usuario autenticado' })
    @ApiResponse({ status: 201, type: UserResponseDto })
    async addAddr(@CurrentUser() user: AuthUser, @Body() dto: AddressDto): Promise<UserResponseDto> {
        try {
            const command = UserApiMapper.toAddAddressCommand(user.sub, dto);
            await this.addAddress.execute(command);
            const refreshed = await this.getProfile.execute(user.sub);
            return UserApiMapper.toUserResponse(refreshed);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Patch('me/addresses/:id')
    @ApiOperation({ summary: 'Actualizar dirección del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async updateAddr(
        @CurrentUser() user: AuthUser,
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: AddressDto,
    ): Promise<UserResponseDto> {
        try {
            const command = UserApiMapper.toUpdateAddressCommand(user.sub, id, dto);
            await this.updateAddress.execute(command);
            const refreshed = await this.getProfile.execute(user.sub);
            return UserApiMapper.toUserResponse(refreshed);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Delete('me/addresses/:id')
    @ApiOperation({ summary: 'Eliminar dirección del usuario autenticado' })
    @ApiResponse({ status: 204 })
    async deleteAddr(
        @CurrentUser() user: AuthUser,
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<void> {
        try {
            const command = UserApiMapper.toDeleteAddressCommand(user.sub, id);
            await this.deleteAddress.execute(command);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Obtener perfil de usuario (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async getById(@Param('id') id: string): Promise<UserResponseDto> {
        try {
            const profile = await this.getProfile.execute(id);
            return UserApiMapper.toUserResponse(profile);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Listar usuarios (admin)' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async list(): Promise<UserResponseDto[]> {
        const users = await this.listUsers.execute();
        return UserApiMapper.toUserResponseList(users);
    }

    @Patch(':id/status')
    @Roles('admin')
    @ApiOperation({ summary: 'Cambiar estado de usuario (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async changeUserStatus(
        @Param('id') id: string,
        @Body() dto: ChangeStatusDto,
    ): Promise<UserResponseDto> {
        try {
            const command = UserApiMapper.toChangeStatusCommand(id, dto.status as UserStatus);
            const updated = await this.changeStatus.execute(command);
            return UserApiMapper.toUserResponse(updated);
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): never {
        if (error instanceof UserNotFoundError || error instanceof AddressNotFoundError) {
            throw new NotFoundException(error.message);
        }
        if (error instanceof InvalidAddressError || error instanceof InvalidEmailError || error instanceof InvalidUserStatusError) {
            throw new BadRequestException(error.message);
        }
        if (error instanceof Error) throw error;
        throw new Error('Unknown error');
    }
}
