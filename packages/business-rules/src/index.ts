import {
  CookingFrequency,
  FoodPreference,
  Household,
  MarketTier,
  ProductVariant,
  ProductUnit,
  BasketItem,
  Basket,
  BasketType,
  ProductSubstitution,
  SubstitutionType,
} from '@masik/shared-types';

export interface CatalogVariantRef {
  variantId: string;
  sku: string;
  categorySlug: string;
  nameEn: string;
  unit: ProductUnit;
  unitValue: number;
  masikPrice: number;
  mrp: number;
  marketTier: MarketTier;
  isStaple: boolean;
}

/**
 * 1. Monthly Basket Generator Engine
 * Calculates Bangladeshi staple and household grocery quotas based on household size,
 * composition, cooking habits, and dietary profile.
 */
export function generateMonthlyBasket(
  household: Household,
  catalog: CatalogVariantRef[]
): BasketItem[] {
  const size = Math.max(1, household.householdSize);
  const adults = Math.max(1, household.adultCount || size);
  const children = Math.max(0, household.childCount || 0);

  // Cooking frequency multiplier
  const freqMultiplier: Record<CookingFrequency, number> = {
    [CookingFrequency.ALMOST_EVERY_DAY]: 1.0,
    [CookingFrequency.FOUR_TO_FIVE_DAYS]: 0.85,
    [CookingFrequency.TWO_TO_THREE_DAYS]: 0.6,
    [CookingFrequency.OCCASIONALLY]: 0.35,
  };
  const cookingFactor = freqMultiplier[household.cookingFrequency] || 1.0;

  // Food preference staple bias
  const isRiceHeavy = household.foodPreference === FoodPreference.RICE_HEAVY;
  const isRotiHeavy = household.foodPreference === FoodPreference.ROTI_HEAVY;

  // Caloric / Volume calculation (Bangladeshi standards per month)
  // Rice: ~5.5kg per adult, ~3kg per child
  const riceKgTarget = Math.round((adults * (isRiceHeavy ? 7.0 : 5.5) + children * 3.0) * cookingFactor);
  // Soybean/Cooking Oil: ~1.25L base + 0.85L per adult
  const oilLitersTarget = Math.max(1, Math.round((1.25 + adults * 0.85) * cookingFactor));
  // Lentils (Dal): ~0.75kg per person
  const lentilsKgTarget = Math.max(1, Math.round(size * 0.75 * cookingFactor));
  // Flour (Atta): Standard ~1.5kg/person, Roti-heavy ~3.5kg/person
  const flourKgTarget = Math.max(1, Math.round(size * (isRotiHeavy ? 3.5 : 1.5) * cookingFactor));
  // Sugar & Salt
  const saltKgTarget = Math.max(1, Math.round(1 + size * 0.35));
  const sugarKgTarget = Math.max(1, Math.round(1 + size * 0.5));
  // Potatoes & Onions
  const potatoKgTarget = Math.max(2, Math.round(size * 1.5 * cookingFactor));
  const onionKgTarget = Math.max(2, Math.round(size * 1.5 * cookingFactor));
  // Non-food hygiene essentials
  const soapPcs = Math.max(2, Math.round(size * 1.2));
  const detergentKg = Math.max(1, Math.round(size * 0.6));
  const tissuePacks = Math.max(2, Math.round(size * 1.0));

  const items: BasketItem[] = [];

  const findBestVariant = (categorySlug: string, isStaple: boolean): CatalogVariantRef | undefined => {
    // Prefer matching marketTier (Economy/Standard/Premium)
    const matches = catalog.filter((c) => c.categorySlug === categorySlug && c.isStaple === isStaple);
    const tierMatch = matches.find((m) => m.marketTier === household.marketTier);
    return tierMatch || matches[0];
  };

  // Helper to add item
  const addItem = (categorySlug: string, targetQuantity: number, isRecurring: boolean = true) => {
    const variant = findBestVariant(categorySlug, true);
    if (variant && targetQuantity > 0) {
      items.push({
        variantId: variant.variantId,
        quantity: targetQuantity,
        isRecurring,
        unitMasikPrice: variant.masikPrice,
        unitMrp: variant.mrp,
      });
    }
  };

  addItem('staples_rice', riceKgTarget);
  addItem('cooking_oil', oilLitersTarget);
  addItem('staples_lentils', lentilsKgTarget);
  addItem('staples_flour', flourKgTarget);
  addItem('cooking_salt', saltKgTarget);
  addItem('grocery_sugar', sugarKgTarget);
  addItem('produce_potato', potatoKgTarget);
  addItem('produce_onion', onionKgTarget);
  addItem('cleaning_soap', soapPcs);
  addItem('cleaning_detergent', detergentKg);
  addItem('household_tissue', tissuePacks);

  return items;
}

