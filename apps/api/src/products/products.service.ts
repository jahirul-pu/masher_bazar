import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_INVENTORY_PRODUCTS, InventoryItem } from '@masik/business-rules';

@Injectable()
export class ProductsService {
  // Synchronized with separated categories from @masik/business-rules
  private inMemoryInventory: InventoryItem[] = [...DEFAULT_INVENTORY_PRODUCTS];

  constructor(private prisma: PrismaService) {}

  async getCategories() {
    try {
      return await this.prisma.client.category.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      });
    } catch {
      const uniqueCats = Array.from(new Set(this.inMemoryInventory.map((i) => i.category)));
      return uniqueCats.map((cat, idx) => ({
        id: `cat-${idx + 1}`,
        nameEn: cat,
        nameBn: cat,
        slug: `cat-${idx + 1}`,
        _count: { products: this.inMemoryInventory.filter((i) => i.category === cat).length },
      }));
    }
  }

  async getProducts(categoryId?: string, search?: string, isPrivateLabel?: boolean) {
    try {
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

      return await this.prisma.client.product.findMany({
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
    } catch {
      let filtered = [...this.inMemoryInventory];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.nameEn.toLowerCase().includes(q) ||
            p.nameBn.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }
      if (isPrivateLabel !== undefined) {
        filtered = filtered.filter((p) => !!p.isPrivateLabel === isPrivateLabel);
      }
      return filtered;
    }
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

  async createProduct(data: any) {
    try {
      let category = await this.prisma.client.category.findFirst({
        where: { slug: data.categorySlug || 'staples' },
      });
      if (!category) {
        category = await this.prisma.client.category.create({
          data: {
            slug: data.categorySlug || `cat-${Date.now()}`,
            nameEn: data.category || 'Staples',
            nameBn: data.category || 'নিত্যপণ্য',
          },
        });
      }

      let brand = await this.prisma.client.brand.findFirst({
        where: { name: data.brand || 'Masher Bazar' },
      });
      if (!brand) {
        brand = await this.prisma.client.brand.create({
          data: {
            name: data.brand || 'Masher Bazar',
            isPrivateLabel: !!data.isPrivateLabel,
          },
        });
      }

      const cleanSlug = (data.nameEn || `prod-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      return await this.prisma.client.product.create({
        data: {
          nameEn: data.nameEn || 'New Product',
          nameBn: data.nameBn || 'নতুন পণ্য',
          slug: `${cleanSlug}-${Math.floor(Math.random() * 1000)}`,
          categoryId: category.id,
          brandId: brand.id,
          variants: {
            create: {
              sku: data.sku || `SKU-${Date.now()}`,
              nameEn: data.nameEn || 'New Product',
              nameBn: data.nameBn || 'নতুন পণ্য',
              unit: (data.unit as any) || 'KG',
              unitValue: Number(data.unitValue) || 1,
              mrp: Number(data.mrp) || 100,
              masikPrice: Number(data.masikPrice) || 90,
              purchaseCost: Number(data.purchaseCost) || 80,
              stockAvailable: Number(data.stockAvailable) || 100,
              isPrivateLabel: !!data.isPrivateLabel,
            },
          },
        },
        include: {
          category: true,
          brand: true,
          variants: true,
        },
      });
    } catch {
      const fallbackItem: InventoryItem = {
        id: data.id || `prod-${Date.now()}`,
        variantId: data.variantId || `v-${Date.now()}`,
        sku: data.sku || `SKU-${Date.now()}`,
        nameEn: data.nameEn || 'New Product',
        nameBn: data.nameBn || 'নতুন পণ্য',
        category: data.category || 'নিত্যপণ্য',
        categorySlug: data.categorySlug || 'staples',
        brand: data.brand || 'Masher Bazar',
        unit: data.unit || 'KG',
        unitValue: Number(data.unitValue) || 1,
        masikPrice: Number(data.masikPrice) || 90,
        mrp: Number(data.mrp) || 100,
        purchaseCost: Number(data.purchaseCost) || 80,
        stockAvailable: Number(data.physicalStock || data.stockAvailable) || 100,
        physicalStock: Number(data.physicalStock) || 100,
        reservedStock: 0,
        batchNumber: data.batchNumber || `BAT-${Date.now()}`,
        status: 'Healthy',
        isPrivateLabel: !!data.isPrivateLabel,
      };
      this.inMemoryInventory.unshift(fallbackItem);
      return fallbackItem;
    }
  }
}
