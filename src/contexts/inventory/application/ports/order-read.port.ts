export interface OrderReadOnlyPort {
    // Optional adapter placeholder for future order validations (e.g., reservations)
    findById?(orderId: string): Promise<unknown>;
}

export default OrderReadOnlyPort;
