import PaymentRepositoryPort from '../ports/payment.repository.port';
import ListPaymentsForUserQuery from '../queries/list-payments-for-user.query';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class ListPaymentsForUserUsecase {
    constructor(private readonly paymentRepo: PaymentRepositoryPort) { }

    async execute(query: ListPaymentsForUserQuery): Promise<PaymentEntity[]> {
        return this.paymentRepo.listByUser(query.userId);
    }
}

export default ListPaymentsForUserUsecase;
