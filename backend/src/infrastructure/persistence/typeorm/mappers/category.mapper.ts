import { CategoryDomain } from '../../../../domain';
import { CategoryOrmEntity } from '../entities/category.orm-entity';

export class CategoryMapper {
  static toDomain(orm: CategoryOrmEntity): CategoryDomain {
    return CategoryDomain.fromPersistence({
      id: orm.id,
      name: orm.name,
      slug: orm.slug,
      description: orm.description,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: CategoryDomain): CategoryOrmEntity {
    const orm = new CategoryOrmEntity();
    orm.id = domain.getId();
    orm.name = domain.getName();
    orm.slug = domain.getSlug();
    orm.description = domain.getDescription();
    orm.createdAt = domain.getCreatedAt();
    orm.updatedAt = domain.getUpdatedAt();
    return orm;
  }
}
