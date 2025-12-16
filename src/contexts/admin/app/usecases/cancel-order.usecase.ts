import OrderAdminReadOnlyPort, { AdminOrderSummary } from '../ports/order-admin.readonly.port';

export class CancelAdminOrderUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute(orderId: string) {
        return this.orderPort.cancel(orderId);
    }
}

export default CancelAdminOrderUsecase;
