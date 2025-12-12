import OrderAdminReadOnlyPort from '../ports/order-admin.port';

export class CompleteAdminOrderUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute(orderId: string) {
        return this.orderPort.markCompleted(orderId);
    }
}

export default CompleteAdminOrderUsecase;
