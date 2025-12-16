import { PaymentEntity } from '../../domain/entity/payment.entity';
import { InvalidPaymentStateError } from '../../domain/errors/payment.errors';
import { IPaymentWriteRepository } from '../ports/payment-write.repository';
import PaymentProviderPort from '../ports/payment-provider.port';
import OrderReadOnlyPort from '../ports/order-read.port';
import InitiatePaymentCommand from '../commands/initiate-payment.command';

export class InitiatePaymentUsecase {
    constructor(
        private readonly paymentWriteRepo: IPaymentWriteRepository,
        private readonly provider: PaymentProviderPort,
        private readonly orderRead: OrderReadOnlyPort,
    ) { }

    async execute(cmd: InitiatePaymentCommand): Promise<PaymentEntity> {
        const order = await this.orderRead.findById(cmd.orderId);
        if (!order) throw new Error('Order not found');
        if (order.userId !== cmd.userId) throw new Error('Order does not belong to user');
        if (order.totalAmount !== cmd.amount) throw new Error('Payment amount mismatch');

        const payment = new PaymentEntity({
            orderId: cmd.orderId,
            userId: cmd.userId,
            amount: cmd.amount,
            status: 'PENDING',
            provider: 'FAKE',
        });

        const providerResult = await this.provider.initiatePayment({
            paymentId: payment.id,
            orderId: payment.orderId,
            amount: payment.amount,
        });

        payment.setExternalInfo(providerResult.externalPaymentId, providerResult.clientSecret);
        this.applyProviderStatus(payment, providerResult.status);

        return this.paymentWriteRepo.save(payment);
    }

    private applyProviderStatus(payment: PaymentEntity, status: string): void {
        if (status === 'PENDING') return;
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
        throw new InvalidPaymentStateError('Unknown provider status');
    }
}

export default InitiatePaymentUsecase;
