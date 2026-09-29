'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Lock,
  ArrowRight,
  TrendingDown,
  CheckCircle,
  Clock,
  Sparkles,
  CreditCard,
  Building,
  RotateCcw,
  ArrowLeftRight,
  Search,
  X,
  Check,
  Filter,
  Tag,
  Boxes,
} from 'lucide-react';
import { BasketItem, PaymentMethod } from '@masik/shared-types';
import { DEFAULT_INVENTORY_PRODUCTS, InventoryItem } from '@masik/business-rules';

export interface DisplayBasketItem extends BasketItem {
  nameEn: string;
  nameBn: string;
  category: string;
  unit: string;
  unitValue: number;
}

interface BasketDisplayProps {
  lang: 'bn' | 'en';
  items: DisplayBasketItem[];
  budget: number;
  availableInventory?: InventoryItem[];
  onUpdateQty: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onAddItem?: (item: DisplayBasketItem) => void;
  onSwapItem?: (oldVariantId: string, newItem: DisplayBasketItem) => void;
  onOptimizeBudget: () => void;
  isBudgetOptimized: boolean;
  swappedCount: number;
}

export const BasketDisplay: React.FC<BasketDisplayProps> = ({
  lang,
  items,
  budget,
  availableInventory,
  onUpdateQty,
  onRemoveItem,
  onAddItem,
  onSwapItem,
  onOptimizeBudget,
  isBudgetOptimized,
  swappedCount,
}) => {
  const [priceLockActive, setPriceLockActive] = useState(false);
  const [useLoyaltyCredits, setUseLoyaltyCredits] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Gulshan');
  const [selectedSlot, setSelectedSlot] = useState('Morning Slot (9 AM – 12 PM)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BKASH);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  // Product Swap & Inventory Catalog Modal States
  const [swapModalItem, setSwapModalItem] = useState<DisplayBasketItem | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalCategory, setModalCategory] = useState<string>('MATCHING');
  const [swapToast, setSwapToast] = useState<string | null>(null);

  const catalog =
    availableInventory && availableInventory.length > 0
      ? availableInventory
      : DEFAULT_INVENTORY_PRODUCTS;

  const allCategories = Array.from(new Set(catalog.map((c) => c.category)));

  const handleOpenSwap = (item: DisplayBasketItem) => {
    setSwapModalItem(item);
    setIsCatalogModalOpen(false);
    setModalSearch('');
    setModalCategory('MATCHING');
  };

  const handleOpenAddCatalog = () => {
    setSwapModalItem(null);
    setIsCatalogModalOpen(true);
    setModalSearch('');
    setModalCategory('ALL');
  };

  const handleSelectSwap = (inv: InventoryItem) => {
    if (!swapModalItem || !onSwapItem) return;
    const newItem: DisplayBasketItem = {
      variantId: inv.variantId,
      nameEn: inv.nameEn,
      nameBn: inv.nameBn,
      category: inv.category,
      unit: inv.unit,
      unitValue: inv.unitValue,
      quantity: swapModalItem.quantity,
      unitMasikPrice: inv.masikPrice,
      unitMrp: inv.mrp,
      isRecurring: true,
    };
    onSwapItem(swapModalItem.variantId, newItem);
    const diff = inv.masikPrice - swapModalItem.unitMasikPrice;
    const diffMsg =
      diff < 0
        ? ` (৳${Math.abs(diff)} সাশ্রয় হলো!)`
        : diff > 0
        ? ` (+৳${diff} প্রিমিয়াম যুক্ত হলো)`
        : '';
    setSwapToast(
      lang === 'bn'
        ? `"${swapModalItem.nameBn}" পরিবর্তন করে "${inv.nameBn}" নির্বাচন করা হয়েছে${diffMsg}`
        : `Swapped "${swapModalItem.nameEn}" with "${inv.nameEn}"`
    );
    setTimeout(() => setSwapToast(null), 4500);
    setSwapModalItem(null);
  };

  const handleSelectAdd = (inv: InventoryItem) => {
    if (!onAddItem) return;
    const newItem: DisplayBasketItem = {
      variantId: inv.variantId,
      nameEn: inv.nameEn,
      nameBn: inv.nameBn,
      category: inv.category,
      unit: inv.unit,
      unitValue: inv.unitValue,
      quantity: 1,
      unitMasikPrice: inv.masikPrice,
      unitMrp: inv.mrp,
      isRecurring: true,
    };
    onAddItem(newItem);
    setSwapToast(
      lang === 'bn'
        ? `"${inv.nameBn}" আপনার বাজারে যোগ করা হয়েছে!`
        : `Added "${inv.nameEn}" to your grocery basket!`
    );
    setTimeout(() => setSwapToast(null), 4000);
    setIsCatalogModalOpen(false);
  };

  const filteredInventory = catalog.filter((prod) => {
    // Exact Category Match for separated categories
    if (swapModalItem && modalCategory === 'MATCHING') {
      if (prod.category !== swapModalItem.category) return false;
    } else if (modalCategory !== 'ALL' && modalCategory !== 'MATCHING') {
      if (prod.category !== modalCategory) return false;
    }

    // Search match
    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase().trim();
      const matchNameEn = prod.nameEn.toLowerCase().includes(q);
      const matchNameBn = prod.nameBn.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      const matchSku = prod.sku.toLowerCase().includes(q);
      if (!matchNameEn && !matchNameBn && !matchBrand && !matchSku) return false;
    }

    return true;
  });

  // Totals & Loyalty Credits (Section 65 PRD)
  const totalMasik = items.reduce((acc, i) => acc + i.unitMasikPrice * i.quantity, 0);
  const totalMarket = items.reduce((acc, i) => acc + i.unitMrp * i.quantity, 0);
  const availableCredits = 150;
  const appliedCredits = useLoyaltyCredits ? Math.min(availableCredits, totalMasik) : 0;
  const payableMasik = totalMasik - appliedCredits;

  const totalSavings = Math.max(0, totalMarket - payableMasik);
  const savingsPercent = totalMarket > 0 ? Math.round((totalSavings / totalMarket) * 100) : 0;
  const isOverBudget = totalMasik > budget;

  // Missing Item Detection (Section 69 PRD)
  const hasDetergent = items.some(
    (i) => i.nameBn.includes('ডিটারজেন্ট') || i.nameEn.toLowerCase().includes('detergent') || i.category.includes('পরিচ্ছন্নতা')
  );
  const hasDal = items.some(
    (i) => i.nameBn.includes('ডাল') || i.nameEn.toLowerCase().includes('dal')
  );

  const handleCheckout = () => {
    const randomOrderNumber = `MB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderConfirmed(randomOrderNumber);
  };

  if (orderConfirmed) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-emerald-200 text-center max-w-2xl mx-auto shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {lang === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
        </h2>
        <p className="text-sm font-semibold text-masik-700 mb-4">
          {lang === 'bn' ? `অর্ডার নম্বর: ${orderConfirmed}` : `Order Number: ${orderConfirmed}`}
        </p>
        <p className="text-sm text-slate-600 mb-6">
          {lang === 'bn'
            ? `আপনার ${selectedZone} ঠিকানায় ${selectedSlot} স্লটে পৌঁছে যাবে। পেমেন্ট মোড: ${paymentMethod}`
            : `Scheduled for delivery to ${selectedZone} during ${selectedSlot}. Payment mode: ${paymentMethod}`}
        </p>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 inline-block mb-6">
          <p className="text-xs font-bold text-amber-900">
            🎉 {lang === 'bn' ? `এই অর্ডারে আপনার সাশ্রয়: ৳${totalSavings.toLocaleString()}` : `Total savings on this order: ৳${totalSavings.toLocaleString()}`}
          </p>
          {appliedCredits > 0 && (
            <p className="text-[11px] font-bold text-emerald-800 mt-1">
              ✓ {lang === 'bn' ? `৳${appliedCredits} মার্কেট ক্রেডিট রিডিম করা হয়েছে` : `৳${appliedCredits} Market Credits successfully redeemed`}
            </p>
          )}
        </div>
        <div>
          <button
            onClick={() => setOrderConfirmed(null)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md"
          >
            {lang === 'bn' ? 'নতুন বাজার তৈরি করুন' : 'Create Another Market'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 8 Columns: Items List */}
      <div className="lg:col-span-8 space-y-4">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-masik-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'bn' ? 'আপনার মাসের বাজারের তালিকা' : 'Your Monthly Grocery Basket'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'bn'
                  ? `${items.length}টি নিত্যপ্রয়োজনীয় খাদ্য ও গৃহস্থালী পণ্য`
                  : `${items.length} staple household and grocery items`}
              </p>
            </div>

            {/* Budget Indicator Alert */}
            {isOverBudget ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  ⚠️ {lang === 'bn' ? `বাজেটের চেয়ে ৳${(totalMasik - budget).toLocaleString()} বেশি` : `৳${(totalMasik - budget).toLocaleString()} over budget`}
                </span>
                <button
                  onClick={onOptimizeBudget}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'বাজেট অপটিমাইজ করুন' : 'Optimize Budget'}</span>
                </button>
              </div>
            ) : isBudgetOptimized ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>
                  {lang === 'bn'
                    ? `বাজেটের সাথে অপটিমাইজড (${swappedCount}টি বিকল্প পণ্য)`
                    : `Budget Optimized (${swappedCount} items substituted)`}
                </span>
              </div>
            ) : null}
          </div>

          {/* Missing Staple Alert Banner (Section 69 PRD) */}
          {!hasDetergent && (
            <div className="mb-4 bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-pulse-slow">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🧺</span>
                <div>
                  <h5 className="text-xs font-bold text-amber-950">
                    {lang === 'bn' ? 'স্মার্ট রিমাইন্ডার (Section 69): লন্ড্রি ডিটারজেন্ট যোগ করা হয়নি' : 'Missing Staple Reminder: No Laundry Detergent'}
                  </h5>
                  <p className="text-[11px] text-amber-800">
                    {lang === 'bn'
                      ? 'সাধারণত প্রতি মাসে আপনার পরিবারে ২ কেজি ডিটারজেন্ট প্রয়োজন হয়।'
                      : 'Dhaka households typically require 2kg detergent per monthly cycle.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onAddItem) {
                    onAddItem({
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
                    });
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm shrink-0 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? '+ হুইল ডিটারজেন্ট যোগ করুন (৳৩৩০)' : '+ Add Detergent (৳330)'}</span>
              </button>
            </div>
          )}

          {/* Product Items Table / Grid */}
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const lineTotal = item.unitMasikPrice * item.quantity;
              const lineMarket = item.unitMrp * item.quantity;
              const lineSaving = lineMarket - lineTotal;

              return (
                <div
                  key={item.variantId}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2.5 rounded-2xl transition-colors border border-transparent hover:border-slate-100"
                >
                  {/* Title & Category */}
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-masik-600 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                      {lang === 'bn' ? item.nameBn : item.nameEn}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>
                        {lang === 'bn' ? 'প্রতি ইউনিট:' : 'Unit:'} ৳{item.unitMasikPrice}
                      </span>
                      <span className="line-through text-slate-400">
                        ৳{item.unitMrp}
                      </span>
                      {lineSaving > 0 && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                          {lang === 'bn' ? `সাশ্রয় ৳${lineSaving}` : `Save ৳${lineSaving}`}
                        </span>
                      )}
                    </div>

                    {/* Swap / Change Product Button */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenSwap(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-masik-700 bg-masik-50/80 hover:bg-masik-100 border border-masik-200/80 transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
                        title={lang === 'bn' ? 'বিকল্প ব্র্যান্ড বা সাইজ দিয়ে পরিবর্তন করুন' : 'Swap with alternative brand or size'}
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 text-masik-600" />
                        <span>{lang === 'bn' ? 'পণ্য পরিবর্তন করুন' : 'Change Product'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity Counter & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    {/* Qty Pill */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1 shadow-sm">
                      <button
                        onClick={() => onUpdateQty(item.variantId, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-extrabold text-xs sm:text-sm text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.variantId, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[80px]">
                      <span className="text-sm sm:text-base font-black text-slate-900 block">
                        ৳{lineTotal.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through block">
                        ৳{lineMarket.toLocaleString()}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.variantId)}
                      className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add More Products from Background Inventory Catalog */}
          <div className="pt-5 mt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleOpenAddCatalog}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-dashed border-masik-300 hover:border-masik-600 bg-masik-50/50 hover:bg-masik-100/60 text-masik-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs hover:scale-[1.01] active:scale-98"
            >
              <Plus className="w-4 h-4 text-masik-600" />
              <span>{lang === 'bn' ? '+ ইনভেন্টরি থেকে আরও পণ্য যোগ করুন' : '+ Add More Products from Inventory'}</span>
            </button>
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-slate-400" />
              {lang === 'bn' ? 'অ্যাডমিন প্যানেল থেকে ব্যাকগ্রাউন্ডে পণ্য যুক্ত করা যায়' : 'New products can be added in background via Admin portal'}
            </span>
          </div>
        </div>

        {/* 30-Day Price Lock Card */}
        <div className="glass-card rounded-3xl p-5 border border-teal-200 bg-gradient-to-r from-teal-50/50 to-emerald-50/50 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {lang === 'bn' ? '৩০ দিনের জন্য মূল্য লক করুন' : 'Lock This Market Price for 30 Days'}
              </h4>
              <p className="text-xs text-slate-600">
                {lang === 'bn'
                  ? 'বাজারে পণ্যের দাম বাড়লেও আপনার আগামী মাসের এই বাজার অপরিবর্তিত থাকবে।'
                  : 'Guaranteed price hedge protecting your next cycle against wholesale commodity inflations.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPriceLockActive(!priceLockActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              priceLockActive
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-white text-teal-900 border-teal-300 hover:bg-teal-50'
            }`}
          >
            {priceLockActive
              ? (lang === 'bn' ? '✓ লক সক্রিয়' : '✓ Locked')
              : (lang === 'bn' ? 'লক করুন' : 'Lock Price')}
          </button>
        </div>
      </div>

      {/* Right 4 Columns: Twin Price Comparison & Checkout */}
      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
        {/* Twin Price Card (Section 17 PRD) */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            {lang === 'bn' ? 'মূল্য ও সাশ্রয় তুলনা' : 'Market Price vs Masik Price'}
          </h3>

          <div className="space-y-3.5 mb-6">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{lang === 'bn' ? 'সাধারণ বাজারের মূল্য:' : 'Regular Market Price:'}</span>
              <span className="font-semibold line-through text-slate-400">
                ৳{totalMarket.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>{lang === 'bn' ? 'মাসের বাজার মূল মূল্য:' : 'Masher Base Price:'}</span>
              <span className="font-bold text-slate-800">
                ৳{totalMasik.toLocaleString()}
              </span>
            </div>

            {appliedCredits > 0 && (
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
                <span>{lang === 'bn' ? 'মার্কেট ক্রেডিট ডিসকাউন্ট:' : 'Loyalty Credit Applied:'}</span>
                <span>-৳{appliedCredits}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-1">
              <span>{lang === 'bn' ? 'পরিশোধযোগ্য মূল্য:' : 'Final Payable:'}</span>
              <span className="text-xl font-black text-masik-700">
                ৳{payableMasik.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{lang === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
              <span className="text-emerald-700 font-bold uppercase">
                {lang === 'bn' ? 'বিনামূল্যে' : 'Free (Bulk Order)'}
              </span>
            </div>
          </div>

          {/* Green Savings Highlight */}
          <div className="bg-gradient-to-r from-emerald-500 to-masik-600 rounded-2xl p-4 text-white shadow-md shadow-emerald-500/20 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-emerald-100 block">
                  {lang === 'bn' ? 'আপনার নিশ্চিত সাশ্রয়' : 'Total Net Savings'}
                </span>
                <span className="text-2xl font-black block">
                  ৳{totalSavings.toLocaleString()}
                </span>
              </div>
              <div className="text-right bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                <span className="text-xs font-bold block">{savingsPercent}%</span>
                <span className="text-[10px] text-emerald-100 block">{lang === 'bn' ? 'সাশ্রয়' : 'Saved'}</span>
              </div>
            </div>
          </div>

          {/* Market Credits Loyalty Redemption (Section 65 PRD) */}
          <div className="mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={useLoyaltyCredits}
                onChange={(e) => setUseLoyaltyCredits(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  💰 {lang === 'bn' ? `মার্কেট ক্রেডিট ব্যবহার করুন (ব্যালেন্স: ৳${availableCredits})` : `Redeem Market Credits (Balance: ৳${availableCredits})`}
                </span>
                <span className="text-[11px] text-amber-800 block mt-0.5">
                  {lang === 'bn'
                    ? 'আপনার অর্জিত লয়ালটি ক্রেডিট সরাসরি এই অর্ডারের বিল থেকে কেটে নিন।'
                    : 'Apply your accumulated reward credits directly to lower your monthly grocery bill.'}
                </span>
              </div>
            </label>
          </div>

          {/* Dhaka Zone Selector */}
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {lang === 'bn' ? 'ডেলিভারি এরিয়া (ঢাকা):' : 'Dhaka Delivery Zone:'}
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-masik-600"
            >
              <option value="Gulshan">Gulshan (গুলশান)</option>
              <option value="Banani">Banani (বনানী)</option>
              <option value="Uttara">Uttara (উত্তরা)</option>
              <option value="Dhanmondi">Dhanmondi (ধানমন্ডি)</option>
              <option value="Mirpur">Mirpur (মিরপুর)</option>
              <option value="Savar">Savar (সাভার)</option>
            </select>
          </div>

          {/* Delivery Slot Selector */}
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {lang === 'bn' ? 'ডেলিভারি টাইম স্লট:' : 'Delivery Time Slot:'}
            </label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-masik-600"
            >
              <option value="Morning Slot (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
              <option value="Afternoon Slot (12 PM – 3 PM)">Afternoon (12 PM – 3 PM)</option>
              <option value="Evening Slot (3 PM – 6 PM)">Evening (3 PM – 6 PM)</option>
              <option value="Night Slot (6 PM – 9 PM)">Night (6 PM – 9 PM)</option>
            </select>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.BKASH)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  paymentMethod === PaymentMethod.BKASH
                    ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                bKash (১-ক্লিক)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.NAGAD)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  paymentMethod === PaymentMethod.NAGAD
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Nagad
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.CARD_SSLCOMMERZ)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  paymentMethod === PaymentMethod.CARD_SSLCOMMERZ
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Card / SSL
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.COD)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  paymentMethod === PaymentMethod.COD
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Cash on Del.
              </button>
            </div>
          </div>

          {/* Primary Checkout Button */}
          <button
            onClick={handleCheckout}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-masik-700 via-masik-600 to-emerald-600 hover:from-masik-800 hover:to-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-masik-700/30 transition-all active:scale-[0.99]"
          >
            <span>{lang === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm Monthly Market'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Switcher / Inventory Catalog Modal */}
      {(swapModalItem || isCatalogModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-masik-100 text-masik-700 flex items-center justify-center shrink-0 mt-0.5">
                  {swapModalItem ? (
                    <ArrowLeftRight className="w-5 h-5 text-masik-700" />
                  ) : (
                    <Plus className="w-5 h-5 text-masik-700" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {swapModalItem
                      ? (lang === 'bn' ? 'পণ্য পরিবর্তন করুন (বিকল্প পণ্য নির্বাচন)' : 'Change Product (Select Alternative)')
                      : (lang === 'bn' ? 'ইনভেন্টরি ক্যাটালগ থেকে পণ্য যোগ করুন' : 'Add Products from Inventory Catalog')}
                  </h3>
                  {swapModalItem ? (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">
                        {lang === 'bn' ? 'বর্তমান পণ্য:' : 'Current Item:'}
                      </span>
                      <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                        {lang === 'bn' ? swapModalItem.nameBn : swapModalItem.nameEn} (৳{swapModalItem.unitMasikPrice})
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-medium text-masik-700">
                        {swapModalItem.unitValue} {swapModalItem.unit}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'bn'
                        ? 'আপনার মাসের বাজারের ব্যাগে যেকোনো পণ্য যোগ করতে পারেন'
                        : 'Select and add any inventory item directly to your grocery basket'}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSwapModalItem(null);
                  setIsCatalogModalOpen(false);
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-100 bg-white space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    lang === 'bn'
                      ? 'পণ্য, ব্র্যান্ড বা SKU দিয়ে খুঁজুন (যেমন: মিনিকেট, রূপচাঁদা, ডাল, তীর)...'
                      : 'Search by product name, brand or SKU (e.g. Miniket, Teer, Dal)...'
                  }
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-masik-600 focus:bg-white transition-all"
                />
                {modalSearch && (
                  <button
                    onClick={() => setModalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills (horizontally scrollable) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {swapModalItem && (
                  <button
                    type="button"
                    onClick={() => setModalCategory('MATCHING')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      modalCategory === 'MATCHING'
                        ? 'bg-masik-700 text-white shadow-xs'
                        : 'bg-masik-50 text-masik-700 hover:bg-masik-100 border border-masik-200'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? `একই ক্যাটাগরি (${swapModalItem.category})` : `Same Category (${swapModalItem.category})`}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setModalCategory('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                    modalCategory === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'সকল পণ্য' : 'All Products'}
                </button>

                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setModalCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                      modalCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Items List */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-3 flex-1 bg-slate-50/40">
              {filteredInventory.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold mb-2">
                    {lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setModalSearch('');
                      setModalCategory('ALL');
                    }}
                    className="text-xs text-masik-600 font-bold hover:underline"
                  >
                    {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset filters'}
                  </button>
                </div>
              ) : (
                filteredInventory.map((inv) => {
                  const isCurrentItem = swapModalItem && inv.variantId === swapModalItem.variantId;
                  const priceDiff = swapModalItem ? inv.masikPrice - swapModalItem.unitMasikPrice : 0;

                  return (
                    <div
                      key={inv.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCurrentItem
                          ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-masik-300 hover:shadow-md'
                      }`}
                    >
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-masik-700 bg-masik-50 px-2 py-0.5 rounded-md border border-masik-100">
                            {inv.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {inv.brand}
                          </span>
                          {inv.isPrivateLabel && (
                            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                              ★ {lang === 'bn' ? 'সরাসরি মিল/কারখানা' : 'Direct Mill/Factory'}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-400">
                            {inv.sku}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {lang === 'bn' ? inv.nameBn : inv.nameEn}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {inv.nameEn}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                          <span className="font-semibold text-slate-700">
                            {lang === 'bn' ? `সাইজ: ${inv.unitValue} ${inv.unit}` : `Size: ${inv.unitValue} ${inv.unit}`}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {inv.batchNumber}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            {lang === 'bn' ? `স্টক: ${inv.stockAvailable} টি` : `${inv.stockAvailable} in stock`}
                          </span>
                        </div>
                      </div>

                      {/* Pricing & Selection Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1.5">
                            <span className="text-lg font-black text-slate-900">
                              ৳{inv.masikPrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ৳{inv.mrp.toLocaleString()}
                            </span>
                          </div>

                          {/* Price diff indicator when swapping */}
                          {swapModalItem && (
                            <div className="mt-1">
                              {priceDiff < 0 ? (
                                <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300">
                                  {lang === 'bn' ? `৳${Math.abs(priceDiff)} সাশ্রয়` : `Save ৳${Math.abs(priceDiff)}`}
                                </span>
                              ) : priceDiff > 0 ? (
                                <span className="inline-block text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  {lang === 'bn' ? `+৳${priceDiff} প্রিমিয়াম` : `+৳${priceDiff}`}
                                </span>
                              ) : (
                                <span className="inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {lang === 'bn' ? 'একই মূল্য' : 'Same Price'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {swapModalItem ? (
                          isCurrentItem ? (
                            <div className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                              <Check className="w-4 h-4 text-emerald-700" />
                              <span>{lang === 'bn' ? 'বর্তমান পণ্য' : 'Current Item'}</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectSwap(inv)}
                              className="px-4 py-2.5 rounded-xl bg-masik-600 hover:bg-masik-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                            >
                              <ArrowLeftRight className="w-4 h-4" />
                              <span>{lang === 'bn' ? 'এই পণ্যটি নির্বাচন করুন' : 'Select'}</span>
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectAdd(inv)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{lang === 'bn' ? 'বাজারে যোগ করুন' : 'Add to Basket'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {lang === 'bn'
                  ? `${filteredInventory.length}টি পণ্য ইনভেন্টরিতে উপলব্ধ`
                  : `${filteredInventory.length} products available in inventory`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSwapModalItem(null);
                  setIsCatalogModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant Notification Toast */}
      {swapToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slideUp max-w-md w-full mx-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold flex-1 leading-snug">
            {swapToast}
          </span>
          <button
            type="button"
            onClick={() => setSwapToast(null)}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
