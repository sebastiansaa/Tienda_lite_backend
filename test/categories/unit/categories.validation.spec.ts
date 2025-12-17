import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCategoryDto } from 'src/contexts/categories/api/dtos/request/create-category.dto';

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