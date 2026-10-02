'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { OnboardingWizard, OnboardingState } from '@/components/OnboardingWizard';
import { BasketDisplay, DisplayBasketItem } from '@/components/BasketDisplay';
import { SavingsDashboard } from '@/components/SavingsDashboard';
import { MealPlanner } from '@/components/MealPlanner';
import { B2bCorporateMess } from '@/components/B2bCorporateMess';
import { ProductCatalog } from '@/components/ProductCatalog';
import { CartDrawer } from '@/components/CartDrawer';
import { FloatingCartBar } from '@/components/FloatingCartBar';
import { Footer } from '@/components/Footer';
import {
  ShoppingBag,
  Store,
  Package,
  ChefHat,
  Building2,
  Award,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { CookingFrequency, FoodPreference, MarketTier } from '@masik/shared-types';
import { DEFAULT_INVENTORY_PRODUCTS, InventoryItem } from '@masik/business-rules';
import { formatPrice, formatNumber } from '@/utils/formatters';

export default function HomePage() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  // Household Onboarding State
  const [onboarding, setOnboarding] = useState<OnboardingState>({
    size: 4,
    adults: 2,
    children: 2,
    cookingFreq: CookingFrequency.ALMOST_EVERY_DAY,
    preference: FoodPreference.STANDARD,
    budget: 6000,
    tier: MarketTier.FAMILY,
  });

  // Initial Monthly Market Basket (Calibrated for Dhaka family of 4)
  const initialBasketItems: DisplayBasketItem[] = [
    {
      variantId: 'v-rice-chashi-25k',
      nameEn: 'Chashi Premium Miniket Rice',
      nameBn: 'চাষী প্রিমিয়াম মিনিকেট চাল',
      category: 'চাল',
      unit: 'KG',
      unitValue: 25,
      quantity: 1,
      unitMasikPrice: 1980,
      unitMrp: 2150,
      isRecurring: true,
    },
    {
      variantId: 'v-oil-rup-5l',
      nameEn: 'Rupchanda Fortified Soybean Oil',
      nameBn: 'রূপচাঁদা ভোজ্য সয়াবিন তেল',
      category: 'তেল',
      unit: 'LITER',
      unitValue: 5,
      quantity: 1,
      unitMasikPrice: 815,
      unitMrp: 860,
      isRecurring: true,
    },
    {
      variantId: 'v-dal-aci-2k',
      nameEn: 'ACI Pure Desi Masoor Dal',
      nameBn: 'এসিআই পিওর দেশি মসুর ডাল',
      category: 'ডাল',
      unit: 'KG',
      unitValue: 2,
      quantity: 2, // 4kg total
      unitMasikPrice: 310,
      unitMrp: 340,
      isRecurring: true,
    },
    {
      variantId: 'v-flour-fresh-5k',
      nameEn: 'Fresh Whole Wheat Atta',
      nameBn: 'ফ্রেশ লাল গম আটা',
      category: 'আটা',
      unit: 'KG',
      unitValue: 5,
      quantity: 1,
      unitMasikPrice: 295,
      unitMrp: 325,
      isRecurring: true,
    },
    {
      variantId: 'v-potato-5k',
      nameEn: 'Munshiganj Fresh Potato',
      nameBn: 'মুন্সীগঞ্জ ডায়মন্ড আলু ৫ কেজি',
      category: 'আলু',
      unit: 'KG',
      unitValue: 5,
      quantity: 1,
      unitMasikPrice: 230,
      unitMrp: 260,
      isRecurring: true,
    },
    {
      variantId: 'v-onion-5k',
      nameEn: 'Pabna Desi Red Onion',
      nameBn: 'পাবনার দেশি পেঁয়াজ ৫ কেজি',
      category: 'পেঁয়াজ',
      unit: 'KG',
      unitValue: 5,
      quantity: 1,
      unitMasikPrice: 395,
      unitMrp: 450,
      isRecurring: true,
    },
    {
      variantId: 'v-salt-aci-1k',
      nameEn: 'ACI Pure Vacuum Salt',
      nameBn: 'এসিআই পিওর ভ্যাকিউম লবণ',
      category: 'লবণ',
      unit: 'KG',
      unitValue: 1,
      quantity: 2,
      unitMasikPrice: 38,
      unitMrp: 42,
      isRecurring: true,
    },
    {
      variantId: 'v-sugar-fresh-2k',
      nameEn: 'Fresh White Refined Sugar',
      nameBn: 'ফ্রেশ পরিশোধিত চিনি ২ কেজি',
      category: 'চিনি',
      unit: 'KG',
      unitValue: 2,
      quantity: 1,
      unitMasikPrice: 288,
      unitMrp: 310,
      isRecurring: true,
    },
    {
      variantId: 'v-radhuni-spices',
      nameEn: 'Radhuni Spices Combo (Turmeric + Chili)',
      nameBn: 'রাঁধুনী হলুদ ও মরিচ গুঁড়া ৫০০ গ্রাম প্যাক',
      category: 'মসলা',
      unit: 'PACK',
      unitValue: 1,
      quantity: 1,
      unitMasikPrice: 595,
      unitMrp: 640,
      isRecurring: true,
    },
    {
      variantId: 'v-det-wheel-2k',
      nameEn: 'Wheel 2in1 Washing Powder',
      nameBn: 'হুইল ডিটারজেন্ট পাউডার ২ কেজি',
      category: 'পরিচ্ছন্নতা',
      unit: 'KG',
      unitValue: 2,
      quantity: 1,
      unitMasikPrice: 330,
      unitMrp: 360,
      isRecurring: true,
    },
    {
      variantId: 'v-soap-lifebuoy-4p',
      nameEn: 'Lifebuoy Total Soap Bar (4-Pack)',
      nameBn: 'লাইফবয় টোটাল সাবান ৪টি প্যাক',
      category: 'ব্যক্তিগত যত্ন',
      unit: 'PACK',
      unitValue: 4,
      quantity: 1,
      unitMasikPrice: 218,
      unitMrp: 240,
      isRecurring: true,
    },
    {
      variantId: 'v-tissue-bash-4p',
      nameEn: 'Bashundhara Facial Tissue (4-Pack)',
      nameBn: 'বসুন্ধরা ফেসিয়াল টিস্যু ৪ প্যাক',
      category: 'গৃহস্থালী টিস্যু',
      unit: 'PACK',
      unitValue: 4,
      quantity: 1,
      unitMasikPrice: 250,
      unitMrp: 280,
      isRecurring: true,
    },
  ];

  const [basketItems, setBasketItems] = useState<DisplayBasketItem[]>(initialBasketItems);
  const [isBudgetOptimized, setIsBudgetOptimized] = useState(false);
  const [swappedCount, setSwappedCount] = useState(0);

  // Background Inventory Catalog (defaults + items added in background via Admin)
  const [inventoryCatalog, setInventoryCatalog] = useState<InventoryItem[]>(DEFAULT_INVENTORY_PRODUCTS);

  // Sync with background inventory updates from Admin portal
  useEffect(() => {
    const syncCatalog = () => {
      try {
        const stored = localStorage.getItem('masik_inventory_catalog');
        if (stored) {
          const parsed: InventoryItem[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const defaultMap = new Map(DEFAULT_INVENTORY_PRODUCTS.map((p) => [p.id, p]));
            const merged = parsed.map((item) => {
              const def = defaultMap.get(item.id);
              return def ? { ...def, ...item } : item;
            });
            const mergedIds = new Set(merged.map((m) => m.id));
            for (const def of DEFAULT_INVENTORY_PRODUCTS) {
              if (!mergedIds.has(def.id)) {
                merged.push(def);
              }
            }
            setInventoryCatalog(merged);
          }
        }
      } catch {
        // fallback to defaults
      }
    };

    syncCatalog();
    window.addEventListener('storage', syncCatalog);
    window.addEventListener('inventory_updated', syncCatalog);
    return () => {
      window.removeEventListener('storage', syncCatalog);
      window.removeEventListener('inventory_updated', syncCatalog);
    };
  }, []);

  // Recalculate totals
  const totalMasik = basketItems.reduce((acc, i) => acc + i.unitMasikPrice * i.quantity, 0);
  const totalMarket = basketItems.reduce((acc, i) => acc + i.unitMrp * i.quantity, 0);
  const totalSavings = Math.max(0, totalMarket - totalMasik);

  const handleUpdateQty = (variantId: string, delta: number) => {
    setBasketItems((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
    );
  };

  const handleRemoveItem = (variantId: string) => {
    setBasketItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  // Budget Optimization Solver (Section 11, 12 & 13 of PRD)
  const handleOptimizeBudget = () => {
    let actuallySwapped = 0;
    // Swaps branded products to Masher Essentials high-quality equivalents
    const optimized = basketItems.map((item) => {
      if (item.variantId === 'v-oil-rup-5l') {
        actuallySwapped++;
        return {
          ...item,
          variantId: 'v-oil-mb-5l',
          nameEn: 'Masher Essentials Fortified Soybean Oil',
          nameBn: 'মাসের বাজার এসেনশিয়ালস সয়াবিন তেল ৫লি',
          unitMasikPrice: 775, // saves ৳40
          unitMrp: 860,
        };
      }
      if (item.variantId === 'v-rice-chashi-25k') {
        actuallySwapped++;
        return {
          ...item,
          variantId: 'v-rice-mb-25k',
          nameEn: 'Masher Essentials Miniket Rice 25kg',
          nameBn: 'মাসের বাজার এসেনশিয়ালস মিনিকেট চাল ২৫ কেজি',
          unitMasikPrice: 1890, // saves ৳90
          unitMrp: 2100,
        };
      }
      if (item.variantId === 'v-dal-aci-2k') {
        actuallySwapped++;
        return {
          ...item,
          variantId: 'v-dal-mb-2k',
          nameEn: 'Masher Essentials Desi Masoor Dal 2kg',
          nameBn: 'মাসের বাজার এসেনশিয়ালস দেশি মসুর ডাল ২ কেজি',
          unitMasikPrice: 285, // saves ৳25 x 2 = ৳50
          unitMrp: 330,
        };
      }
      if (item.variantId === 'v-flour-fresh-5k') {
        actuallySwapped++;
        return {
          ...item,
          variantId: 'v-flour-mb-5k',
          nameEn: 'Masher Essentials Brown Atta 5kg',
          nameBn: 'মাসের বাজার এসেনশিয়ালস লাল আটা ৫ কেজি',
          unitMasikPrice: 275, // saves ৳20
          unitMrp: 310,
        };
      }
      return item;
    });

    setBasketItems(optimized);
    setIsBudgetOptimized(true);
    setSwappedCount(actuallySwapped);
  };

  // AI Prompt Handler
  const handleQuickAiPrompt = (prompt: string) => {
    let size = 4;
    let budget = 6000;
    if (prompt.includes('২') || prompt.includes('2')) size = 2;
    if (prompt.includes('৫') || prompt.includes('5') || prompt.includes('৬') || prompt.includes('6')) size = 6;
    if (prompt.includes('৫ হাজার') || prompt.includes('5000')) budget = 5000;
    if (prompt.includes('৭ হাজার') || prompt.includes('7000')) budget = 7000;

    const pref = prompt.includes('রুটি')
      ? FoodPreference.ROTI_HEAVY
      : prompt.includes('ভাত')
      ? FoodPreference.RICE_HEAVY
      : FoodPreference.STANDARD;

    setOnboarding((prev) => ({
      ...prev,
      size,
      budget,
      preference: pref,
    }));

    handleGenerateFromOnboarding(size, pref);
  };

  // Generate From Wizard
  const handleGenerateFromOnboarding = (sizeOverride?: number, prefOverride?: FoodPreference) => {
    const effectiveSize = sizeOverride !== undefined ? sizeOverride : onboarding.size;
    const effectivePref = prefOverride !== undefined ? prefOverride : onboarding.preference;
    const scale = effectiveSize / 4;
    const isRoti = effectivePref === FoodPreference.ROTI_HEAVY;
    const isRice = effectivePref === FoodPreference.RICE_HEAVY;
    const isLowCooking =
      onboarding.cookingFreq === CookingFrequency.TWO_TO_THREE_DAYS ||
      onboarding.cookingFreq === CookingFrequency.OCCASIONALLY;
    const cookingFactor = isLowCooking ? 0.7 : 1.0;

    const recalculated = initialBasketItems.map((item) => {
      let qty = item.quantity;
      const cat = item.category;

      if (cat === 'চাল') {
        const targetKg = Math.round(effectiveSize * (isRice ? 7.0 : 5.5) * cookingFactor);
        qty = Math.max(1, Math.round(targetKg / 25));
      } else if (cat === 'তেল') {
        const targetL = Math.round((1.25 + effectiveSize * 0.85) * cookingFactor);
        qty = Math.max(1, Math.round(targetL / 5));
      } else if (cat === 'আটা') {
        const targetKg = Math.round(effectiveSize * (isRoti ? 3.5 : 1.5) * cookingFactor);
        qty = Math.max(1, Math.round(targetKg / 5));
      } else if (cat === 'ডাল') {
        const targetKg = Math.round(effectiveSize * 0.8 * cookingFactor);
        qty = Math.max(1, Math.round(targetKg / 2));
      } else if (cat === 'আলু' || cat === 'পেঁয়াজ') {
        const targetKg = Math.round(effectiveSize * 1.5 * cookingFactor);
        qty = Math.max(1, Math.round(targetKg / 5));
      } else if (cat === 'লবণ') {
        qty = effectiveSize >= 6 ? 3 : effectiveSize <= 2 ? 1 : 2;
      } else if (cat === 'চিনি') {
        qty = effectiveSize >= 5 ? 2 : 1;
      } else if (cat === 'ব্যক্তিগত যত্ন' || cat === 'গৃহস্থালী টিস্যু') {
        qty = effectiveSize >= 5 ? 2 : 1;
      } else if (cat === 'পরিচ্ছন্নতা') {
        qty = effectiveSize >= 5 ? 2 : 1;
      } else if (cat === 'মসলা') {
        qty = effectiveSize >= 6 ? 2 : 1;
      } else {
        qty = Math.max(1, Math.round(item.quantity * scale));
      }

      return { ...item, quantity: qty };
    });

    setBasketItems(recalculated);
    setIsBudgetOptimized(false);
    setSwappedCount(0);
  };

  // 1-Tap Repeat Last Month (Section 20 PRD)
  const handleRepeatLastMarket = () => {
    setBasketItems(initialBasketItems);
    setIsBudgetOptimized(false);
    window.scrollTo({ top: 750, behavior: 'smooth' });
  };

  // Add Item to Basket (e.g. from Missing Staple Alert or Catalog)
  const handleAddItem = (newItem: DisplayBasketItem) => {
    setBasketItems((prev) => {
      const exists = prev.find((i) => i.variantId === newItem.variantId);
      if (exists) {
        return prev.map((i) => (i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [newItem, ...prev];
    });
  };

  // Swap / Change Product in Basket with Alternative from Inventory
  const handleSwapItem = (oldVariantId: string, newItem: DisplayBasketItem) => {
    setBasketItems((prev) => {
      const oldItem = prev.find((i) => i.variantId === oldVariantId);
      const preservedQty = oldItem ? oldItem.quantity : newItem.quantity;
      const alreadyExists = prev.find((i) => i.variantId === newItem.variantId && i.variantId !== oldVariantId);

      if (alreadyExists) {
        // Merge quantities with existing entry and remove old variant
        return prev
          .filter((i) => i.variantId !== oldVariantId)
          .map((i) =>
            i.variantId === newItem.variantId
              ? { ...i, quantity: i.quantity + preservedQty }
              : i
          );
      }

      return prev.map((item) => {
        if (item.variantId === oldVariantId) {
          return {
            ...newItem,
            quantity: preservedQty,
          };
        }
        return item;
      });
    });
    setSwappedCount((prev) => prev + 1);
  };

  // Meal Planner Calculation Handler (Section 67 PRD)
  const handleGenerateFromMealPlan = (needs: {
    riceKg: number;
    oilLiters: number;
    dalKg: number;
    attaKg: number;
  }) => {
    setBasketItems((prev) =>
      prev.map((item) => {
        if (item.category === 'চাল' || item.category.toLowerCase().includes('rice')) {
          const unitVal = item.unitValue || 25;
          const sacks = Math.max(1, Math.ceil(needs.riceKg / unitVal));
          return { ...item, quantity: sacks };
        }
        if (item.category === 'তেল' || item.category.toLowerCase().includes('oil')) {
          const unitVal = item.unitValue || 5;
          const bottles = Math.max(1, Math.ceil(needs.oilLiters / unitVal));
          return { ...item, quantity: bottles };
        }
        if (item.category === 'ডাল' || item.category.toLowerCase().includes('dal')) {
          const unitVal = item.unitValue || 2;
          const packs = Math.max(1, Math.ceil(needs.dalKg / unitVal));
          return { ...item, quantity: packs };
        }
        if (item.category === 'আটা' || item.category.toLowerCase().includes('atta') || item.category.toLowerCase().includes('flour')) {
          const unitVal = item.unitValue || 5;
          const packs = Math.max(1, Math.ceil(needs.attaKg / unitVal));
          return { ...item, quantity: packs };
        }
        return item;
      })
    );
    const basketEl = document.getElementById('basket-section');
    if (basketEl) basketEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Mess Bulk Basket Handler (Section 70 PRD)
  const handleApplyMessBasket = (messItems: DisplayBasketItem[]) => {
    setBasketItems(messItems);
    const total = messItems.reduce((acc, i) => acc + i.unitMasikPrice * i.quantity, 0);
    setOnboarding((prev) => ({ ...prev, budget: total + 1000, size: 6 }));
    const basketEl = document.getElementById('basket-section');
    if (basketEl) basketEl.scrollIntoView({ behavior: 'smooth' });
  };

  const [storeView, setStoreView] = useState<'catalog' | 'bundles' | 'meal_planner' | 'mess_b2b' | 'savings'>('catalog');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Navigation Bar with Cart Button */}
        <Navbar
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
          basketCount={basketItems.length}
          totalSavings={totalSavings}
          totalMasik={totalMasik}
          onOpenCart={() => setIsCartDrawerOpen(true)}
        />

        {/* Hero Banner with Shortcuts & Presets */}
        <Hero
          lang={lang}
          selectedSize={onboarding.size}
          onQuickAiPrompt={(prompt) => {
            handleQuickAiPrompt(prompt);
            setStoreView('catalog');
          }}
          onSelectFamilyPreset={(size, budget) => {
            setOnboarding((prev) => ({ ...prev, size, budget }));
            handleGenerateFromOnboarding(size);
            setStoreView('catalog');
          }}
        />

        {/* Main Shopping Storefront Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
          {/* E-Commerce Store Navigation Tabs */}
          <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md p-2 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setStoreView('catalog')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  storeView === 'catalog'
                    ? 'bg-masik-700 text-white shadow-md shadow-masik-700/25 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{lang === 'bn' ? '🛍️ সব গ্রোসারি পণ্য' : '🛍️ All Groceries'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStoreView('bundles')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  storeView === 'bundles'
                    ? 'bg-masik-700 text-white shadow-md shadow-masik-700/25 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{lang === 'bn' ? '📦 ১-ক্লিক ফ্যামিলি বান্ডেল' : '📦 1-Click Family Bundles'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStoreView('meal_planner')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  storeView === 'meal_planner'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>{lang === 'bn' ? '🍳 AI মিল প্ল্যানার' : '🍳 AI Meal-to-Market'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStoreView('mess_b2b')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  storeView === 'mess_b2b'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{lang === 'bn' ? '🏢 মেস ও করপোরেট' : '🏢 Mess & Corporate B2B'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStoreView('savings')}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  storeView === 'savings'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{lang === 'bn' ? '🎁 সেভিংস ও রিওয়ার্ড' : '🎁 Savings & Rewards'}</span>
              </button>
            </div>

            {/* Jump to Cart Pill */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-masik-50 text-masik-900 hover:bg-masik-100 text-xs font-black border border-masik-200 transition-all cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-masik-700" />
              <span>
                {lang === 'bn' ? 'ঝুড়ি দেখুন' : 'View Cart'} ({formatNumber(basketItems.length, lang)})
              </span>
            </button>
          </div>

          {/* Active Shopping Section Content */}
          {storeView === 'catalog' && (
            <div className="space-y-12">
              {/* Product Catalog Grid */}
              <section id="catalog-section" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {lang === 'bn' ? 'মাসের বাজার পণ্য ও ক্যাটালগ' : 'Monthly Grocery Storefront'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {lang === 'bn'
                        ? 'সরাসরি প্রস্তুতকারক ও মিল থেকে পাইকারি মূল্যে চাল, ডাল, তেল ও নিত্যপ্রয়োজনীয় পণ্য।'
                        : 'Authentic staples at wholesale rates direct from mills and FMCG distributors.'}
                    </p>
                  </div>

                  <span className="text-xs text-masik-700 font-bold bg-masik-50 border border-masik-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    ✓ {lang === 'bn' ? 'টুইন প্রাইস: পাইকারি সাশ্রয় নিশ্চিত' : 'Twin-Price: Guaranteed Wholesale Savings'}
                  </span>
                </div>

                <ProductCatalog
                  lang={lang}
                  catalog={inventoryCatalog}
                  basketItems={basketItems}
                  onAddItem={handleAddItem}
                  onUpdateQty={handleUpdateQty}
                  searchQuery={catalogSearch}
                  onSearchChange={setCatalogSearch}
                />
              </section>

              {/* 1-Click Monthly Supply Feature Callout Banner */}
              <div className="bg-gradient-to-r from-masik-900 via-masik-800 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-masik-700">
                <div>
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-300 block mb-1">
                    {lang === 'bn' ? 'স্মার্ট মাসিক সেবা' : 'Smart Household Provisioning'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mb-2">
                    {lang === 'bn'
                      ? 'এক ক্লিকে পুরো মাসের বাজার প্রস্তুত করতে চান?'
                      : 'Need your entire monthly grocery prepared in 1 click?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                    {lang === 'bn'
                      ? 'আপনার পরিবারের লোকসংখ্যা ও রান্নার অভ্যাস জানালেই আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে চাল, ডাল, তেলসহ ১২টি অত্যাবশ্যকীয় ক্যাটাগরি হিসাব করে ঝুড়ি সাজিয়ে দেয়।'
                      : 'Select your family size and preferences — our business engine calculates a calibrated 30-day supply of all 12 core pantry staples.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStoreView('bundles')}
                    className="px-5 py-3 rounded-2xl bg-white text-masik-950 font-black text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
                  >
                    {lang === 'bn' ? 'পারিবারিক বান্ডেল তৈরি করুন' : 'Configure Family Pack'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoreView('meal_planner')}
                    className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    {lang === 'bn' ? 'AI মিল প্ল্যানার দেখুন' : 'Try AI Meal Planner'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {storeView === 'bundles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === 'bn' ? 'পারিবারিক মাসিক বাজার বান্ডেল কনফিগারেটর' : 'Household Monthly Bundle Configurator'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? 'পরিবারের সদস্য সংখ্যা ও খাবারের পছন্দ অনুযায়ী এক ক্লিকে সম্পূর্ণ মাসের বাজার তৈরি করুন।'
                      : 'Calibrate customized staples tailored to your household size and eating habits.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreView('catalog')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← {lang === 'bn' ? 'ক্যাটালগে ফিরে যান' : 'Back to Catalog'}
                </button>
              </div>

              <OnboardingWizard
                lang={lang}
                state={onboarding}
                onChange={(updates) => setOnboarding((prev) => ({ ...prev, ...updates }))}
                onGenerate={() => {
                  handleGenerateFromOnboarding(onboarding.size);
                  setStoreView('catalog');
                  const basketEl = document.getElementById('basket-section');
                  if (basketEl) basketEl.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {storeView === 'meal_planner' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === 'bn' ? 'AI মিল প্ল্যানার থেকে সরাসরি বাজার' : 'AI Weekly Meal-to-Market Converter'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? 'সাপ্তাহিক খাবারের মেনু নির্ধারণ করুন — সিস্টেম স্বয়ংক্রিয়ভাবে চাল, তেল, ডাল ও আটার পরিমাণ গণনা করবে।'
                      : 'Plan your weekly household meals and let our AI calculate raw staple quantities.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreView('catalog')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← {lang === 'bn' ? 'ক্যাটালগে ফিরে যান' : 'Back to Catalog'}
                </button>
              </div>

              <MealPlanner
                lang={lang}
                onGenerateFromMealPlan={(needs) => {
                  handleGenerateFromMealPlan(needs);
                  setStoreView('catalog');
                  const basketEl = document.getElementById('basket-section');
                  if (basketEl) basketEl.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {storeView === 'mess_b2b' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === 'bn' ? 'ব্যাচেলর মেস ও করপোরেট অফিস প্যান্ট্রি বাজার' : 'Bachelor Mess & Corporate Office Pantry'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? '৫০ কেজি বস্তা চাল ও ১৬ লিটার তেলে মেস খরচ ভাগাভাগি এবং অফিস প্যান্ট্রির জন্য মুশক-৬.৩ ভ্যাট চালান।'
                      : 'Bulk quota split for Dhaka bachelor flats and Net-30 credit corporate supply.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreView('catalog')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← {lang === 'bn' ? 'ক্যাটালগে ফিরে যান' : 'Back to Catalog'}
                </button>
              </div>

              <B2bCorporateMess
                lang={lang}
                onApplyMessBasket={(items) => {
                  handleApplyMessBasket(items);
                  setStoreView('catalog');
                  const basketEl = document.getElementById('basket-section');
                  if (basketEl) basketEl.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {storeView === 'savings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === 'bn' ? 'সেভিংস ড্যাশবোর্ড ও রেফারাল রিওয়ার্ড' : 'Savings Intelligence & Referral Wallet'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? 'আপনার অর্জিত লাইফটাইম সাশ্রয়, ওয়ালেট ক্যাশব্যাক ক্রেডিট এবং প্রতিবেশী রেফারাল বোনাস।'
                      : 'Track cumulative savings, wallet cashback credits, and neighbor referral rewards.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreView('catalog')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← {lang === 'bn' ? 'ক্যাটালগে ফিরে যান' : 'Back to Catalog'}
                </button>
              </div>

              <SavingsDashboard
                lang={lang}
                onRepeatLastMarket={handleRepeatLastMarket}
              />
            </div>
          )}

          {/* Basket Review & Checkout Section */}
          <div id="basket-section" className="pt-8 border-t border-slate-200/80">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-masik-700" />
                  <span>{lang === 'bn' ? 'আপনার বর্তমান বাজার ঝুড়ি ও অর্ডার চেকআউট' : 'Your Basket & Checkout'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {lang === 'bn'
                    ? 'প্রয়োজনে পরিমাণ পরিবর্তন করুন, বাজেট অপটিমাইজ করুন এবং ঢাকার ঠিকানায় অর্ডার প্লেস করুন।'
                    : 'Adjust items, optimize budget, and place your order with free delivery.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStoreView('catalog')}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-masik-50 text-masik-800 hover:bg-masik-100 text-xs font-bold border border-masik-200 transition-all cursor-pointer"
              >
                + {lang === 'bn' ? 'আরও পণ্য যোগ করুন' : 'Add More Products'}
              </button>
            </div>

            <BasketDisplay
              lang={lang}
              items={basketItems}
              budget={onboarding.budget}
              availableInventory={inventoryCatalog}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onAddItem={handleAddItem}
              onSwapItem={handleSwapItem}
              onOptimizeBudget={handleOptimizeBudget}
              isBudgetOptimized={isBudgetOptimized}
              swappedCount={swappedCount}
            />
          </div>

          {/* Savings Intelligence Summary (always visible at bottom) */}
          {storeView !== 'savings' && (
            <SavingsDashboard
              lang={lang}
              onRepeatLastMarket={handleRepeatLastMarket}
            />
          )}
        </main>
      </div>

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        lang={lang}
        items={basketItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onOptimizeBudget={handleOptimizeBudget}
        isBudgetOptimized={isBudgetOptimized}
        swappedCount={swappedCount}
        onProceedToCheckout={() => {
          document.getElementById('basket-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        lang={lang}
        itemCount={basketItems.length}
        totalMasik={totalMasik}
        totalSavings={totalSavings}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
