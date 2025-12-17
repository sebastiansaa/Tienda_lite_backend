import { ValidationPipe } from '@nestjs/common';
import { AddItemDto } from 'src/contexts/cart/api/dtos/request';

describe('Cart DTO validation', () => {
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

    it('rechaza productId y quantity inválidos', async () => {
        await expect(pipe.transform({ productId: -1, quantity: 0 }, { type: 'body', metatype: AddItemDto })).rejects.toThrow();
    });

    it('rechaza campos extra', async () => {
        await expect(
            pipe.transform({ productId: 1, quantity: 1, extra: 'no' }, { type: 'body', metatype: AddItemDto }),
        ).rejects.toThrow();
    });

    it('acepta payload válido', async () => {
        const result = await pipe.transform({ productId: 2, quantity: 3 }, { type: 'body', metatype: AddItemDto });
        expect(result.productId).toBe(2);
        expect(result.quantity).toBe(3);
    });
});
