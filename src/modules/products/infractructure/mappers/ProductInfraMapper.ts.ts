// infrastructure/product/mappers/product.prisma.mapper.ts
import { ProductEntity } from "../../domain/entity";
import { Prisma } from "@prisma/client";

export class ProductPrismaMapper {
  static toDomain(row: Prisma.Product): ProductEntity {
    return new ProductEntity({
      id: row.id,
      title: row.title,
      slug: row.slug,
      price: row.price, // Prisma Decimal o number → VO Price dentro del constructor
      description: row.description,
      stock: row.stock,
      active: row.active,
      images: row.images,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toCreateInput(entity: ProductEntity): Prisma.ProductUncheckedCreateInput {
    return {
      title: entity.title,
      slug: entity.slug,
      price: entity.price,          // VO → number (o Decimal si usas prisma.Decimal)
      description: entity.description,
      stock: entity.stock.value,
      active: entity.active,
      images: entity.images,
      categoryId: entity.categoryId,
      // createdAt lo maneja DB con default(now())
      // updatedAt lo maneja DB con @updatedAt
    };
  }

  static toUpdateInput(entity: ProductEntity): Prisma.ProductUncheckedUpdateInput {
    return {
      title: entity.title,
      slug: entity.slug,
      price: entity.price,
      description: entity.description,
      stock: entity.stock.value,
      active: entity.active,
      images: entity.images,
      categoryId: entity.categoryId,
      // updatedAt automático por @updatedAt
    };
  }
}