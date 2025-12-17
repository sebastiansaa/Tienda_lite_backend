import { ValidationPipe } from '@nestjs/common';
import { AdjustStockDto } from 'src/contexts/inventory/api/dtos';

describe('Inventory DTO validation', () => {
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

    it('rechaza payload inválido', async () => {
        await expect(
            pipe.transform({ quantity: 0, reason: '' }, { type: 'body', metatype: AdjustStockDto }),
        ).rejects.toThrow();
    });

    it('acepta payload válido y castea números', async () => {
        const result = await pipe.transform({ quantity: '3', reason: 'MANUAL_ADJUSTMENT' }, { type: 'body', metatype: AdjustStockDto });
        expect(result.quantity).toBe(3);
        expect(result.reason).toBe('MANUAL_ADJUSTMENT');
    });
});
// moved to test/inventory/unit/inventory.validation.spec.ts
export { }; 
