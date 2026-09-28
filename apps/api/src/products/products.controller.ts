import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('Products & Catalog')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List all product categories' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get()
  @ApiOperation({ summary: 'List products with filters (category, search, private-label)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isPrivateLabel', required: false, type: Boolean })
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('isPrivateLabel') isPrivateLabel?: string
  ) {
    const isPrivate = isPrivateLabel !== undefined ? isPrivateLabel === 'true' : undefined;
    return this.productsService.getProducts(categoryId, search, isPrivate);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product details by slug' })
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.getProductBySlug(slug);
  }

  @Get('variants/:variantId/substitutions')
  @ApiOperation({ summary: 'Get smart product substitution alternatives' })
  async getSubstitutions(@Param('variantId') variantId: string) {
    return this.productsService.getSubstitutionsForVariant(variantId);
  }
}
