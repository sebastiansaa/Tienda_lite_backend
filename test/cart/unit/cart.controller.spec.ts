import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from 'src/contexts/cart/api/controller/cart.controller';
import {
    AddItemToCartUseCase,
    UpdateItemQuantityUseCase,
    RemoveItemUseCase,
    GetCartUseCase,
    ClearCartUseCase,
} from 'src/contexts/cart/app/usecases';

describe('CartController', () => {
    let controller: CartController;
    const mocks = {
        addItem: { execute: jest.fn() },
        updateItem: { execute: jest.fn() },
        removeItem: { execute: jest.fn() },
        getCart: { execute: jest.fn() },
        clearCart: { execute: jest.fn() },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CartController],
            providers: [
                { provide: AddItemToCartUseCase, useValue: mocks.addItem },
                { provide: UpdateItemQuantityUseCase, useValue: mocks.updateItem },
                { provide: RemoveItemUseCase, useValue: mocks.removeItem },
                { provide: GetCartUseCase, useValue: mocks.getCart },
                { provide: ClearCartUseCase, useValue: mocks.clearCart },
            ],
        }).compile();

        controller = module.get<CartController>(CartController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});