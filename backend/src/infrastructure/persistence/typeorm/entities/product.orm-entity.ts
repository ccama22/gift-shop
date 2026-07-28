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
import { CategoryOrmEntity } from './category.orm-entity';
import { ComboItemOrmEntity } from './combo-item.orm-entity';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  categoryId!: string;

  @ManyToOne(() => CategoryOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryOrmEntity;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'boolean', default: false })
  isCombo!: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @OneToMany(() => ComboItemOrmEntity, (item) => item.combo, { cascade: true })
  components!: Relation<ComboItemOrmEntity>[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
