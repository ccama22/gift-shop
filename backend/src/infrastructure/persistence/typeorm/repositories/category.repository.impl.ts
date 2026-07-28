import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICategoryRepository } from '../../../../application/ports/out/repositories/category.repository.interface';
import { CategoryDomain } from '../../../../domain';
import { CategoryOrmEntity } from '../entities/category.orm-entity';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class CategoryRepositoryImpl implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly ormRepository: Repository<CategoryOrmEntity>,
  ) {}

  async findAll(): Promise<CategoryDomain[]> {
    const categories = await this.ormRepository.find({
      order: { name: 'ASC' },
    });
    return categories.map((c) => CategoryMapper.toDomain(c));
  }

  async findById(id: string): Promise<CategoryDomain | null> {
    const category = await this.ormRepository.findOne({ where: { id } });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findBySlug(slug: string): Promise<CategoryDomain | null> {
    const category = await this.ormRepository.findOne({ where: { slug } });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async save(category: CategoryDomain): Promise<CategoryDomain> {
    const ormEntity = CategoryMapper.toOrm(category);
    const saved = await this.ormRepository.save(ormEntity);
    return CategoryMapper.toDomain(saved);
  }
}
