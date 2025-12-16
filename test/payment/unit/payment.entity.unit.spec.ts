import { PaymentEntity } from '../../../src/contexts/payment/domain/entity/payment.entity';
import { InvalidPaymentStateError, PaymentAlreadyProcessedError } from '../../../src/contexts/payment/domain/errors/payment.errors';

describe('PaymentEntity (unit)', () => {
    const base = { orderId: 'o1', userId: 'u1', amount: 50 };

    it('marks authorized and paid', () => {
        const payment = new PaymentEntity({ ...base });
        payment.markAuthorized();
        expect(payment.status).toBe('AUTHORIZED');

        payment.markPaid();
        expect(payment.status).toBe('PAID');
    });

    it('prevents paying twice', () => {
        const payment = new PaymentEntity({ ...base });
        payment.markPaid();
        expect(() => payment.markPaid()).toThrow(PaymentAlreadyProcessedError);
    });

    it('fails payment only if not paid', () => {
        const payment = new PaymentEntity({ ...base });
        payment.markFailed();
        expect(payment.status).toBe('FAILED');

        expect(() => payment.markFailed()).not.toThrow();

        const paid = new PaymentEntity({ ...base });
        paid.markPaid();
        expect(() => paid.markFailed()).toThrow(PaymentAlreadyProcessedError);
    });

    it('rejects invalid transition from AUTHORIZED to AUTHORIZED again', () => {
        const payment = new PaymentEntity({ ...base });
        payment.markAuthorized();
        expect(() => payment.markAuthorized()).toThrow(InvalidPaymentStateError);
    });
});
