import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from 'src/contexts/cart/api/controller/cart.controller';
import { CartService } from 'src/contexts/cart/app/cart.service';

describe('CartController', () => {
    let controller: CartController;
    const mockCartService = {
        addItem: jest.fn(),
        removeItem: jest.fn(),
        getItems: jest.fn(),
        clearCart: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CartController],
            providers: [{ provide: CartService, useValue: mockCartService }],
        }).compile();

        controller = module.get<CartController>(CartController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});