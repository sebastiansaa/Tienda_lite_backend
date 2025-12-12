import OrderAdminReadOnlyPort from '../ports/order-admin.port';

export class ListAdminOrdersUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute() {
        return this.orderPort.listOrders();
    }
}

export default ListAdminOrdersUsecase;
