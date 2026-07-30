#!/usr/bin/env node

/**
 * Script wrapper para generar migraciones con sintaxis corta.
 * Uso: pnpm run migration:generate NombreMigracion
 */

const { execSync } = require('child_process');
const path = require('path');

// Obtener el nombre de la migración desde los argumentos
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Debes proporcionar un nombre para la migración');
  console.log('Uso: pnpm run migration:generate NombreMigracion');
  process.exit(1);
}

// Construir la ruta completa
const migrationsPath = 'src/infrastructure/persistence/typeorm/migrations';
const fullPath = `${migrationsPath}/${migrationName}`;

// Comando TypeORM
const command = `cross-env NODE_ENV=production typeorm-ts-node-commonjs -d src/infrastructure/persistence/typeorm/data-source.ts migration:generate ${fullPath}`;

console.log(`🔄 Generando migración: ${migrationName}...`);
console.log(`📁 Ubicación: ${migrationsPath}/\n`);

try {
  execSync(command, { stdio: 'inherit' });
  console.log(`\n Migración generada exitosamente`);
} catch (error) {
  console.error('\n Error al generar la migración');
  process.exit(1);
}
