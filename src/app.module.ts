import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './contexts/products/api/products.module';
import { UsersModule } from './contexts/users/users.module';
import { CategoriesModule } from './contexts/categories/api/categories.module';
import { OrdersModule } from './contexts/orders/orders.module';
import { CartModule } from './contexts/cart/cart.module';
import { AuthModule } from './contexts/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: false,      // usa .env en desarrollo
    }),
    // basic in-memory cache & rate limit (throttling)
    CacheModule.register({
      ttl: 60, // seconds
      max: 100,
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    // Prisma provider (created in src/prisma)
    // note: PrismaModule provides a ready-to-use PrismaService
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }