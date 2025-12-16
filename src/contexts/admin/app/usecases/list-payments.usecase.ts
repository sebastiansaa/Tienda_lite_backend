import PaymentAdminReadOnlyPort, { AdminPaymentSummary } from '../ports/payment-admin.readonly.port';

export class ListAdminPaymentsUsecase {
    constructor(private readonly paymentPort: PaymentAdminReadOnlyPort) { }

    execute() {
        return this.paymentPort.listPayments();
    }
}

export default ListAdminPaymentsUsecase;
