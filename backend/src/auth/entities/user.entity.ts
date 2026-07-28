import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  /**
   * Nunca almacenar la contraseña en texto plano.
   * Este campo siempre contiene el hash generado con bcrypt (cost >= 12).
   * select: false → no se incluye en queries por defecto, hay que pedirlo explícitamente.
   */
  @Column({ type: 'varchar', length: 72, select: false })
  passwordHash!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
