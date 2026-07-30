#!/usr/bin/env node

/**
 * Script wrapper para crear migraciones vacías con sintaxis corta.
 * Uso: pnpm run migration:create NombreMigracion
 */

const { execSync } = require('child_process');

// Obtener el nombre de la migración desde los argumentos
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Debes proporcionar un nombre para la migración');
  console.log('Uso: pnpm run migration:create NombreMigracion');
  process.exit(1);
}

// Construir la ruta completa
const migrationsPath = 'src/infrastructure/persistence/typeorm/migrations';
const fullPath = `${migrationsPath}/${migrationName}`;

// Comando TypeORM
const command = `typeorm-ts-node-commonjs -d src/infrastructure/persistence/typeorm/data-source.ts migration:create ${fullPath}`;

console.log(`Creando migración vacía: ${migrationName}...`);
console.log(`Ubicación: ${migrationsPath}/\n`);

try {
  execSync(command, { stdio: 'inherit' });
  console.log(`\n Migración creada exitosamente`);
} catch (error) {
  console.error('\n Error al crear la migración');
  process.exit(1);
}
