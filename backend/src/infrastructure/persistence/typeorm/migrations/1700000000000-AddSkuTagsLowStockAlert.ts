import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkuTagsLowStockAlert1700000000000 implements MigrationInterface {
  name = 'AddSkuTagsLowStockAlert1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna SKU (única, nullable)
    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD COLUMN "sku" VARCHAR(50) NULL
    `);

    // Crear índice único para SKU
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_products_sku" 
      ON "products" ("sku") 
      WHERE "sku" IS NOT NULL
    `);

    // Agregar columna tags (JSONB con default array vacío)
    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD COLUMN "tags" JSONB NOT NULL DEFAULT '[]'::jsonb
    `);

    // Crear índice GIN para búsqueda eficiente en tags
    await queryRunner.query(`
      CREATE INDEX "IDX_products_tags" 
      ON "products" USING GIN ("tags")
    `);

    // Agregar columna lowStockAlert (con default 10)
    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD COLUMN "lowStockAlert" INTEGER NOT NULL DEFAULT 10
    `);

    // Crear índice para productos con stock bajo (usado en alertas)
    await queryRunner.query(`
      CREATE INDEX "IDX_products_low_stock" 
      ON "products" ("stock", "lowStockAlert") 
      WHERE "isActive" = true AND "stock" <= "lowStockAlert"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_low_stock"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_tags"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_sku"`);

    // Eliminar columnas
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "lowStockAlert"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sku"`);
  }
}
