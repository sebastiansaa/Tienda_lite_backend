import { AdminUserProfile } from '../../application/ports/user-admin.port';
import { AdminProductSummary } from '../../application/ports/product-admin.port';
import { AdminOrderSummary } from '../../application/ports/order-admin.port';
import { AdminPaymentSummary } from '../../application/ports/payment-admin.port';
import { AdminInventorySummary } from '../../application/ports/inventory-admin.port';
import {
    AdminUserResponseDto,
    AdminProductResponseDto,
    AdminOrderResponseDto,
    AdminPaymentResponseDto,
    AdminInventoryResponseDto,
} from '../dtos/response';

export class AdminApiMapper {
    static toUserResponse(user: AdminUserProfile): AdminUserResponseDto {
        return { ...user };
    }

    static toUserResponseList(users: AdminUserProfile[]): AdminUserResponseDto[] {
        return users.map((u) => this.toUserResponse(u));
    }

    static toProductResponse(product: AdminProductSummary): AdminProductResponseDto {
        return { ...product };
    }

    static toProductResponseList(products: AdminProductSummary[]): AdminProductResponseDto[] {
        return products.map((p) => this.toProductResponse(p));
    }

    static toOrderResponse(order: AdminOrderSummary): AdminOrderResponseDto {
        return { ...order };
    }

    static toOrderResponseList(orders: AdminOrderSummary[]): AdminOrderResponseDto[] {
        return orders.map((o) => this.toOrderResponse(o));
    }

    static toPaymentResponse(payment: AdminPaymentSummary): AdminPaymentResponseDto {
        return { ...payment };
    }

    static toPaymentResponseList(payments: AdminPaymentSummary[]): AdminPaymentResponseDto[] {
        return payments.map((p) => this.toPaymentResponse(p));
    }

    static toInventoryResponse(item: AdminInventorySummary): AdminInventoryResponseDto {
        return { ...item };
    }

    static toInventoryResponseList(items: AdminInventorySummary[]): AdminInventoryResponseDto[] {
        return items.map((i) => this.toInventoryResponse(i));
    }
}

export default AdminApiMapper;