/**
 * 2. Real-Time Basket Totals & Savings Calculation
 */
export function calculateBasketSavings(items: BasketItem[]) {
  let totalMasikPrice = 0;
  let totalMarketPrice = 0;

  for (const item of items) {
    totalMasikPrice += item.unitMasikPrice * item.quantity;
    totalMarketPrice += item.unitMrp * item.quantity;
  }

  const totalSavings = Math.max(0, totalMarketPrice - totalMasikPrice);
  const savingsPercentage = totalMarketPrice > 0 ? Math.round((totalSavings / totalMarketPrice) * 100) : 0;

  return {
    totalMasikPrice,
    totalMarketPrice,
    totalSavings,
    savingsPercentage,
  };
}

/**
 * 3. Budget Optimization & Smart Product Substitution Engine
 * If basket total exceeds customer's target budget, greedily substitutes
 * premium or higher-cost items with verified high-value/economy alternatives
 * until budget constraint is satisfied.
 */
export function optimizeBasketForBudget(
  items: BasketItem[],
  targetBudget: number,
  substitutions: ProductSubstitution[]
): {
  optimizedItems: BasketItem[];
  isOptimized: boolean;
  swappedItemsCount: number;
  finalTotal: number;
  originalTotal: number;
} {
  const currentTotals = calculateBasketSavings(items);
  const originalTotal = currentTotals.totalMasikPrice;

  if (originalTotal <= targetBudget || targetBudget <= 0) {
    return {
      optimizedItems: [...items],
      isOptimized: false,
      swappedItemsCount: 0,
      finalTotal: originalTotal,
      originalTotal,
    };
  }

  let runningTotal = originalTotal;
  let swappedCount = 0;
  const optimizedItems = items.map((item) => ({ ...item }));

  // Find economy saver substitutions sorted by maximum price reduction
  const savingsSubstitutions = [...substitutions]
    .filter((s) => s.type === SubstitutionType.ECONOMY_SAVER && s.priceDelta < 0)
    .sort((a, b) => a.priceDelta - b.priceDelta); // Most savings first

  for (const sub of savingsSubstitutions) {
    if (runningTotal <= targetBudget) break;

    const targetIndex = optimizedItems.findIndex((i) => i.variantId === sub.primaryVariantId);
    if (targetIndex !== -1 && sub.substituteVariant) {
      const item = optimizedItems[targetIndex];
      const priceReductionPerUnit = Math.abs(sub.priceDelta);
      const totalItemSavings = priceReductionPerUnit * item.quantity;

      // Swap item to lower-cost alternative
      optimizedItems[targetIndex] = {
        ...item,
        variantId: sub.substituteVariantId,
        unitMasikPrice: sub.substituteVariant.masikPrice,
        unitMrp: sub.substituteVariant.mrp,
      };

      runningTotal -= totalItemSavings;
      swappedCount++;
    }
  }

  return {
    optimizedItems,
    isOptimized: swappedCount > 0,
    swappedItemsCount: swappedCount,
    finalTotal: runningTotal,
    originalTotal,
  };
}

/**
 * 4. Margin Protection Validator
 * Guarantees that selling prices never violate business viability thresholds.
 */
