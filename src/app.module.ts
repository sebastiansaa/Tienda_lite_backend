import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './contexts/products/products.module';
import { CategoriesModule } from './contexts/categories/categories.module';
import { OrdersModule } from './contexts/orders/order.module';
import { CartModule } from './contexts/cart/cart.module';
import { AuthModule } from './contexts/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { InventoryModule } from './contexts/inventory/inventory.module';
import { PaymentModule } from './contexts/payment/payment.module';
import { UserModule } from './contexts/user/user.module';
import { AdminModule } from './contexts/admin/admin.module';
import { HealthModule } from './health/health.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: false,
      validate: validateEnv,
    }),
    CacheModule.register({
      ttl: 60,
      max: 100,
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CartModule,
    InventoryModule,
    PaymentModule,
    UserModule,
    AdminModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }