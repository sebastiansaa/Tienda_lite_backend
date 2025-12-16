import OrderAdminReadOnlyPort, { AdminOrderSummary } from '../ports/order-admin.readonly.port';

export class GetAdminOrderDetailsUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute(orderId: string) {
        return this.orderPort.getOrderById(orderId);
    }
}

export default GetAdminOrderDetailsUsecase;
