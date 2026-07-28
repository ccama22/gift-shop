import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('addresses')
export class AddressOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @Column({ type: 'varchar', length: 200 })
  recipientName!: string;

  @Column({ type: 'varchar', length: 50 })
  recipientPhone!: string;

  @Column({ type: 'text' })
  streetAddress!: string;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({ type: 'text', nullable: true })
  reference!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
