import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.client.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async getProducts(categoryId?: string, search?: string, isPrivateLabel?: boolean) {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isPrivateLabel !== undefined) {
      where.variants = {
        some: { isPrivateLabel },
      };
    }

    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameBn: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.client.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: {
          where: { isActive: true },
          orderBy: { unitValue: 'asc' },
        },
      },
    });
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.client.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            substitutesAsPrimary: {
              include: { substituteVariant: true },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async getSubstitutionsForVariant(variantId: string) {
    return this.prisma.client.productSubstitution.findMany({
      where: { primaryVariantId: variantId },
      include: {
        substituteVariant: {
          include: { product: true },
        },
      },
    });
  }
}
