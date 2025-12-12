import { Module } from '@nestjs/common';
import { CategoriesController } from './controller/categories.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaCategoryRepository } from '../infra/repository/prisma-category.repository';
import { CATEGORY_REPOSITORY } from '../application/constants';
import {
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase
} from '../application/usecases';
import { ICategoryRepository } from '../application/ports/category.repository';
import { CategorySharedAdapter } from '../infra/adapters/category-shared.adapter';

@Module({
    controllers: [CategoriesController],
    providers: [
        PrismaService,
        {
            provide: CATEGORY_REPOSITORY,
            useClass: PrismaCategoryRepository,
        },
        {
            provide: 'CategoryRepositoryPort',
            useClass: CategorySharedAdapter,
        },
        {
            provide: CreateCategoryUseCase,
            useFactory: (repo: ICategoryRepository) => new CreateCategoryUseCase(repo),
            inject: [CATEGORY_REPOSITORY],
        },
        {
            provide: UpdateCategoryUseCase,
            useFactory: (repo: ICategoryRepository) => new UpdateCategoryUseCase(repo),
            inject: [CATEGORY_REPOSITORY],
        },
        {
            provide: GetCategoryUseCase,
            useFactory: (repo: ICategoryRepository) => new GetCategoryUseCase(repo),
            inject: [CATEGORY_REPOSITORY],
        },
        {
            provide: ListCategoriesUseCase,
            useFactory: (repo: ICategoryRepository) => new ListCategoriesUseCase(repo),
            inject: [CATEGORY_REPOSITORY],
        },
        {
            provide: DeleteCategoryUseCase,
            useFactory: (repo: ICategoryRepository) => new DeleteCategoryUseCase(repo),
            inject: [CATEGORY_REPOSITORY],
        },
    ],
    exports: [CATEGORY_REPOSITORY, 'CategoryRepositoryPort']
})
export class CategoriesModule { }
