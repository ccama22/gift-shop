/**
 * Script para crear la base de datos automáticamente
 * Ejecutar: node scripts/init-database.js
 */

const { Client } = require('pg');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'product_management';

async function createDatabase() {
  // Conectar a la base de datos por defecto 'postgres'
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // ← Conectamos a la BD por defecto
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si la base de datos ya existe
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (result.rows.length > 0) {
      console.log(`ℹ️  La base de datos "${DB_NAME}" ya existe`);
    } else {
      // Crear la base de datos
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ Base de datos "${DB_NAME}" creada exitosamente`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
