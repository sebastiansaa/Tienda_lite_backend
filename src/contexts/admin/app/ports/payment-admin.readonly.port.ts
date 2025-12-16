export interface AdminPaymentSummary {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    status: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaymentAdminReadOnlyPort {
    listPayments(): Promise<AdminPaymentSummary[]>;
    getPaymentById(id: string): Promise<AdminPaymentSummary | null>;
}

export default PaymentAdminReadOnlyPort;
