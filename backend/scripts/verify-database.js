/**
 * Script para verificar la base de datos y tablas
 * Ejecutar: node scripts/verify-database.js
 */

const { Client } = require('pg');
require('dotenv').config();

async function verifyDatabase() {
  console.log('🔍 Verificando base de datos...\n');

  // 1. Verificar que la base de datos existe
  const clientPostgres = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres',
  });

  try {
    await clientPostgres.connect();
    
    const dbResult = await clientPostgres.query(
      `SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname`
    );

    console.log('📊 Bases de datos disponibles:');
    dbResult.rows.forEach(row => {
      const isOurDb = row.datname === (process.env.DB_NAME || 'product_management');
      console.log(`   ${isOurDb ? '✅' : '  '} ${row.datname}`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Error al verificar bases de datos:', error.message);
  } finally {
    await clientPostgres.end();
  }

  // 2. Verificar tablas en product_management
  const clientApp = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'product_management',
  });

  try {
    await clientApp.connect();
    
    const tablesResult = await clientApp.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log(`📋 Tablas en "${process.env.DB_NAME || 'product_management'}":`);
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No hay tablas (ejecuta el servidor para crearlas)');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   ✅ ${row.table_name}`);
      });
    }
    console.log('');

    // 3. Contar registros
    for (const row of tablesResult.rows) {
      const countResult = await clientApp.query(
        `SELECT COUNT(*) FROM ${row.table_name}`
      );
      console.log(`   📊 ${row.table_name}: ${countResult.rows[0].count} registros`);
    }

  } catch (error) {
    console.error('❌ Error al verificar tablas:', error.message);
  } finally {
    await clientApp.end();
  }
}

verifyDatabase();
