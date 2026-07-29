import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  BadRequestException,
  Inject,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as DI_TOKENS from '../../../application/ports/tokens';
import type { IProductRepository } from '../../../application/ports/out/repositories/product.repository.interface';
import type { ICategoryRepository } from '../../../application/ports/out/repositories/category.repository.interface';
import type {
  ICreateProductUseCase,
  IUpdateProductStatusUseCase,
  IUpdateProductUseCase,
  IDeleteProductUseCase,
} from '../../../application/ports/in/products';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { multerConfig } from '../../../infrastructure/file-upload/multer.config';
import { FileUploadService } from '../../../infrastructure/file-upload/file-upload.service';
import { ProductImageOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/product-image.orm-entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(DI_TOKENS.IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(DI_TOKENS.ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(DI_TOKENS.ICreateProductUseCase)
    private readonly createProductUseCase: ICreateProductUseCase,
    @Inject(DI_TOKENS.IUpdateProductStatusUseCase)
    private readonly updateProductStatusUseCase: IUpdateProductStatusUseCase,
    @Inject(DI_TOKENS.IUpdateProductUseCase)
    private readonly updateProductUseCase: IUpdateProductUseCase,
    @Inject(DI_TOKENS.IDeleteProductUseCase)
    private readonly deleteProductUseCase: IDeleteProductUseCase,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private mapProductToDto(p: any): ProductResponseDto {
    return {
      id: p.getId(),
      categoryId: p.getCategoryId(),
      name: p.getName(),
      description: p.getDescription(),
      price: p.getPrice(),
      stock: p.getStock(),
      isCombo: p.getIsCombo(),
      isActive: p.getIsActive(),
      imageUrl: p.getImageUrl(),
      images: [], // Se llenará desde la entidad ORM directamente
      sku: p.getSku(),
      tags: p.getTags(),
      lowStockAlert: p.getLowStockAlert(),
      canBeSold: p.canBeSold(),
      components: p.getComponents().map((c: any) => ({
        comboId: c.getComboId(),
        productId: c.getProductId(),
        quantity: c.getQuantity(),
        productName: c.getProductName(),
        productPrice: c.getProductPrice(),
      })),
      createdAt: p.getCreatedAt(),
    };
  }

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
    return Promise.all(products.map(async (p) => {
      const dto = this.mapProductToDto(p);
      // Cargar imágenes desde la entidad ORM
      const productOrm = await this.productRepository.findByIdWithImages(p.getId());
      dto.images = productOrm?.images?.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        displayOrder: img.displayOrder,
        isPrimary: img.isPrimary,
      })) || [];
      return dto;
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
    const dto = this.mapProductToDto(p);
    
    // Cargar imágenes
    const productOrm = await this.productRepository.findByIdWithImages(id);
    dto.images = productOrm?.images?.map((img: any) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary,
    })) || [];
    
    return dto;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear nuevo producto (requiere autenticación)' })
  @ApiResponse({
    status: 201,
    type: ProductResponseDto,
    description: 'Producto creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async createProduct(
    @Body() dto: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute({
      id: uuidv4(),
      categoryId: dto.categoryId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      isActive: dto.isActive ?? true,
      isCombo: dto.isCombo ?? false,
      imageUrl: dto.imageUrl,
      lowStockAlert: dto.lowStockAlert,
      sku: dto.sku,
      tags: dto.tags,
    });

    return this.mapProductToDto(product);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar producto (requiere autenticación)' })
  @ApiResponse({
    status: 200,
    type: ProductResponseDto,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(id, dto);
    return this.mapProductToDto(product);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Activar/Desactivar producto (requiere autenticación)' })
  @ApiResponse({
    status: 200,
    type: ProductResponseDto,
    description: 'Estado actualizado exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async updateProductStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProductStatusDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductStatusUseCase.execute(
      id,
      dto.isActive,
    );
    return this.mapProductToDto(product);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiOperation({ summary: 'Subir imagen de producto (requiere autenticación)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida correctamente' })
  @ApiResponse({ status: 400, description: 'No se proporcionó imagen o tipo no permitido' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    const url = this.fileUploadService.saveFile(file);
    return { url };
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Agregar imágenes a un producto (requiere autenticación)' })
  @ApiResponse({ status: 201, description: 'Imágenes agregadas' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async addProductImages(
    @Param('id') productId: string,
    @Body() body: { images: Array<{ url: string; isPrimary?: boolean }> },
  ) {
    const product = await this.productRepository.findByIdWithImages(productId);
    if (!product) {
      throw new NotFoundException(`Producto ${productId} no encontrado`);
    }

    // Crear entidades de imagen
    const newImages = body.images.map((img, index) => {
      const entity = new ProductImageOrmEntity();
      entity.productId = productId;
      entity.imageUrl = img.url;
      entity.displayOrder = product.images?.length ? product.images.length + index : index;
      entity.isPrimary = img.isPrimary || false;
      return entity;
    });

    // Guardar usando el repositorio TypeORM directamente
    const imageRepo = this.productRepository['ormRepository'].manager.getRepository(ProductImageOrmEntity);
    const savedImages = await imageRepo.save(newImages);

    return { success: true, added: savedImages.length };
  }

  @Delete(':productId/images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una imagen de un producto (requiere autenticación)' })
  @ApiResponse({ status: 200, description: 'Imagen eliminada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async deleteProductImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
  ) {
    const imageRepo = this.productRepository['ormRepository'].manager.getRepository(ProductImageOrmEntity);
    
    // Buscar la imagen
    const image = await imageRepo.findOne({
      where: { id: imageId, productId: productId }
    });

    if (!image) {
      throw new NotFoundException(`Imagen ${imageId} no encontrada`);
    }

    // Eliminar la imagen
    await imageRepo.remove(image);

    return { success: true, message: 'Imagen eliminada correctamente' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar un producto (requiere autenticación)' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async deleteProduct(@Param('id') id: string) {
    await this.deleteProductUseCase.execute(id);
    return { success: true, message: 'Producto eliminado correctamente' };
  }
}