export function validateMarginProtection(
  purchaseCost: number,
  sellingPrice: number,
  minMarginPercent: number = 8
): { isAllowed: boolean; minSellingPrice: number; currentMarginPercent: number } {
  const minSellingPrice = Math.round(purchaseCost * (1 + minMarginPercent / 100));
  const currentMarginPercent = purchaseCost > 0 ? ((sellingPrice - purchaseCost) / sellingPrice) * 100 : 0;
  const isAllowed = sellingPrice >= minSellingPrice;

  return {
    isAllowed,
    minSellingPrice,
    currentMarginPercent: Math.round(currentMarginPercent * 10) / 10,
  };
}

/**
 * 5. Intelligent Missing Product Detection Engine (Section 21 PRD)
 * Compares current basket contents against historical high-frequency staples.
 * If a customer normally buys an item in >= 60% of past monthly markets, but it's
 * missing in the current draft, generates an intelligent alert.
 */
export interface HistoricalStapleProfile {
  variantId: string;
  nameEn: string;
  nameBn: string;
  category: string;
  unitMasikPrice: number;
  unitMrp: number;
  purchaseFrequencyPercent: number; // e.g. 85%
  typicalQuantity: number;
}

export function detectMissingStaples(
  currentBasketVariantIds: string[],
  historicalStaples: HistoricalStapleProfile[]
): {
  missingStaples: HistoricalStapleProfile[];
  alertMessageBn?: string;
  alertMessageEn?: string;
} {
  const presentSet = new Set(currentBasketVariantIds);
  const missing = historicalStaples.filter(
    (h) => h.purchaseFrequencyPercent >= 60 && !presentSet.has(h.variantId)
  );

  if (missing.length === 0) {
    return { missingStaples: [] };
  }

  const first = missing[0];
  return {
    missingStaples: missing,
    alertMessageBn: `আপনি সাধারণত প্রতি মাসে "${first.nameBn}" কিনে থাকেন। এই বাজারের তালিকায় কি যোগ করতে চান?`,
    alertMessageEn: `You usually buy "${first.nameEn}" with your monthly market. Would you like to add it?`,
  };
}

/**
 * 6. Household Consumption Prediction Engine (Section 22 PRD)
 * Calculates moving-average consumption cycles and predicts estimated depletion dates.
 */
export interface PurchaseRecord {
  variantId: string;
  productNameEn: string;
  productNameBn: string;
  quantity: number;
  purchasedAt: string; // ISO date
}

export function predictDepletionDate(
  records: PurchaseRecord[],
  currentDate: Date = new Date()
): {
  variantId: string;
  productNameEn: string;
  productNameBn: string;
  avgCycleDays: number;
  estimatedDepletionDate: string;
  isRunningLow: boolean;
  daysRemaining: number;
}[] {
  // Group purchases by variantId
  const grouped = new Map<string, PurchaseRecord[]>();
  for (const r of records) {
    const list = grouped.get(r.variantId) || [];
    list.push(r);
    grouped.set(r.variantId, list);
  }

  const results = [];

  for (const [variantId, list] of grouped.entries()) {
    if (list.length < 2) continue; // Need at least 2 points for a cycle

    // Sort ascending by date
    list.sort((a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime());

    let totalIntervalDays = 0;
    for (let i = 1; i < list.length; i++) {
      const prev = new Date(list[i - 1].purchasedAt).getTime();
      const curr = new Date(list[i].purchasedAt).getTime();
      totalIntervalDays += (curr - prev) / (1000 * 60 * 60 * 24);
    }

    const avgCycleDays = Math.round(totalIntervalDays / (list.length - 1));
    const lastPurchaseDate = new Date(list[list.length - 1].purchasedAt);
    const estimatedDepletion = new Date(lastPurchaseDate);
    estimatedDepletion.setDate(estimatedDepletion.getDate() + avgCycleDays);

    const diffDays = Math.round(
      (estimatedDepletion.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    results.push({
      variantId,
      productNameEn: list[0].productNameEn,
      productNameBn: list[0].productNameBn,
      avgCycleDays,
      estimatedDepletionDate: estimatedDepletion.toISOString().split('T')[0],
      isRunningLow: diffDays <= 5,
      daysRemaining: diffDays,
    });
  }

  return results;
}

