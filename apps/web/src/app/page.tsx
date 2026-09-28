'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { OnboardingWizard, OnboardingState } from '@/components/OnboardingWizard';
import { BasketDisplay, DisplayBasketItem } from '@/components/BasketDisplay';
import { SavingsDashboard } from '@/components/SavingsDashboard';
import { MealPlanner } from '@/components/MealPlanner';
import { B2bCorporateMess } from '@/components/B2bCorporateMess';
import { Footer } from '@/components/Footer';
import { Home, ChefHat, Building2 } from 'lucide-react';
import { CookingFrequency, FoodPreference, MarketTier } from '@masik/shared-types';

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
      category: 'চাল ও ডাল',
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
      category: 'তেল ও ঘি',
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
      category: 'চাল ও ডাল',
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
      category: 'আটা ও ময়দা',
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
      category: 'তাজা আলু ও পেঁয়াজ',
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
      category: 'তাজা আলু ও পেঁয়াজ',
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
      category: 'লবণ ও মসলা',
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
      category: 'চিনি ও মসলা',
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
    // Swaps branded products to Masher Essentials high-quality equivalents
    const optimized = basketItems.map((item) => {
      if (item.variantId === 'v-oil-rup-5l') {
        return {
          ...item,
          variantId: 'v-oil-mb-5l',
          nameEn: 'Masher Essentials Fortified Soybean Oil',
          nameBn: 'মাসের বাজার এসেনশিয়ালস সয়াবিন তেল ৫লি',
          unitMasikPrice: 775, // saves ৳40
        };
      }
      if (item.variantId === 'v-rice-chashi-25k') {
        return {
          ...item,
          variantId: 'v-rice-mb-25k',
          nameEn: 'Masher Essentials Miniket Rice 25kg',
          nameBn: 'মাসের বাজার এসেনশিয়ালস মিনিকেট চাল ২৫ কেজি',
          unitMasikPrice: 1890, // saves ৳90
        };
      }
      if (item.variantId === 'v-dal-aci-2k') {
        return {
          ...item,
          variantId: 'v-dal-mb-2k',
          nameEn: 'Masher Essentials Desi Masoor Dal 2kg',
          nameBn: 'মাসের বাজার এসেনশিয়ালস দেশি মসুর ডাল ২ কেজি',
          unitMasikPrice: 290, // saves ৳20 x 2 = ৳40
        };
      }
      return item;
    });

    setBasketItems(optimized);
    setIsBudgetOptimized(true);
    setSwappedCount(3);
  };

  // AI Prompt Handler
  const handleQuickAiPrompt = (prompt: string) => {
    let size = 4;
    let budget = 6000;
    if (prompt.includes('২') || prompt.includes('2')) size = 2;
    if (prompt.includes('৫') || prompt.includes('5') || prompt.includes('৬') || prompt.includes('6')) size = 6;
    if (prompt.includes('৫ হাজার') || prompt.includes('5000')) budget = 5000;
    if (prompt.includes('৭ হাজার') || prompt.includes('7000')) budget = 7000;

    setOnboarding((prev) => ({
      ...prev,
      size,
      budget,
      preference: prompt.includes('রুটি') ? FoodPreference.ROTI_HEAVY : FoodPreference.STANDARD,
    }));

    handleGenerateFromOnboarding();
  };

  // Generate From Wizard
  const handleGenerateFromOnboarding = () => {
    const scale = onboarding.size / 4;
    const recalculated = initialBasketItems.map((item) => {
      let qty = item.quantity;
      if (item.unit === 'KG' && item.unitValue <= 5) {
        qty = Math.max(1, Math.round(item.quantity * scale));
      }
      return { ...item, quantity: qty };
    });

    setBasketItems(recalculated);
    setIsBudgetOptimized(false);
  };

  // 1-Tap Repeat Last Month (Section 20 PRD)
  const handleRepeatLastMarket = () => {
    setBasketItems(initialBasketItems);
    setIsBudgetOptimized(false);
    window.scrollTo({ top: 750, behavior: 'smooth' });
  };

  // Add Item to Basket (e.g. from Missing Staple Alert)
  const handleAddItem = (newItem: DisplayBasketItem) => {
    setBasketItems((prev) => {
      const exists = prev.find((i) => i.variantId === newItem.variantId);
      if (exists) {
        return prev.map((i) => (i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [newItem, ...prev];
    });
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
        if (item.variantId === 'v-rice-chashi-25k' || item.variantId === 'v-rice-mb-25k') {
          const sacks = Math.max(1, Math.ceil(needs.riceKg / 25));
          return { ...item, quantity: sacks };
        }
        if (item.variantId === 'v-oil-rup-5l' || item.variantId === 'v-oil-mb-5l') {
          const bottles = Math.max(1, Math.ceil(needs.oilLiters / 5));
          return { ...item, quantity: bottles };
        }
        if (item.variantId === 'v-dal-aci-2k' || item.variantId === 'v-dal-mb-2k') {
          const packs = Math.max(1, Math.ceil(needs.dalKg / 2));
          return { ...item, quantity: packs };
        }
        if (item.variantId === 'v-flour-fresh-5k') {
          const packs = Math.max(1, Math.ceil(needs.attaKg / 5));
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

  const [plannerMode, setPlannerMode] = useState<'household' | 'meal_planner' | 'mess_b2b'>('household');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
          basketCount={basketItems.length}
          totalSavings={totalSavings}
        />

        {/* Hero Section */}
        <Hero
          lang={lang}
          onQuickAiPrompt={handleQuickAiPrompt}
          onSelectFamilyPreset={(size, budget) => {
            setOnboarding((prev) => ({ ...prev, size, budget }));
            handleGenerateFromOnboarding();
          }}
        />

        {/* Core Interactive Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
          {/* Planner Mode Switcher Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 px-3 uppercase tracking-wider">
              {lang === 'bn' ? 'বাজার পরিকল্পনা মোড নির্বাচন করুন:' : 'Select Planning Mode:'}
            </span>
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setPlannerMode('household')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  plannerMode === 'household'
                    ? 'bg-masik-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{lang === 'bn' ? 'পারিবারিক অনবোর্ডিং' : 'Household Wizard'}</span>
              </button>

              <button
                onClick={() => setPlannerMode('meal_planner')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  plannerMode === 'meal_planner'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>{lang === 'bn' ? 'AI মিল প্ল্যানার (Section 67)' : 'AI Meal-to-Market'}</span>
              </button>

              <button
                onClick={() => setPlannerMode('mess_b2b')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  plannerMode === 'mess_b2b'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{lang === 'bn' ? 'মেস ও করপোরেট (B2B)' : 'Mess & B2B Corporate'}</span>
              </button>
            </div>
          </div>

          {/* Active Mode Component */}
          {plannerMode === 'household' && (
            <OnboardingWizard
              lang={lang}
              state={onboarding}
              onChange={(updates) => setOnboarding((prev) => ({ ...prev, ...updates }))}
              onGenerate={handleGenerateFromOnboarding}
            />
          )}

          {plannerMode === 'meal_planner' && (
            <MealPlanner
              lang={lang}
              onGenerateFromMealPlan={handleGenerateFromMealPlan}
            />
          )}

          {plannerMode === 'mess_b2b' && (
            <B2bCorporateMess
              lang={lang}
              onApplyMessBasket={handleApplyMessBasket}
            />
          )}

          {/* Basket Display with Budget Optimization, Missing Item Alert & Checkout */}
          <div id="basket-section">
            <BasketDisplay
              lang={lang}
              items={basketItems}
              budget={onboarding.budget}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onAddItem={handleAddItem}
              onOptimizeBudget={handleOptimizeBudget}
              isBudgetOptimized={isBudgetOptimized}
              swappedCount={swappedCount}
            />
          </div>

          {/* Lifetime Savings Intelligence & Repeat Market Dashboard */}
          <SavingsDashboard
            lang={lang}
            onRepeatLastMarket={handleRepeatLastMarket}
          />
        </main>
      </div>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
