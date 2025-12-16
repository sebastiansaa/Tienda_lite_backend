import OrderAdminReadOnlyPort, { AdminOrderSummary } from '../ports/order-admin.readonly.port';

export class ShipAdminOrderUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute(orderId: string) {
        return this.orderPort.markShipped(orderId);
    }
}

export default ShipAdminOrderUsecase;
