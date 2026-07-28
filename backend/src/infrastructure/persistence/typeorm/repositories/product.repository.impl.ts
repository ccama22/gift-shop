import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../../../application/ports/out/repositories/product.repository.interface';
import { ProductDomain } from '../../../../domain';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductRepositoryImpl implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepository: Repository<ProductOrmEntity>,
  ) {}

  async findAll(categoryId?: string): Promise<ProductDomain[]> {
    const query = this.ormRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.components', 'components')
      .leftJoinAndSelect('components.product', 'componentProduct');

    if (categoryId) {
      query.where('product.categoryId = :categoryId', { categoryId });
    }

    query.orderBy('product.createdAt', 'DESC');

    const products = await query.getMany();
    return products.map((p) => ProductMapper.toDomain(p));
  }

  async findById(id: string): Promise<ProductDomain | null> {
    const product = await this.ormRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.components', 'components')
      .leftJoinAndSelect('components.product', 'componentProduct')
      .where('product.id = :id', { id })
      .getOne();

    return product ? ProductMapper.toDomain(product) : null;
  }

  async save(product: ProductDomain): Promise<ProductDomain> {
    const ormEntity = ProductMapper.toOrm(product);
    const saved = await this.ormRepository.save(ormEntity);
    return this.findById(saved.id) as Promise<ProductDomain>;
  }
}
