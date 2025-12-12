import OrderAdminReadOnlyPort from '../ports/order-admin.port';

export class ShipAdminOrderUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute(orderId: string) {
        return this.orderPort.markShipped(orderId);
    }
}

export default ShipAdminOrderUsecase;
