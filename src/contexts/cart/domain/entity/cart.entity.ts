export type CartItem = { productId: string; quantity: number };

export class CartEntity {
    constructor(public readonly id: string, public readonly userId: string, public readonly items: CartItem[] = []) { }

    addItem(item: CartItem) {
        const existing = this.items.find(i => i.productId === item.productId);
        if (existing) existing.quantity += item.quantity;
        else this.items.push(item);
    }
}
