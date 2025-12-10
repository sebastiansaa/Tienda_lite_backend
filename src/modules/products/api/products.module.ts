import { Module } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { ProductsController } from './controller/products.controller';
import { CreateProductUsecase } from '../application/usecases/create-product.usecase';
import { ProductPrismaRepository } from '../infractructure/repository/product-prisma.repository';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CreateProductUsecase, ProductPrismaRepository, PrismaService],
})
export class ProductsModule { }
