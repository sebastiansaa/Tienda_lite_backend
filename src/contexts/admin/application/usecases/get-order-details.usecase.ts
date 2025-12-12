import OrderAdminReadOnlyPort from '../ports/order-admin.port';

export class GetAdminOrderDetailsUsecase {
    constructor(private readonly orderPort: OrderAdminReadOnlyPort) { }

    execute(orderId: string) {
        return this.orderPort.getOrderById(orderId);
    }
}

export default GetAdminOrderDetailsUsecase;
