import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateMonthlyBasket,
  calculateBasketSavings,
  optimizeBasketForBudget,
  validateMarginProtection,
  predictDepletionDate,
  detectMissingStaples,
  CatalogVariantRef,
  HistoricalStapleProfile,
  PurchaseRecord,
} from './index.js';
import {
  CookingFrequency,
  FoodPreference,
  MarketTier,
  Household,
  ProductUnit,
  BasketItem,
  ProductSubstitution,
  SubstitutionType,
} from '@masik/shared-types';

describe('Phase 11 Enterprise Test Suite: Business Rules & Computational Engines', () => {
  const mockCatalog: CatalogVariantRef[] = [
    {
      variantId: 'v-rice-chashi-25k',
      sku: 'RICE-CHASHI-25K',
      categorySlug: 'staples_rice',
      nameEn: 'Chashi Miniket Rice 25kg',
      unit: ProductUnit.KG,
      unitValue: 25,
      masikPrice: 1980,
      mrp: 2150,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-oil-rup-5l',
      sku: 'OIL-RUP-5L',
      categorySlug: 'cooking_oil',
      nameEn: 'Rupchanda Soybean Oil 5L',
      unit: ProductUnit.LITER,
      unitValue: 5,
      masikPrice: 815,
      mrp: 860,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-dal-aci-2k',
      sku: 'DAL-ACI-2K',
      categorySlug: 'staples_lentils',
      nameEn: 'ACI Masoor Dal 2kg',
      unit: ProductUnit.KG,
      unitValue: 2,
      masikPrice: 310,
      mrp: 340,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-flour-fresh-5k',
      sku: 'FLOUR-FRESH-5K',
      categorySlug: 'staples_flour',
      nameEn: 'Fresh Whole Wheat Atta 5kg',
      unit: ProductUnit.KG,
      unitValue: 5,
      masikPrice: 295,
      mrp: 325,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-det-wheel-2k',
      sku: 'DET-WHEEL-2K',
      categorySlug: 'cleaning_detergent',
      nameEn: 'Wheel Detergent 2kg',
      unit: ProductUnit.KG,
      unitValue: 2,
      masikPrice: 330,
      mrp: 360,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-potato-5k',
      sku: 'POTATO-5K',
      categorySlug: 'produce_potato',
      nameEn: 'Munshiganj Potato 5kg',
      unit: ProductUnit.KG,
      unitValue: 5,
      masikPrice: 230,
      mrp: 260,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-onion-5k',
      sku: 'ONION-5K',
      categorySlug: 'produce_onion',
      nameEn: 'Pabna Onion 5kg',
      unit: ProductUnit.KG,
      unitValue: 5,
      masikPrice: 395,
      mrp: 450,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-salt-aci-1k',
      sku: 'SALT-ACI-1K',
      categorySlug: 'cooking_salt',
      nameEn: 'ACI Salt 1kg',
      unit: ProductUnit.KG,
      unitValue: 1,
      masikPrice: 38,
      mrp: 42,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-sugar-fresh-2k',
      sku: 'SUGAR-FRESH-2K',
      categorySlug: 'grocery_sugar',
      nameEn: 'Fresh Sugar 2kg',
      unit: ProductUnit.KG,
      unitValue: 2,
      masikPrice: 288,
      mrp: 310,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-soap-life-4p',
      sku: 'SOAP-LIFE-4P',
      categorySlug: 'cleaning_soap',
      nameEn: 'Lifebuoy Soap 4p',
      unit: ProductUnit.PACK,
      unitValue: 4,
      masikPrice: 218,
      mrp: 240,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
    {
      variantId: 'v-tissue-bash-4p',
      sku: 'TISSUE-BASH-4P',
      categorySlug: 'household_tissue',
      nameEn: 'Bashundhara Tissue 4p',
      unit: ProductUnit.PACK,
      unitValue: 4,
      masikPrice: 250,
      mrp: 280,
      marketTier: MarketTier.FAMILY,
      isStaple: true,
    },
  ];

  it('1. should generate calibrated monthly basket for standard Dhaka family of 4', () => {
    const household: Household = {
      id: 'h-test-1',
      customerId: 'c-test-1',
      householdName: 'Rahman Family',
      householdSize: 4,
      adultCount: 2,
      childCount: 2,
      elderlyCount: 0,
      cookingFrequency: CookingFrequency.ALMOST_EVERY_DAY,
      foodPreference: FoodPreference.STANDARD,
      defaultMonthlyBudget: 6000,
      marketTier: MarketTier.FAMILY,
      createdAt: new Date().toISOString(),
    };

    const items = generateMonthlyBasket(household, mockCatalog);
    assert.ok(items.length >= 8, 'Basket must contain all staple grocery categories');

    const riceItem = items.find((i) => i.variantId === 'v-rice-chashi-25k');
    assert.ok(riceItem, 'Rice must be included');
    assert.ok(riceItem.quantity >= 15, 'Rice requirement for family of 4 must be at least 15kg');
  });

  it('2. should scale whole wheat atta when household is roti-heavy', () => {
    const standardHousehold: Household = {
      id: 'h-std',
      customerId: 'c-std',
      householdName: 'Standard Diet',
      householdSize: 4,
      adultCount: 2,
      childCount: 2,
      elderlyCount: 0,
      cookingFrequency: CookingFrequency.ALMOST_EVERY_DAY,
      foodPreference: FoodPreference.STANDARD,
      defaultMonthlyBudget: 6000,
      marketTier: MarketTier.FAMILY,
      createdAt: new Date().toISOString(),
    };

    const rotiHousehold: Household = {
      ...standardHousehold,
      foodPreference: FoodPreference.ROTI_HEAVY,
    };

    const stdItems = generateMonthlyBasket(standardHousehold, mockCatalog);
    const rotiItems = generateMonthlyBasket(rotiHousehold, mockCatalog);

    const stdAtta = stdItems.find((i) => i.variantId === 'v-flour-fresh-5k')?.quantity || 0;
    const rotiAtta = rotiItems.find((i) => i.variantId === 'v-flour-fresh-5k')?.quantity || 0;

    assert.ok(rotiAtta > stdAtta, 'Roti-heavy household must allocate more flour than standard household');
  });

  it('3. should calculate Twin Price savings accurately', () => {
    const sampleItems: BasketItem[] = [
      { variantId: 'v-rice-chashi-25k', quantity: 1, isRecurring: true, unitMasikPrice: 1980, unitMrp: 2150 },
      { variantId: 'v-oil-rup-5l', quantity: 1, isRecurring: true, unitMasikPrice: 815, unitMrp: 860 },
    ];

    const result = calculateBasketSavings(sampleItems);
    assert.strictEqual(result.totalMasikPrice, 1980 + 815);
    assert.strictEqual(result.totalMarketPrice, 2150 + 860);
    assert.strictEqual(result.totalSavings, (2150 + 860) - (1980 + 815));
    assert.ok(result.savingsPercentage > 0, 'Savings percentage must be positive');
  });

  it('4. should greedily optimize over-budget baskets via economy substitutions', () => {
    const initialItems: BasketItem[] = [
      { variantId: 'v-oil-rup-5l', quantity: 2, isRecurring: true, unitMasikPrice: 815, unitMrp: 860 },
      { variantId: 'v-rice-chashi-25k', quantity: 2, isRecurring: true, unitMasikPrice: 1980, unitMrp: 2150 },
    ]; // Total = 1630 + 3960 = 5590

    const substitutions: ProductSubstitution[] = [
      {
        id: 'sub-1',
        primaryVariantId: 'v-rice-chashi-25k',
        substituteVariantId: 'v-rice-mb-25k',
        type: SubstitutionType.ECONOMY_SAVER,
        priceDelta: -100, // Saves ৳100 per unit
        substituteVariant: {
          masikPrice: 1880,
          mrp: 2150,
        } as any,
      },
    ];

    const targetBudget = 5400; // Less than 5590
    const optResult = optimizeBasketForBudget(initialItems, targetBudget, substitutions);

    assert.strictEqual(optResult.isOptimized, true);
    assert.strictEqual(optResult.swappedItemsCount, 1);
    assert.strictEqual(optResult.finalTotal, 5590 - 200); // 5390 <= 5400
  });

  it('5. should enforce margin protection floors to prevent loss-making discounts', () => {
    // 8% margin floor
    const safeCheck = validateMarginProtection(1000, 1100, 8); // 10% margin > 8%
    assert.strictEqual(safeCheck.isAllowed, true);

    const breachCheck = validateMarginProtection(1000, 1050, 8); // 5% margin < 8%
    assert.strictEqual(breachCheck.isAllowed, false);
    assert.strictEqual(breachCheck.minSellingPrice, 1080);
  });

  it('6. should predict consumption depletion dates accurately from purchase history', () => {
    const records: PurchaseRecord[] = [
      {
        variantId: 'v-rice-25k',
        productNameEn: 'Miniket Rice 25kg',
        productNameBn: 'মিনিকেট চাল ২৫ কেজি',
        quantity: 1,
        purchasedAt: '2026-08-01T00:00:00.000Z',
      },
      {
        variantId: 'v-rice-25k',
        productNameEn: 'Miniket Rice 25kg',
        productNameBn: 'মিনিকেট চাল ২৫ কেজি',
        quantity: 1,
        purchasedAt: '2026-09-01T00:00:00.000Z',
      },
    ];

    const simulatedNow = new Date('2026-09-25T00:00:00.000Z');
    const predictions = predictDepletionDate(records, simulatedNow);

    assert.strictEqual(predictions.length, 1);
    const ricePred = predictions[0];
    assert.strictEqual(ricePred.avgCycleDays, 31);
    assert.strictEqual(ricePred.estimatedDepletionDate, '2026-10-02');
    assert.strictEqual(ricePred.daysRemaining, 7);
  });

  it('7. should detect missing staple categories when omitted from monthly draft', () => {
    const currentBasketIds = ['v-rice-chashi-25k'];

    const historicalStaples: HistoricalStapleProfile[] = [
      {
        variantId: 'v-oil-rup-5l',
        nameEn: 'Rupchanda Soybean Oil 5L',
        nameBn: 'রূপচাঁদা ভোজ্য তেল ৫ লিটার',
        category: 'cooking_oil',
        unitMasikPrice: 815,
        unitMrp: 860,
        purchaseFrequencyPercent: 90, // Customer buys it 90% of months
        typicalQuantity: 1,
      },
      {
        variantId: 'v-det-wheel-2k',
        nameEn: 'Wheel Detergent 2kg',
        nameBn: 'হুইল ডিটারজেন্ট পাউডার ২ কেজি',
        category: 'cleaning_detergent',
        unitMasikPrice: 330,
        unitMrp: 360,
        purchaseFrequencyPercent: 85,
        typicalQuantity: 1,
      },
    ];

    const missing = detectMissingStaples(currentBasketIds, historicalStaples);
    assert.strictEqual(missing.missingStaples.length, 2);
    assert.ok(missing.alertMessageBn?.includes('রূপচাঁদা'));
    assert.ok(missing.alertMessageEn?.includes('Rupchanda'));
  });
});
