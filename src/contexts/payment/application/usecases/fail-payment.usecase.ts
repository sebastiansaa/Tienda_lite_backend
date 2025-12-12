import { PaymentEntity } from '../../domain/entity/payment.entity';
import PaymentRepositoryPort from '../ports/payment.repository.port';
import PaymentProviderPort from '../ports/payment-provider.port';
import FailPaymentCommand from '../commands/fail-payment.command';

export class FailPaymentUsecase {
    constructor(
        private readonly paymentRepo: PaymentRepositoryPort,
        private readonly provider: PaymentProviderPort,
    ) { }

    async execute(cmd: FailPaymentCommand): Promise<PaymentEntity> {
        const payment = await this.paymentRepo.findById(cmd.paymentId);
        if (!payment) throw new Error('Payment not found');
        if (payment.userId !== cmd.userId) throw new Error('Payment does not belong to user');
        if (!payment.externalPaymentId) throw new Error('Payment has no external reference');

        const providerResult = await this.provider.failPayment({ externalPaymentId: payment.externalPaymentId });
        payment.setExternalInfo(providerResult.externalPaymentId, providerResult.clientSecret);
        payment.markFailed();

        return this.paymentRepo.save(payment);
    }
}

export default FailPaymentUsecase;
