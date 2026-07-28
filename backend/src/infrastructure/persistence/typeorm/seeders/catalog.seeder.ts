import { DataSource } from 'typeorm';
import { CategoryOrmEntity } from '../entities/category.orm-entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ComboItemOrmEntity } from '../entities/combo-item.orm-entity';

export async function seedCatalog(dataSource: DataSource): Promise<void> {
  const categoryRepo = dataSource.getRepository(CategoryOrmEntity);
  const productRepo = dataSource.getRepository(ProductOrmEntity);
  const comboItemRepo = dataSource.getRepository(ComboItemOrmEntity);

  console.log('🌱 Seeding catalog (categories & products)...');

  const existingCategoriesCount = await categoryRepo.count();
  if (existingCategoriesCount > 0) {
    console.log('⚠️  Catalog already seeded. Skipping.');
    return;
  }

  // 1. Crear Categorías
  const catRamos = await categoryRepo.save({
    name: 'Ramos de Flores',
    slug: 'ramos-de-flores',
    description:
      'Ramos frescos de rosas, girasoles y arreglos florales especiales',
  });

  const catPeluches = await categoryRepo.save({
    name: 'Peluches',
    slug: 'peluches',
    description: 'Osos de peluche suaves de diversos tamaños y diseños',
  });

  const catChocolates = await categoryRepo.save({
    name: 'Chocolates',
    slug: 'chocolates',
    description: 'Cajas de bombones finos y chocolates gourmet',
  });

  const catCombos = await categoryRepo.save({
    name: 'Combos Especiales',
    slug: 'combos-especiales',
    description: 'Packs especiales combinados de ramos, peluches y chocolates',
  });

  console.log('✅ Categories created');

  // 2. Crear Productos Individuales
  const ramoRosas = await productRepo.save({
    categoryId: catRamos.id,
    name: 'Ramo de 12 Rosas Rojas',
    description:
      'Hermoso ramo compuesto por 12 rosas rojas frescas y follaje decorativo',
    price: 35.0,
    stock: 20,
    isCombo: false,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
  });

  const osoPeluche = await productRepo.save({
    categoryId: catPeluches.id,
    name: 'Oso de Peluche Gigante 50cm',
    description: 'Oso de peluche afelpado ultra suave con moño rojo',
    price: 25.0,
    stock: 15,
    isCombo: false,
    imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11',
  });

  const cajaChocolates = await productRepo.save({
    categoryId: catChocolates.id,
    name: 'Caja Bombones Ferrero Rocher (16u)',
    description: 'Caja de regalo con 16 deliciosos bombones crocantes',
    price: 15.0,
    stock: 30,
    isCombo: false,
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b',
  });

  console.log('✅ Individual products created');

  // 3. Crear Producto Combo (Ramo + Oso + Chocolates)
  const comboAmor = await productRepo.save({
    categoryId: catCombos.id,
    name: 'Pack Amor Infinito (Ramo + Peluche + Chocolates)',
    description:
      'Super pack de regalo que incluye Ramo de 12 Rosas, Oso Gigante y Caja de Bombones a precio especial',
    price: 65.0, // Descuento por combo
    stock: 10,
    isCombo: true,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176',
  });

  // Asociar componentes al combo
  await comboItemRepo.save([
    { comboId: comboAmor.id, productId: ramoRosas.id, quantity: 1 },
    { comboId: comboAmor.id, productId: osoPeluche.id, quantity: 1 },
    { comboId: comboAmor.id, productId: cajaChocolates.id, quantity: 1 },
  ]);

  console.log('✅ Special Combo product and components created');
  console.log('🎉 Catalog seeded successfully!');
}
