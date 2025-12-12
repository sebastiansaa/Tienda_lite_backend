import PaymentAdminReadOnlyPort from '../ports/payment-admin.port';

export class GetAdminPaymentDetailsUsecase {
    constructor(private readonly paymentPort: PaymentAdminReadOnlyPort) { }

    execute(paymentId: string) {
        return this.paymentPort.getPaymentById(paymentId);
    }
}

export default GetAdminPaymentDetailsUsecase;
