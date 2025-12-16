import { AdminUserProfile } from '../../app/ports/user-admin.readonly.port';
import { AdminProductSummary } from '../../app/ports/product-admin.readonly.port';
import { AdminOrderSummary } from '../../app/ports/order-admin.readonly.port';
import { AdminPaymentSummary } from '../../app/ports/payment-admin.readonly.port';
import { AdminInventorySummary } from '../../app/ports/inventory-admin.readonly.port';
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
