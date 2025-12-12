import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { AddressDto, UpdateUserProfileDto, UserResponseDto } from '../dtos';
import UserApiMapper from '../mappers/user-api.mapper';
import {
    GetUserProfileUsecase,
    UpdateUserProfileUsecase,
    AddAddressUsecase,
    UpdateAddressUsecase,
    DeleteAddressUsecase,
    ChangeUserStatusUsecase,
    ListUsersUsecase,
} from '../../application/usecases';
import { UserStatus } from '../../domain/v-o/user-status.vo';

interface AuthUser { sub: string; roles?: string[]; }

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly getProfile: GetUserProfileUsecase,
        private readonly updateProfile: UpdateUserProfileUsecase,
        private readonly addAddress: AddAddressUsecase,
        private readonly updateAddress: UpdateAddressUsecase,
        private readonly deleteAddress: DeleteAddressUsecase,
        private readonly changeStatus: ChangeUserStatusUsecase,
        private readonly listUsers: ListUsersUsecase,
    ) { }

    @Get('me')
    @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async me(@CurrentUser() user: AuthUser): Promise<UserResponseDto> {
        const query = UserApiMapper.toGetProfileQuery(user.sub);
        const profile = await this.getProfile.execute(query);
        if (!profile) throw new NotFoundException('User not found');
        return UserApiMapper.toUserResponse(profile);
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
            const refreshed = await this.getProfile.execute(UserApiMapper.toGetProfileQuery(user.sub));
            if (!refreshed) throw new NotFoundException('User not found');
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
            const refreshed = await this.getProfile.execute(UserApiMapper.toGetProfileQuery(user.sub));
            if (!refreshed) throw new NotFoundException('User not found');
            return UserApiMapper.toUserResponse(refreshed);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Delete('me/addresses/:id')
    @ApiOperation({ summary: 'Eliminar dirección del usuario autenticado' })
    @ApiResponse({ status: 204 })
    async deleteAddr(@CurrentUser() user: AuthUser, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
        try {
            const command = UserApiMapper.toDeleteAddressCommand(user.sub, id);
            await this.deleteAddress.execute(command);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Obtener perfil por id (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async getById(@Param('id') id: string): Promise<UserResponseDto> {
        const query = UserApiMapper.toGetProfileQuery(id);
        const profile = await this.getProfile.execute(query);
        if (!profile) throw new NotFoundException('User not found');
        return UserApiMapper.toUserResponse(profile);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Cambiar estado de usuario (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async changeStatusHandler(@Param('id') id: string, @Body('status') status: string): Promise<UserResponseDto> {
        try {
            const command = UserApiMapper.toChangeStatusCommand(id, status as UserStatus);
            const updated = await this.changeStatus.execute(command);
            return UserApiMapper.toUserResponse(updated);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Listar usuarios (admin)' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async list(): Promise<UserResponseDto[]> {
        const users = await this.listUsers.execute(UserApiMapper.toListUsersQuery());
        return UserApiMapper.toUserResponseList(users);
    }

    private handleError(error: unknown): never {
        if (error instanceof Error) {
            throw new BadRequestException(error.message);
        }
        throw error as Error;
    }
}
