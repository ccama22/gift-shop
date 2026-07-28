import { ProductDomain, ComboItemDomain } from '../../../../domain';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ComboItemOrmEntity } from '../entities/combo-item.orm-entity';

export class ProductMapper {
  static toDomain(orm: ProductOrmEntity): ProductDomain {
    const components = (orm.components ?? []).map((comp) =>
      ComboItemDomain.fromPersistence({
        comboId: comp.comboId,
        productId: comp.productId,
        quantity: comp.quantity,
        productName: comp.product?.name,
        productPrice: comp.product ? Number(comp.product.price) : undefined,
      }),
    );

    return ProductDomain.fromPersistence({
      id: orm.id,
      categoryId: orm.categoryId,
      name: orm.name,
      description: orm.description,
      price: Number(orm.price),
      stock: orm.stock,
      isCombo: orm.isCombo,
      imageUrl: orm.imageUrl,
      components,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: ProductDomain): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.id = domain.getId();
    orm.categoryId = domain.getCategoryId();
    orm.name = domain.getName();
    orm.description = domain.getDescription();
    orm.price = domain.getPrice();
    orm.stock = domain.getStock();
    orm.isCombo = domain.getIsCombo();
    orm.imageUrl = domain.getImageUrl();
    orm.createdAt = domain.getCreatedAt();
    orm.updatedAt = domain.getUpdatedAt();

    if (domain.getComponents() && domain.getComponents().length > 0) {
      orm.components = domain.getComponents().map((comp) => {
        const itemOrm = new ComboItemOrmEntity();
        itemOrm.comboId = comp.getComboId();
        itemOrm.productId = comp.getProductId();
        itemOrm.quantity = comp.getQuantity();
        return itemOrm;
      });
    }

    return orm;
  }
}
