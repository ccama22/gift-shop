import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserRole } from '../../../../domain/enums/user-role.enum';

/**
 * Seeder para crear usuarios de prueba con distintos roles.
 * Ejecutar con: pnpm run seed:run
 */
export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(UserOrmEntity);

  console.log('🌱 Seeding users with roles...');

  const existingUsersCount = await userRepository.count();
  if (existingUsersCount > 0) {
    console.log('⚠️  Users already exist. Skipping seed.');
    return;
  }

  const users = [
    {
      email: 'admin@example.com',
      name: 'Administrador Tienda',
      password: 'Admin123!',
      role: UserRole.ADMIN,
    },
    {
      email: 'user@example.com',
      name: 'Cliente Comprador',
      password: 'User123!',
      role: UserRole.CUSTOMER,
    },
    {
      email: 'florista@example.com',
      name: 'María Florista (Taller)',
      password: 'Florist123!',
      role: UserRole.FLORIST,
    },
    {
      email: 'repartidor@example.com',
      name: 'Carlos Repartidor (Delivery)',
      password: 'Delivery123!',
      role: UserRole.DELIVERY_DRIVER,
    },
  ];

  for (const userData of users) {
    const passwordHash = await bcrypt.hash(userData.password, 12);

    const user = userRepository.create({
      email: userData.email,
      name: userData.name,
      passwordHash,
      role: userData.role,
      isActive: true,
    });

    await userRepository.save(user);

    console.log(
      `✅ User created: ${user.email} | Rol: ${user.role} | Password: ${userData.password}`,
    );
  }

  console.log('🎉 Users seeded successfully!');
}
