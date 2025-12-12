// En domain hay 2 entidades: ProductEntity y CategoryEntity


import { ProductEntity } from "../../domain/entity/product.entity";

export interface IProductRepository {
  // Definición de métodos del repositorio para ProductEntity
  // --- Escritura ---
  save(product: ProductEntity): Promise<ProductEntity>;
  deleteById(id: number, soft?: boolean): Promise<void>;                             // Eliminar  (soft/hard según reglas)
  restoreById(id: number): Promise<ProductEntity>;
  updateStock(id: number, quantity: number): Promise<ProductEntity>;
  decrementStock(id: number, quantity: number): Promise<ProductEntity>;

  // --- Lectura ---
  findById(id: number): Promise<ProductEntity | null>;
  findAll(params?: { page?: number; limit?: number }): Promise<ProductEntity[]>; // Listar con paginación
  findLowStock(threshold: number): Promise<ProductEntity[]>;
  searchByName(name: string): Promise<ProductEntity[]>;
}