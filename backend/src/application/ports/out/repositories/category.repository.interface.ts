import { CategoryDomain } from '../../../../domain';

export interface ICategoryRepository {
  findAll(): Promise<CategoryDomain[]>;
  findById(id: string): Promise<CategoryDomain | null>;
  findBySlug(slug: string): Promise<CategoryDomain | null>;
  save(category: CategoryDomain): Promise<CategoryDomain>;
}
