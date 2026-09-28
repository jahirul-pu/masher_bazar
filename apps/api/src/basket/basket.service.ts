import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  generateMonthlyBasket,
  optimizeBasketForBudget,
  calculateBasketSavings,
  CatalogVariantRef,
} from '@masik/business-rules';
import {
  CookingFrequency,
  FoodPreference,
  MarketTier,
  Household,
  BasketItem,
  BasketType,
  ProductUnit,
  ProductSubstitution,
} from '@masik/shared-types';

export interface GenerateBasketDto {
  householdSize: number;
  adultCount?: number;
  childCount?: number;
  elderlyCount?: number;
  cookingFrequency?: CookingFrequency;
  foodPreference?: FoodPreference;
  defaultMonthlyBudget?: number;
  marketTier?: MarketTier;
}

export interface OptimizeBasketDto {
  items: BasketItem[];
  targetBudget: number;
}

@Injectable()
export class BasketService {
  constructor(private prisma: PrismaService) {}

  private async fetchCatalogReferences(): Promise<CatalogVariantRef[]> {
    const variants = await this.prisma.client.productVariant.findMany({
      where: { isActive: true },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    return variants.map((v) => ({
      variantId: v.id,
      sku: v.sku,
      categorySlug: v.product.category.slug,
      nameEn: v.nameEn,
      unit: v.unit as ProductUnit,
      unitValue: v.unitValue,
      masikPrice: v.masikPrice,
      mrp: v.mrp,
      marketTier: v.isPrivateLabel ? MarketTier.BASIC : MarketTier.FAMILY,
      isStaple: true,
    }));
  }

  async generateBasket(dto: GenerateBasketDto) {
    const catalog = await this.fetchCatalogReferences();

    const mockHousehold: Household = {
      id: 'temp-preview',
      customerId: 'temp',
      householdName: 'Preview Household',
      householdSize: dto.householdSize || 4,
      adultCount: dto.adultCount || 2,
      childCount: dto.childCount || 2,
      elderlyCount: dto.elderlyCount || 0,
      cookingFrequency: dto.cookingFrequency || CookingFrequency.ALMOST_EVERY_DAY,
      foodPreference: dto.foodPreference || FoodPreference.STANDARD,
      defaultMonthlyBudget: dto.defaultMonthlyBudget || 6000,
      marketTier: dto.marketTier || MarketTier.FAMILY,
      createdAt: new Date().toISOString(),
    };

    const rawItems = generateMonthlyBasket(mockHousehold, catalog);
    const savings = calculateBasketSavings(rawItems);

    // Fetch full variant details
    const variantIds = rawItems.map((i) => i.variantId);
    const variants = await this.prisma.client.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    const enrichedItems = rawItems.map((item) => {
      const v = variantMap.get(item.variantId);
      return {
        ...item,
        productNameEn: v?.nameEn || 'Staple Item',
        productNameBn: v?.nameBn || 'নিত্যপণ্য',
        unit: v?.unit,
        unitValue: v?.unitValue,
        subtotalMasik: item.quantity * item.unitMasikPrice,
        subtotalMrp: item.quantity * item.unitMrp,
        totalSavings: item.quantity * (item.unitMrp - item.unitMasikPrice),
      };
    });

    return {
      householdSummary: mockHousehold,
      items: enrichedItems,
      totals: savings,
    };
  }

  async optimizeBasket(dto: OptimizeBasketDto) {
    const primaryIds = dto.items.map((i) => i.variantId);
    const dbSubstitutions = await this.prisma.client.productSubstitution.findMany({
      where: { primaryVariantId: { in: primaryIds } },
      include: {
        substituteVariant: {
          include: { product: true },
        },
      },
    });

    const mappedSubstitutions: ProductSubstitution[] = dbSubstitutions.map((s) => ({
      id: s.id,
      primaryVariantId: s.primaryVariantId,
      substituteVariantId: s.substituteVariantId,
      type: s.type as any,
      priceDelta: s.priceDelta,
      substituteVariant: s.substituteVariant as any,
    }));

    const result = optimizeBasketForBudget(dto.items, dto.targetBudget, mappedSubstitutions);
    const savings = calculateBasketSavings(result.optimizedItems);

    return {
      ...result,
      totals: savings,
    };
  }

  async saveHouseholdBasket(householdId: string, items: BasketItem[], basketType: BasketType = BasketType.RECOMMENDED) {
    const savings = calculateBasketSavings(items);

    const basket = await this.prisma.client.basket.create({
      data: {
        householdId,
        basketType,
        totalMasikPrice: savings.totalMasikPrice,
        totalMarketPrice: savings.totalMarketPrice,
        totalSavings: savings.totalSavings,
        savingsPercentage: savings.savingsPercentage,
        items: {
          create: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            isRecurring: i.isRecurring,
            unitMasikPrice: i.unitMasikPrice,
            unitMrp: i.unitMrp,
          })),
        },
      },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    return basket;
  }
}
