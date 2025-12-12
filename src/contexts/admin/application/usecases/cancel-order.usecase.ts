import OrderAdminReadOnlyPort from '../ports/order-admin.port';

export class CancelAdminOrderUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute(orderId: string) {
        return this.orderPort.cancel(orderId);
    }
}

export default CancelAdminOrderUsecase;
