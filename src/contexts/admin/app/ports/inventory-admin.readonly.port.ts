export interface AdminInventorySummary {
    productId: number;
    onHand: number;
    reserved: number;
    available: number;
    updatedAt: Date;
}

export interface InventoryAdminReadOnlyPort {
    listInventory(): Promise<AdminInventorySummary[]>;
    getByProductId(productId: number): Promise<AdminInventorySummary | null>;
    adjustStock(productId: number, quantity: number, reason: string): Promise<AdminInventorySummary | null>;
}

export default InventoryAdminReadOnlyPort;
