import OrderAdminReadOnlyPort, { AdminOrderSummary } from '../ports/order-admin.readonly.port';

export class ListAdminOrdersUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute() {
        return this.orderPort.listOrders();
    }
}

export default ListAdminOrdersUsecase;
