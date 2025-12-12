import PaymentAdminReadOnlyPort from '../ports/payment-admin.port';

export class ListAdminPaymentsUsecase {
    constructor(private readonly paymentPort: PaymentAdminReadOnlyPort) { }

    execute() {
        return this.paymentPort.listPayments();
    }
}

export default ListAdminPaymentsUsecase;
