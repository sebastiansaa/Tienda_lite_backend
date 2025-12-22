export interface OrderWritePort {
    createCheckoutOrder(input: {
        userId: string;
        totalAmount: number;
        items?: any[];
    }): Promise<{ id: string; userId: string; totalAmount: number }>;
}

export default OrderWritePort;
