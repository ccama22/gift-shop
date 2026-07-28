import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISessionRepository } from '../../../../application';
import { SessionDomain } from '../../../../domain';
import { SessionOrmEntity } from '../entities/session.orm-entity';
import { SessionMapper } from '../mappers/session.mapper';

/**
 * Implementación de ISessionRepository usando TypeORM.
 * Capa de infraestructura - maneja la persistencia con la base de datos.
 */
@Injectable()
export class SessionRepositoryImpl implements ISessionRepository {
  constructor(
    @InjectRepository(SessionOrmEntity)
    private readonly ormRepository: Repository<SessionOrmEntity>,
  ) {}

  async findActiveByUserId(userId: string): Promise<SessionDomain | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { userId, isActive: true },
    });

    if (!ormEntity) {
      return null;
    }

    return SessionMapper.toDomain(ormEntity);
  }

  async findById(id: string): Promise<SessionDomain | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
    });

    if (!ormEntity) {
      return null;
    }

    return SessionMapper.toDomain(ormEntity);
  }

  async save(session: SessionDomain): Promise<SessionDomain> {
    const ormEntity = SessionMapper.toOrm(session);
    const saved = await this.ormRepository.save(ormEntity);
    return SessionMapper.toDomain(saved);
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.ormRepository.delete({ userId });
  }
}
