import { PaymentEntity } from '../../domain/entity/payment.entity';
import { InvalidPaymentStateError } from '../../domain/errors/payment.errors';
import PaymentRepositoryPort from '../ports/payment.repository.port';
import PaymentProviderPort from '../ports/payment-provider.port';
import ConfirmPaymentCommand from '../commands/confirm-payment.command';

export class ConfirmPaymentUsecase {
    constructor(
        private readonly paymentRepo: PaymentRepositoryPort,
        private readonly provider: PaymentProviderPort,
    ) { }

    async execute(cmd: ConfirmPaymentCommand): Promise<PaymentEntity> {
        const payment = await this.paymentRepo.findById(cmd.paymentId);
        if (!payment) throw new Error('Payment not found');
        if (payment.userId !== cmd.userId) throw new Error('Payment does not belong to user');
        if (!payment.externalPaymentId) throw new Error('Payment has no external reference');

        const providerResult = await this.provider.confirmPayment({ externalPaymentId: payment.externalPaymentId });
        this.applyProviderStatus(payment, providerResult.status);
        payment.setExternalInfo(providerResult.externalPaymentId, providerResult.clientSecret);

        return this.paymentRepo.save(payment);
    }

    private applyProviderStatus(payment: PaymentEntity, status: string): void {
        if (status === 'AUTHORIZED') {
            payment.markAuthorized();
            return;
        }
        if (status === 'PAID') {
            payment.markPaid();
            return;
        }
        if (status === 'FAILED') {
            payment.markFailed();
            return;
        }
        if (status === 'PENDING') return; // no-op
        throw new InvalidPaymentStateError('Unknown provider status');
    }
}

export default ConfirmPaymentUsecase;
