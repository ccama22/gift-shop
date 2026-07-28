import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  type Relation,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { AddressOrmEntity } from './address.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @Column({ type: 'uuid' })
  addressId!: string;

  @ManyToOne(() => AddressOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'addressId' })
  address!: AddressOrmEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'text', nullable: true })
  cardMessage!: string | null;

  @Column({ type: 'date' })
  deliveryDate!: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING',
  })
  status!: 'PENDING' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING',
  })
  paymentStatus!: 'PENDING' | 'PAID' | 'REFUNDED';

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order, { cascade: true })
  items!: Relation<OrderItemOrmEntity>[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
