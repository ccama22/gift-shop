import { SessionDomain } from '../../../../domain';
import { SessionOrmEntity } from '../entities/session.orm-entity';

/**
 * Mapper para convertir entre SessionOrmEntity (TypeORM) y SessionDomain (Domain).
 * Aísla la lógica de persistencia del dominio.
 */
export class SessionMapper {
  /**
   * Convierte de entidad ORM a entidad de dominio.
   */
  static toDomain(ormEntity: SessionOrmEntity): SessionDomain {
    return SessionDomain.fromPersistence({
      id: ormEntity.id,
      userId: ormEntity.userId,
      refreshTokenHash: ormEntity.refreshTokenHash,
      isActive: ormEntity.isActive,
      expiresAt: ormEntity.expiresAt!,
      revokedAt: ormEntity.revokedAt,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  /**
   * Convierte de entidad de dominio a entidad ORM.
   */
  static toOrm(domainEntity: SessionDomain): SessionOrmEntity {
    const ormEntity = new SessionOrmEntity();
    ormEntity.id = domainEntity.getId();
    ormEntity.userId = domainEntity.getUserId();
    ormEntity.refreshTokenHash = domainEntity.getRefreshTokenHash();
    ormEntity.isActive = domainEntity.isActive();
    ormEntity.expiresAt = domainEntity.getExpiresAt();
    ormEntity.revokedAt = domainEntity.getRevokedAt();
    ormEntity.createdAt = domainEntity.getCreatedAt();
    ormEntity.updatedAt = domainEntity.getUpdatedAt();

    return ormEntity;
  }
}
