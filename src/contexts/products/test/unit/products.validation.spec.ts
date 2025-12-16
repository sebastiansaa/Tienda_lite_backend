import { ValidationPipe } from '@nestjs/common';
import { SaveProductRequestDto, UpdateStockRequestDto, SearchProductsRequestDto, ListProductsRequestDto } from '../../api/dtos/request';

describe('Products DTO validation', () => {
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

    it('rechaza save con datos inválidos', async () => {
        await expect(
            pipe.transform({ price: -1, images: [] }, { type: 'body', metatype: SaveProductRequestDto }),
        ).rejects.toThrow();
    });

    it('acepta save válido', async () => {
        const dto = {
            title: 'Prod',
            slug: 'prod',
            price: 10,
            images: ['a'],
            categoryId: 1,
        };
        const result = await pipe.transform(dto, { type: 'body', metatype: SaveProductRequestDto });
        expect(result.title).toBe('Prod');
    });

    it('valida update-stock', async () => {
        await expect(pipe.transform({ quantity: -1 }, { type: 'body', metatype: UpdateStockRequestDto })).rejects.toThrow();
        const ok = await pipe.transform({ quantity: 5 }, { type: 'body', metatype: UpdateStockRequestDto });
        expect(ok.quantity).toBe(5);
    });

    it('valida search query', async () => {
        await expect(pipe.transform({ query: '' }, { type: 'query', metatype: SearchProductsRequestDto })).rejects.toThrow();
        const ok = await pipe.transform({ query: 'abc', page: '1', limit: '2' }, { type: 'query', metatype: SearchProductsRequestDto });
        expect(ok.page).toBe(1);
        expect(ok.limit).toBe(2);
    });

    it('valida list query', async () => {
        const ok = await pipe.transform({ page: '2', limit: '3' }, { type: 'query', metatype: ListProductsRequestDto });
        expect(ok.page).toBe(2);
        expect(ok.limit).toBe(3);
    });
});
