import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('order_items')
export class OrderItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  orderId!: string;

  @ManyToOne(() => OrderOrmEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order!: Relation<OrderOrmEntity>;

  @Column({ type: 'uuid' })
  productId!: string;

  @ManyToOne(() => ProductOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product!: ProductOrmEntity;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;
}
