import { ValidationPipe } from '@nestjs/common';
import { CreateCategoryDto } from '../../api/dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../../api/dtos/request/update-category.dto';

describe('Categories DTO validation', () => {
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

    it('rechaza create con datos inválidos', async () => {
        await expect(
            pipe.transform({ title: '', slug: '', sortOrder: -1 }, { type: 'body', metatype: CreateCategoryDto }),
        ).rejects.toThrow();
    });

    it('acepta create válido y transforma números', async () => {
        const dto = { title: 'Cat', slug: 'cat', image: 'http://img', description: 'desc', sortOrder: '2' };
        const result = await pipe.transform(dto, { type: 'body', metatype: CreateCategoryDto });
        expect(result.title).toBe('Cat');
        expect(result.sortOrder).toBe(2);
    });

    it('valida update opcional', async () => {
        await expect(
            pipe.transform({ slug: '' }, { type: 'body', metatype: UpdateCategoryDto }),
        ).rejects.toThrow();

        const ok = await pipe.transform({ title: 'Nueva', sortOrder: '3' }, { type: 'body', metatype: UpdateCategoryDto });
        expect(ok.title).toBe('Nueva');
        expect(ok.sortOrder).toBe(3);
    });
});
