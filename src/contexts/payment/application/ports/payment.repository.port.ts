import { PaymentEntity } from '../../domain/entity/payment.entity';

export interface PaymentRepositoryPort {
    save(payment: PaymentEntity): Promise<PaymentEntity>;
    findById(id: string): Promise<PaymentEntity | null>;
    listByUser(userId: string): Promise<PaymentEntity[]>;
}

export default PaymentRepositoryPort;
