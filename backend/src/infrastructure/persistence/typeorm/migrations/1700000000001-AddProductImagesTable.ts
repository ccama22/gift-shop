import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductImagesTable1700000000001 implements MigrationInterface {
  name = 'AddProductImagesTable1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla product_images
    await queryRunner.query(`
      CREATE TABLE "product_images" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "productId" UUID NOT NULL,
        "imageUrl" VARCHAR(500) NOT NULL,
        "displayOrder" INTEGER NOT NULL DEFAULT 0,
        "isPrimary" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT "FK_product_images_product" 
          FOREIGN KEY ("productId") 
          REFERENCES "products"("id") 
          ON DELETE CASCADE
      )
    `);

    // Crear índice para productId
    await queryRunner.query(`
      CREATE INDEX "IDX_product_images_productId" 
      ON "product_images" ("productId")
    `);

    // Crear índice compuesto para productId + isPrimary (para búsqueda rápida de imagen principal)
    await queryRunner.query(`
      CREATE INDEX "IDX_product_images_productId_primary" 
      ON "product_images" ("productId", "isPrimary")
    `);

    // Migrar imágenes existentes de products.imageUrl a product_images
    await queryRunner.query(`
      INSERT INTO "product_images" ("productId", "imageUrl", "displayOrder", "isPrimary")
      SELECT 
        id as "productId",
        "imageUrl",
        0 as "displayOrder",
        true as "isPrimary"
      FROM "products"
      WHERE "imageUrl" IS NOT NULL AND "imageUrl" != ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar imageUrl en products desde product_images
    await queryRunner.query(`
      UPDATE "products" p
      SET "imageUrl" = (
        SELECT pi."imageUrl"
        FROM "product_images" pi
        WHERE pi."productId" = p.id AND pi."isPrimary" = true
        LIMIT 1
      )
    `);

    // Eliminar índices
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_images_productId_primary"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_images_productId"`);

    // Eliminar tabla
    await queryRunner.query(`DROP TABLE IF EXISTS "product_images"`);
  }
}
