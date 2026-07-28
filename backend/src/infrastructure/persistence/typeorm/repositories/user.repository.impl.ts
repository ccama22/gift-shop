import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../../application';
import { UserDomain } from '../../../../domain';
import { Email } from '../../../../domain/value-objects';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

/**
 * Implementación de IUserRepository usando TypeORM.
 * Capa de infraestructura - maneja la persistencia con la base de datos.
 */
@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: Email): Promise<UserDomain | null> {
    const ormEntity = await this.ormRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.getValue() })
      .addSelect('user.passwordHash') // Incluir passwordHash que tiene select: false
      .getOne();

    if (!ormEntity) {
      return null;
    }

    return UserMapper.toDomain(ormEntity);
  }

  async findById(id: string): Promise<UserDomain | null> {
    const ormEntity = await this.ormRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.passwordHash')
      .getOne();

    if (!ormEntity) {
      return null;
    }

    return UserMapper.toDomain(ormEntity);
  }

  async save(user: UserDomain): Promise<UserDomain> {
    const ormEntity = UserMapper.toOrm(user);
    const saved = await this.ormRepository.save(ormEntity);
    return UserMapper.toDomain(saved);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.ormRepository.count({
      where: { email: email.getValue() },
    });
    return count > 0;
  }
}
