import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

/**
 * Entidad ORM para sesiones (TypeORM).
 * Esta es una entidad de infraestructura, NO de dominio.
 * Se mapea a/desde SessionDomain usando un Mapper.
 */
@Entity('sessions')
export class SessionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  user!: UserOrmEntity;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHash!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  accessTokenJti!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  refreshTokenJti!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
