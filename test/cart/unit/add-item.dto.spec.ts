import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AddItemDto } from 'src/contexts/cart/api/dtos/add-item.dto';

const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

describe('AddItemDto Validation', () => {
    it('should validate a correct DTO', async () => {
        const dto = plainToClass(AddItemDto, { productId: '123', quantity: 2 });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should reject missing productId', async () => {
        await expect(
            validationPipe.transform({ quantity: 2 }, { type: 'body', metatype: AddItemDto }),
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should reject invalid quantity', async () => {
        await expect(
            validationPipe.transform({ productId: '123', quantity: 0 }, { type: 'body', metatype: AddItemDto }),
        ).rejects.toBeInstanceOf(BadRequestException);
    });
});