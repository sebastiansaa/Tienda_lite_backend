export interface AdminOrderSummary {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderAdminReadOnlyPort {
    listOrders(): Promise<AdminOrderSummary[]>;
    getOrderById(id: string): Promise<AdminOrderSummary | null>;
    cancel(id: string): Promise<AdminOrderSummary | null>;
    markShipped(id: string): Promise<AdminOrderSummary | null>;
    markCompleted(id: string): Promise<AdminOrderSummary | null>;
}

export default OrderAdminReadOnlyPort;
