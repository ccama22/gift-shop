const { Client } = require('pg');
require('dotenv').config();

async function checkTags() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'product_management',
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos\n');

    // Consultar productos con sus tags
    const result = await client.query(`
      SELECT 
        id, 
        name, 
        tags,
        CASE 
          WHEN tags IS NULL THEN 'NULL'
          WHEN tags = '[]'::jsonb THEN 'EMPTY ARRAY'
          ELSE 'HAS TAGS'
        END as tag_status
      FROM products 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `);

    console.log('📦 Últimos 10 productos:\n');
    console.table(result.rows.map(row => ({
      id: row.id.substring(0, 8) + '...',
      name: row.name.substring(0, 30),
      tags: JSON.stringify(row.tags),
      status: row.tag_status
    })));

    // Buscar el producto específico
    const specificProduct = await client.query(
      `SELECT id, name, tags FROM products WHERE id = $1`,
      ['1b9ec807-1e29-466c-906d-4bccf593f413']
    );

    if (specificProduct.rows.length > 0) {
      console.log('\n🔍 Producto específico (ramo sorpresa max):');
      console.log(JSON.stringify(specificProduct.rows[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTags();
