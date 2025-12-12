import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { AddItemDto, UpdateItemDto, CartResponseDto } from '../dtos';
import CartApiMapper from '../mappers/cart-api.mapper';
import {
    AddItemToCartUsecase,
    UpdateItemQuantityUsecase,
    RemoveItemUsecase,
    GetCartUsecase,
    ClearCartUsecase,
} from '../../application/usecases';
import { CartEntity } from '../../domain/entity/cart.entity';
import { CartItemNotFoundError, CartNotFoundError, DuplicateCartItemError, InvalidProductError, InvalidQuantityError } from '../../domain/errors/cart.errors';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(
        private readonly addItem: AddItemToCartUsecase,
        private readonly updateItemQuantity: UpdateItemQuantityUsecase,
        private readonly removeItem: RemoveItemUsecase,
        private readonly getCartUsecase: GetCartUsecase,
        private readonly clearCartUsecase: ClearCartUsecase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Obtener el carrito del usuario autenticado' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    async getCart(@Req() req: Request & { user?: { sub?: string } }): Promise<CartResponseDto> {
        const userId = this.getUserId(req);
        const query = CartApiMapper.toGetQuery(userId);
        const cart = await this.getCartUsecase.execute(query);
        const entity = cart ?? new CartEntity({ userId, items: [] });
        return CartApiMapper.toResponse(entity);
    }

    @Post('items')
    @ApiOperation({ summary: 'Agregar un producto al carrito' })
    @ApiResponse({ status: 201, type: CartResponseDto })
    async addItemToCart(
        @Req() req: Request & { user?: { sub?: string } },
        @Body() dto: AddItemDto,
    ): Promise<CartResponseDto> {
        try {
            const userId = this.getUserId(req);
            const command = CartApiMapper.toAddCommand(userId, dto);
            const cart = await this.addItem.execute(command);
            return CartApiMapper.toResponse(cart);
        } catch (error) {
            this.mapError(error);
        }
    }

    @Put('items/:productId')
    @ApiOperation({ summary: 'Actualizar la cantidad de un producto en el carrito' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    async updateItem(
        @Req() req: Request & { user?: { sub?: string } },
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: UpdateItemDto,
    ): Promise<CartResponseDto> {
        try {
            const userId = this.getUserId(req);
            const command = CartApiMapper.toUpdateCommand(userId, productId, dto);
            const cart = await this.updateItemQuantity.execute(command);
            return CartApiMapper.toResponse(cart);
        } catch (error) {
            this.mapError(error);
        }
    }

    @Delete('items/:productId')
    @ApiOperation({ summary: 'Eliminar un producto del carrito' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    async removeItemFromCart(
        @Req() req: Request & { user?: { sub?: string } },
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<CartResponseDto> {
        try {
            const userId = this.getUserId(req);
            const command = CartApiMapper.toRemoveCommand(userId, productId);
            const cart = await this.removeItem.execute(command);
            return CartApiMapper.toResponse(cart);
        } catch (error) {
            this.mapError(error);
        }
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Vaciar el carrito del usuario' })
    @ApiResponse({ status: 204 })
    async clear(@Req() req: Request & { user?: { sub?: string } }): Promise<void> {
        try {
            const userId = this.getUserId(req);
            const command = CartApiMapper.toClearCommand(userId);
            await this.clearCartUsecase.execute(command);
        } catch (error) {
            this.mapError(error);
        }
    }

    private getUserId(req: Request & { user?: { sub?: string } }): string {
        const user = req.user as { sub?: string } | undefined;
        if (!user?.sub) throw new BadRequestException('No se pudo obtener el usuario autenticado');
        return user.sub;
    }

    private mapError(error: unknown): never {
        if (error instanceof CartNotFoundError || error instanceof CartItemNotFoundError) {
            throw new NotFoundException(error.message);
        }
        if (error instanceof DuplicateCartItemError) {
            throw new ConflictException(error.message);
        }
        if (error instanceof InvalidQuantityError || error instanceof InvalidProductError) {
            throw new BadRequestException(error.message);
        }
        throw error as Error;
    }
}
