import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSoftDeleteToProducts1700000000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna deletedAt para soft delete
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamptz',
        isNullable: true,
        default: null,
      }),
    );

    // Crear índice para mejorar performance en consultas que filtran por deletedAt
    await queryRunner.query(`
      CREATE INDEX "IDX_products_deletedAt" ON "products" ("deletedAt");
    `);

    console.log('✅ Columna deletedAt agregada a products');
    console.log('✅ Índice creado para deletedAt');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índice
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_products_deletedAt";
    `);

    // Eliminar columna
    await queryRunner.dropColumn('products', 'deletedAt');

    console.log('✅ Migración revertida: deletedAt eliminado');
  }
}
