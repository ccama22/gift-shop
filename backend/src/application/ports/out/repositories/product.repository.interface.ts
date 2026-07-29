import { ProductDomain } from '../../../../domain';

export interface IProductRepository {
  findAll(categoryId?: string): Promise<ProductDomain[]>;
  findById(id: string): Promise<ProductDomain | null>;
  findBySku(sku: string): Promise<ProductDomain | null>;
  save(product: ProductDomain): Promise<ProductDomain>;
  findByIdWithImages(id: string): Promise<any>; // Retorna entidad ORM con imágenes
  delete(id: string): Promise<void>;
}
