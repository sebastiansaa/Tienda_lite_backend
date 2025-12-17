import { ValidationPipe } from '@nestjs/common';
import { UpdateItemDto } from 'src/contexts/cart/api/dtos/request';

describe('UpdateItemDto validation', () => {
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

    it('rechaza cantidad inválida o faltante', async () => {
        await expect(pipe.transform({}, { type: 'body', metatype: UpdateItemDto })).rejects.toThrow();
        await expect(pipe.transform({ quantity: 0 }, { type: 'body', metatype: UpdateItemDto })).rejects.toThrow();
    });

    it('rechaza campos extra', async () => {
        await expect(pipe.transform({ quantity: 1, extra: 'no' }, { type: 'body', metatype: UpdateItemDto })).rejects.toThrow();
    });

    it('acepta payload válido', async () => {
        const result = await pipe.transform({ quantity: 5 }, { type: 'body', metatype: UpdateItemDto });
        expect(result.quantity).toBe(5);
    });
});