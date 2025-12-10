export type OrderItem = { productId: string; quantity: number };

export class OrderEntity {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly items: OrderItem[],
        public readonly total: number,
    ) { }
}
