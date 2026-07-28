import { UserDomain, UserRole } from '../../../../domain';
import { Email, Password } from '../../../../domain/value-objects';
import { UserOrmEntity } from '../entities/user.orm-entity';

/**
 * Mapper para convertir entre UserOrmEntity (TypeORM) y UserDomain (Domain).
 */
export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): UserDomain {
    const email = Email.create(ormEntity.email);
    const password = Password.fromHash(ormEntity.passwordHash);

    return UserDomain.fromPersistence({
      id: ormEntity.id,
      email,
      name: ormEntity.name,
      password,
      role: ormEntity.role ?? UserRole.CUSTOMER,
      isActive: ormEntity.isActive,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toOrm(domainEntity: UserDomain): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    ormEntity.id = domainEntity.getId();
    ormEntity.email = domainEntity.getEmail().getValue();
    ormEntity.name = domainEntity.getName();
    ormEntity.passwordHash = domainEntity.getPassword().getValue();
    ormEntity.role = domainEntity.getRole();
    ormEntity.isActive = domainEntity.isActive();
    ormEntity.createdAt = domainEntity.getCreatedAt();
    ormEntity.updatedAt = domainEntity.getUpdatedAt();

    return ormEntity;
  }
}
