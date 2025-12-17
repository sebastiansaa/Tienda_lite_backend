import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InitiatePaymentDto } from 'src/contexts/payment/api/dtos';

describe('InitiatePaymentDto validation', () => {
    it('accepts a valid payload', async () => {
        const dto = plainToInstance(InitiatePaymentDto, { orderId: 'order-123', amount: 120.5 });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
    });

    it('rejects non-positive amount', async () => {
        const dto = plainToInstance(InitiatePaymentDto, { orderId: 'order-123', amount: 0 });
        const errors = await validate(dto);
        const constraints = errors.find((e) => e.property === 'amount')?.constraints ?? {};
        expect(Object.keys(constraints)).toEqual(expect.arrayContaining(['isPositive']));
    });

    it('forbids extra properties via ValidationPipe', async () => {
        const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });
        const payload = { orderId: 'order-123', amount: 100, unexpected: 'field' };
        const transformCall = pipe.transform(payload, { type: 'body', metatype: InitiatePaymentDto } as any);
        await expect(transformCall).rejects.toBeInstanceOf(BadRequestException);
    });
});