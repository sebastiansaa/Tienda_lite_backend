import PaymentRepositoryPort from '../ports/payment.repository.port';
import GetPaymentByIdQuery from '../queries/get-payment-by-id.query';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class GetPaymentByIdUsecase {
    constructor(private readonly paymentRepo: PaymentRepositoryPort) { }

    async execute(query: GetPaymentByIdQuery): Promise<PaymentEntity | null> {
        const payment = await this.paymentRepo.findById(query.paymentId);
        if (!payment) return null;
        if (payment.userId !== query.userId) return null;
        return payment;
    }
}

export default GetPaymentByIdUsecase;
