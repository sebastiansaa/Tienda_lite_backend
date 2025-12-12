export type OrderItemDto = { productId: string; quantity: number };

export class CreateOrderDto {
    userId!: string;
    items!: OrderItemDto[];
    total!: number;
}
