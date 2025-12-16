import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ADMIN_USER_READ, ADMIN_PRODUCT_READ, ADMIN_ORDER_READ, ADMIN_PAYMENT_READ, ADMIN_INVENTORY_READ } from './constants';
import { AdminController } from './api/controller/admin.controller';
import { AdminUserPrismaAdapter } from './infra/adapters/admin-user.prisma.adapter';
import { AdminProductPrismaAdapter } from './infra/adapters/admin-product.prisma.adapter';
import { AdminOrderPrismaAdapter } from './infra/adapters/admin-order.prisma.adapter';
import { AdminPaymentPrismaAdapter } from './infra/adapters/admin-payment.prisma.adapter';
import { AdminInventoryPrismaAdapter } from './infra/adapters/admin-inventory.prisma.adapter';
import UserAdminReadOnlyPort from './app/ports/user-admin.readonly.port';
import ProductAdminReadOnlyPort from './app/ports/product-admin.readonly.port';
import OrderAdminReadOnlyPort from './app/ports/order-admin.readonly.port';
import PaymentAdminReadOnlyPort from './app/ports/payment-admin.readonly.port';
import InventoryAdminReadOnlyPort from './app/ports/inventory-admin.readonly.port';
import {
    ListAdminUsersUsecase,
    GetAdminUserDetailsUsecase,
    ChangeAdminUserStatusUsecase,
    ListAdminProductsUsecase,
    GetAdminProductDetailsUsecase,
    UpdateAdminProductUsecase,
    ListAdminOrdersUsecase,
    GetAdminOrderDetailsUsecase,
    CancelAdminOrderUsecase,
    ShipAdminOrderUsecase,
    CompleteAdminOrderUsecase,
    ListAdminPaymentsUsecase,
    GetAdminPaymentDetailsUsecase,
    ListAdminInventoryUsecase,
    GetAdminInventoryDetailsUsecase,
    AdjustAdminStockUsecase,
} from './app/usecases';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [AdminController],
    providers: [
        { provide: ADMIN_USER_READ, useClass: AdminUserPrismaAdapter },
        { provide: ADMIN_PRODUCT_READ, useClass: AdminProductPrismaAdapter },
        { provide: ADMIN_ORDER_READ, useClass: AdminOrderPrismaAdapter },
        { provide: ADMIN_PAYMENT_READ, useClass: AdminPaymentPrismaAdapter },
        { provide: ADMIN_INVENTORY_READ, useClass: AdminInventoryPrismaAdapter },
        { provide: ListAdminUsersUsecase, useFactory: (port: UserAdminReadOnlyPort) => new ListAdminUsersUsecase(port), inject: [ADMIN_USER_READ] },
        { provide: GetAdminUserDetailsUsecase, useFactory: (port: UserAdminReadOnlyPort) => new GetAdminUserDetailsUsecase(port), inject: [ADMIN_USER_READ] },
        { provide: ChangeAdminUserStatusUsecase, useFactory: (port: UserAdminReadOnlyPort) => new ChangeAdminUserStatusUsecase(port), inject: [ADMIN_USER_READ] },
        { provide: ListAdminProductsUsecase, useFactory: (port: ProductAdminReadOnlyPort) => new ListAdminProductsUsecase(port), inject: [ADMIN_PRODUCT_READ] },
        { provide: GetAdminProductDetailsUsecase, useFactory: (port: ProductAdminReadOnlyPort) => new GetAdminProductDetailsUsecase(port), inject: [ADMIN_PRODUCT_READ] },
        { provide: UpdateAdminProductUsecase, useFactory: (port: ProductAdminReadOnlyPort) => new UpdateAdminProductUsecase(port), inject: [ADMIN_PRODUCT_READ] },
        { provide: ListAdminOrdersUsecase, useFactory: (port: OrderAdminReadOnlyPort) => new ListAdminOrdersUsecase(port), inject: [ADMIN_ORDER_READ] },
        { provide: GetAdminOrderDetailsUsecase, useFactory: (port: OrderAdminReadOnlyPort) => new GetAdminOrderDetailsUsecase(port), inject: [ADMIN_ORDER_READ] },
        { provide: CancelAdminOrderUsecase, useFactory: (port: OrderAdminReadOnlyPort) => new CancelAdminOrderUsecase(port), inject: [ADMIN_ORDER_READ] },
        { provide: ShipAdminOrderUsecase, useFactory: (port: OrderAdminReadOnlyPort) => new ShipAdminOrderUsecase(port), inject: [ADMIN_ORDER_READ] },
        { provide: CompleteAdminOrderUsecase, useFactory: (port: OrderAdminReadOnlyPort) => new CompleteAdminOrderUsecase(port), inject: [ADMIN_ORDER_READ] },
        { provide: ListAdminPaymentsUsecase, useFactory: (port: PaymentAdminReadOnlyPort) => new ListAdminPaymentsUsecase(port), inject: [ADMIN_PAYMENT_READ] },
        { provide: GetAdminPaymentDetailsUsecase, useFactory: (port: PaymentAdminReadOnlyPort) => new GetAdminPaymentDetailsUsecase(port), inject: [ADMIN_PAYMENT_READ] },
        { provide: ListAdminInventoryUsecase, useFactory: (port: InventoryAdminReadOnlyPort) => new ListAdminInventoryUsecase(port), inject: [ADMIN_INVENTORY_READ] },
        { provide: GetAdminInventoryDetailsUsecase, useFactory: (port: InventoryAdminReadOnlyPort) => new GetAdminInventoryDetailsUsecase(port), inject: [ADMIN_INVENTORY_READ] },
        { provide: AdjustAdminStockUsecase, useFactory: (port: InventoryAdminReadOnlyPort) => new AdjustAdminStockUsecase(port), inject: [ADMIN_INVENTORY_READ] },
    ],
})
export class AdminModule { }
