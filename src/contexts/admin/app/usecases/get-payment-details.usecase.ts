import PaymentAdminReadOnlyPort, { AdminPaymentSummary } from '../ports/payment-admin.readonly.port';

export class GetAdminPaymentDetailsUsecase {
    constructor(private readonly paymentPort: PaymentAdminReadOnlyPort) { }

    execute(paymentId: string) {
        return this.paymentPort.getPaymentById(paymentId);
    }
}

export default GetAdminPaymentDetailsUsecase;
