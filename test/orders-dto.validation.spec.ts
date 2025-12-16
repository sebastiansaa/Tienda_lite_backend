import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrderFromItemsDto } from '../src/contexts/orders/api/dtos/request/create-order-from-items.dto';
import { OrderItemDto } from '../src/contexts/orders/api/dtos/request/order-item.dto';

describe('CreateOrderFromItemsDto validation', () => {
    const validItem: OrderItemDto = { productId: 1, quantity: 2 };

    it('accepts a valid payload', async () => {
        const dto = plainToInstance(CreateOrderFromItemsDto, { items: [validItem] });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
    });

    it('rejects empty items array', async () => {
        const dto = plainToInstance(CreateOrderFromItemsDto, { items: [] });
        const errors = await validate(dto);
        expect(errors[0]?.constraints?.arrayNotEmpty).toBeDefined();
    });

    it('forbids extra properties via ValidationPipe', async () => {
        const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });
        const payload = { items: [validItem], unexpected: 'field' };
        const transformCall = pipe.transform(payload, { type: 'body', metatype: CreateOrderFromItemsDto } as any);
        await expect(transformCall).rejects.toBeInstanceOf(BadRequestException);
    });
});

describe('OrderItemDto validation', () => {
    it('rejects non-positive numbers in items', async () => {
        const dto = plainToInstance(OrderItemDto, { productId: 0, quantity: -1 });
        const errors = await validate(dto);
        const constraints = errors[0]?.constraints ?? {};
        expect(Object.keys(constraints)).toEqual(expect.arrayContaining(['isPositive']));
    });
});
