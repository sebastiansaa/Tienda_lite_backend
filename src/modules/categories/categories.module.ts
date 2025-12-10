import { Module } from '@nestjs/common';
import { CategoriesController } from './api/controller/categories.controller';
import { CreateCategoryUsecase } from './app/usecases/create-category.usecase';
import { CategoryPrismaRepository } from './infra/repository/category-prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [CategoriesController],
    providers: [CreateCategoryUsecase, CategoryPrismaRepository, PrismaService],
    exports: [CreateCategoryUsecase],
})
export class CategoriesModule { }
