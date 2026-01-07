import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminController } from './api/controller/admin.controller';
import { GetDashboardStatsUsecase } from './app/usecases/get-dashboard-stats.usecase';

// Domain Modules
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { InventoryModule } from '../inventory/inventory.module';
import { OrdersModule } from '../orders/order.module';
import { PaymentModule } from '../payment/payment.module';

// Adapters
import { UserAdminAdapter } from '../user/infra/adapters/user-admin.adapter';
import { ProductAdminAdapter } from '../products/infra/adapters/product-admin.adapter';
import { CategoryAdminAdapter } from '../categories/infra/adapters/category-admin.adapter';
import { InventoryAdminAdapter } from '../inventory/infra/adapters/inventory-admin.adapter';
import { OrdersAdminAdapter } from '../orders/infra/adapters/orders-admin.adapter';
import { PaymentAdminAdapter } from '../payment/infra/adapters/payment-admin.adapter';
import { OrderStatsAdapter } from '../orders/infra/adapters/order-stats.adapter';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        UserModule,
        ProductsModule,
        CategoriesModule,
        InventoryModule,
        OrdersModule,
        PaymentModule,
    ],
    controllers: [AdminController],
    providers: [
        GetDashboardStatsUsecase,
        {
            provide: 'UserAdminPort',
            useClass: UserAdminAdapter,
        },
        {
            provide: 'ProductAdminPort',
            useClass: ProductAdminAdapter,
        },
        {
            provide: 'CategoryAdminPort',
            useClass: CategoryAdminAdapter,
        },
        {
            provide: 'InventoryAdminPort',
            useClass: InventoryAdminAdapter,
        },
        {
            provide: 'OrdersAdminPort',
            useClass: OrdersAdminAdapter,
        },
        {
            provide: 'PaymentAdminPort',
            useClass: PaymentAdminAdapter,
        },
        {
            provide: 'OrderStatsPort',
            useClass: OrderStatsAdapter,
        },
    ],
})
export class AdminModule { }
