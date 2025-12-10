
import { ProductEntity, StockEntity } from "../../domain/entity";
import { CreateProductDto, ResponseProductDto } from "../dtos";

export class ProductApiMapper {
  static toDomain(dto: CreateProductDto): ProductEntity {
    return new ProductEntity({
      id: 0, // se asignará en persistencia
      title: dto.title,
      slug: dto.slug,
      price: dto.price,
      description: dto.description,
      stock: dto.stock,
      active: dto.active ?? true,
      images: dto.images,
      categoryId: dto.categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static toResponse(entity: ProductEntity): ResponseProductDto {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      price: entity.price,             // desde VO 
      description: entity.description,
      stock: entity.stock.value,       // desde StockEntity
      active: entity.active,
      images: entity.images,
      categoryId: entity.categoryId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}