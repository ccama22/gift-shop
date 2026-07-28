import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import * as DI_TOKENS from '../../../application/ports/tokens';
import type { IProductRepository } from '../../../application/ports/out/repositories/product.repository.interface';
import type { ICategoryRepository } from '../../../application/ports/out/repositories/category.repository.interface';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(DI_TOKENS.IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(DI_TOKENS.ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo de productos y combos' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filtrar por ID de categoría',
  })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async getProducts(
    @Query('categoryId') categoryId?: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll(categoryId);

    return products.map((p) => ({
      id: p.getId(),
      categoryId: p.getCategoryId(),
      name: p.getName(),
      description: p.getDescription(),
      price: p.getPrice(),
      stock: p.getStock(),
      isCombo: p.getIsCombo(),
      imageUrl: p.getImageUrl(),
      components: p.getComponents().map((c) => ({
        comboId: c.getComboId(),
        productId: c.getProductId(),
        quantity: c.getQuantity(),
        productName: c.getProductName(),
        productPrice: c.getProductPrice(),
      })),
      createdAt: p.getCreatedAt(),
    }));
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener listado de categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías activas' })
  async getCategories() {
    const categories = await this.categoryRepository.findAll();
    return categories.map((c) => ({
      id: c.getId(),
      name: c.getName(),
      slug: c.getSlug(),
      description: c.getDescription(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un producto o combo por ID' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    const p = await this.productRepository.findById(id);
    if (!p) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return {
      id: p.getId(),
      categoryId: p.getCategoryId(),
      name: p.getName(),
      description: p.getDescription(),
      price: p.getPrice(),
      stock: p.getStock(),
      isCombo: p.getIsCombo(),
      imageUrl: p.getImageUrl(),
      components: p.getComponents().map((c) => ({
        comboId: c.getComboId(),
        productId: c.getProductId(),
        quantity: c.getQuantity(),
        productName: c.getProductName(),
        productPrice: c.getProductPrice(),
      })),
      createdAt: p.getCreatedAt(),
    };
  }
}
