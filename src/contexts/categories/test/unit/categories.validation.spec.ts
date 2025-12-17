import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCategoryDto } from 'src/contexts/categories/api/dtos/request/create-category.dto';
import { UpdateCategoryDto } from 'src/contexts/categories/api/dtos/request/update-category.dto';

const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

describe('Categories DTO Validation', () => {
    it('should validate a correct DTO', async () => {
        const dto = plainToClass(CreateCategoryDto, {
            title: 'Category Name',
            slug: 'category-slug',
            image: 'http://example.com/image.jpg',
        });

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should reject missing name', async () => {
        const dto = { slug: 'category-slug', image: 'http://example.com/image.jpg' };

        await expect(validationPipe.transform(dto, { type: 'body', metatype: CreateCategoryDto })).rejects.toBeInstanceOf(
            BadRequestException,
        );
    });

    it('should reject negative sortOrder', async () => {
        const dto = { title: 'Category', slug: 'category-slug', sortOrder: -1 };

        await expect(validationPipe.transform(dto, { type: 'body', metatype: CreateCategoryDto })).rejects.toBeInstanceOf(
            BadRequestException,
        );
    });
});
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
