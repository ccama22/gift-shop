import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import type { ProductOrmEntity } from './product.orm-entity';

@Entity('combo_items')
export class ComboItemOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  comboId!: string;

  @PrimaryColumn({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @ManyToOne(
    'ProductOrmEntity',
    (product: ProductOrmEntity) => product.components,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'comboId' })
  combo!: Relation<ProductOrmEntity>;

  @ManyToOne('ProductOrmEntity', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product!: Relation<ProductOrmEntity>;
}
