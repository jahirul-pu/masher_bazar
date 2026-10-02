'use client';

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Search,
  ArrowLeftRight,
  TrendingDown,
  Sparkles,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { InventoryItem } from '@masik/business-rules';
import { DisplayBasketItem, getCategoryName } from './BasketDisplay';
import { formatPrice, formatNumber, toBengaliNumber } from '@/utils/formatters';

interface ProductCatalogProps {
  lang: 'bn' | 'en';
  catalog: InventoryItem[];
  basketItems: DisplayBasketItem[];
  onAddItem: (item: DisplayBasketItem) => void;
  onUpdateQty: (variantId: string, delta: number) => void;
  onOpenSwap?: (item: DisplayBasketItem) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

// Category visual meta
interface CategoryMeta {
  slug: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  color: string;
}

const CATEGORIES: CategoryMeta[] = [
  { slug: 'ALL', nameBn: 'সব পণ্য', nameEn: 'All Products', icon: '🛒', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { slug: 'চাল', nameBn: 'চাল', nameEn: 'Rice', icon: '🍚', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { slug: 'তেল', nameBn: 'ভোজ্য তেল ও ঘি', nameEn: 'Cooking Oil & Ghee', icon: '🛢️', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { slug: 'ডাল', nameBn: 'ডাল', nameEn: 'Lentils & Pulses', icon: '🥣', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { slug: 'আটা', nameBn: 'আটা ও ময়দা', nameEn: 'Atta & Flour', icon: '🌾', color: 'bg-stone-50 text-stone-800 border-stone-200' },
  { slug: 'আলু', nameBn: 'আলু ও পেঁয়াজ', nameEn: 'Potato & Onion', icon: '🥔', color: 'bg-amber-50 text-amber-900 border-amber-200' },
  { slug: 'মসলা', nameBn: 'মসলা ও লবণ', nameEn: 'Spices & Salt', icon: '🧂', color: 'bg-red-50 text-red-800 border-red-200' },
  { slug: 'চিনি', nameBn: 'চিনি ও মিষ্টি', nameEn: 'Sugar', icon: '🍬', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { slug: 'পরিচ্ছন্নতা', nameBn: 'পরিচ্ছন্নতা', nameEn: 'Cleaning & Wash', icon: '🧼', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { slug: 'ব্যক্তিগত যত্ন', nameBn: 'ব্যক্তিগত যত্ন', nameEn: 'Personal Care', icon: '🧴', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  { slug: 'গৃহস্থালী টিস্যু', nameBn: 'টিস্যু', nameEn: 'Tissue Paper', icon: '🧻', color: 'bg-sky-50 text-sky-800 border-sky-200' },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  lang,
  catalog,
  basketItems,
  onAddItem,
  onUpdateQty,
  onOpenSwap,
  searchQuery = '',
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'savings'>('featured');
  const [localSearch, setLocalSearch] = useState<string>('');

  const activeSearch = onSearchChange ? searchQuery : localSearch;
  const setActiveSearch = onSearchChange || setLocalSearch;

  // Map basket quantities by variantId for O(1) lookups
  const basketItemMap = useMemo(() => {
    const map = new Map<string, DisplayBasketItem>();
    for (const item of basketItems) {
      map.set(item.variantId, item);
    }
    return map;
  }, [basketItems]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = catalog.filter((product) => {
      // Category match
      let matchCat = true;
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'তেল') {
          matchCat = product.category === 'তেল' || product.category === 'ঘি';
        } else if (selectedCategory === 'আটা') {
          matchCat = product.category === 'আটা' || product.category === 'ময়দা';
        } else if (selectedCategory === 'আলু') {
          matchCat = product.category === 'আলু' || product.category === 'পেঁয়াজ';
        } else if (selectedCategory === 'মসলা') {
          matchCat = product.category === 'মসলা' || product.category === 'লবণ';
        } else {
          matchCat = product.category === selectedCategory;
        }
      }

      // Search match
      let matchSearch = true;
      if (activeSearch.trim()) {
        const query = activeSearch.toLowerCase().trim();
        matchSearch =
          product.nameEn.toLowerCase().includes(query) ||
          product.nameBn.includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.includes(query) ||
          product.sku.toLowerCase().includes(query);
      }

      return matchCat && matchSearch;
    });

    // Sorting
    if (sortBy === 'priceAsc') {
      result = [...result].sort((a, b) => a.masikPrice - b.masikPrice);
    } else if (sortBy === 'priceDesc') {
      result = [...result].sort((a, b) => b.masikPrice - a.masikPrice);
    } else if (sortBy === 'savings') {
      result = [...result].sort((a, b) => (b.mrp - b.masikPrice) - (a.mrp - a.masikPrice));
    }

    return result;
  }, [catalog, selectedCategory, activeSearch, sortBy]);

  const handleAddOrIncrement = (product: InventoryItem) => {
    const existing = basketItemMap.get(product.variantId);
    if (existing) {
      onUpdateQty(product.variantId, 1);
    } else {
      const newItem: DisplayBasketItem = {
        variantId: product.variantId,
        nameEn: product.nameEn,
        nameBn: product.nameBn,
        category: product.category,
        unit: product.unit,
        unitValue: product.unitValue,
        quantity: 1,
        unitMasikPrice: product.masikPrice,
        unitMrp: product.mrp,
        isRecurring: true,
      };
      onAddItem(newItem);
    }
  };

  const handleDecrement = (product: InventoryItem) => {
    const existing = basketItemMap.get(product.variantId);
    if (!existing) return;
    onUpdateQty(product.variantId, -1);
  };

  // Get visual badge styling for categories
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'চাল':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', emoji: '🍚' };
      case 'তেল':
      case 'ঘি':
        return { bg: 'bg-amber-100 text-amber-900 border-amber-300', emoji: '🛢️' };
      case 'ডাল':
        return { bg: 'bg-orange-100 text-orange-900 border-orange-300', emoji: '🥣' };
      case 'আটা':
      case 'ময়দা':
        return { bg: 'bg-stone-100 text-stone-900 border-stone-300', emoji: '🌾' };
      case 'আলু':
      case 'পেঁয়াজ':
        return { bg: 'bg-yellow-100 text-yellow-900 border-yellow-300', emoji: '🥔' };
      case 'লবণ':
      case 'মসলা':
        return { bg: 'bg-rose-100 text-rose-900 border-rose-300', emoji: '🧂' };
      case 'চিনি':
        return { bg: 'bg-blue-100 text-blue-900 border-blue-300', emoji: '🍬' };
      case 'পরিচ্ছন্নতা':
        return { bg: 'bg-indigo-100 text-indigo-900 border-indigo-300', emoji: '🧼' };
      case 'ব্যক্তিগত যত্ন':
        return { bg: 'bg-teal-100 text-teal-900 border-teal-300', emoji: '🧴' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-300', emoji: '📦' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Pills Carousel / Scroll Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-masik-600" />
            <span>{lang === 'bn' ? 'ক্যাটাগরি অনুযায়ী ব্রাউজ করুন' : 'Browse by Category'}</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {lang === 'bn' ? `মোট ${formatNumber(filteredProducts.length, lang)}টি পণ্য` : `${filteredProducts.length} items`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-masik-700 text-white shadow-md shadow-masik-700/25 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{lang === 'bn' ? cat.nameBn : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={activeSearch}
            onChange={(e) => setActiveSearch(e.target.value)}
            placeholder={
              lang === 'bn'
                ? 'পণ্য, চাল, তেল, ডাল বা ব্র্যান্ড খুঁজুন (যেমন: রূপচাঁদা, চাষী, এসিআই)...'
                : 'Search products by name, brand, or SKU (e.g. Rupchanda, Chashi, ACI)...'
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-masik-600 focus:bg-white transition-colors"
          />
          {activeSearch && (
            <button
              onClick={() => setActiveSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600 hidden md:inline">
            {lang === 'bn' ? 'সর্ট করুন:' : 'Sort by:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-masik-600 cursor-pointer"
          >
            <option value="featured">{lang === 'bn' ? 'জনপ্রিয় পণ্য (Featured)' : 'Featured Items'}</option>
            <option value="savings">{lang === 'bn' ? 'সর্বোচ্চ সাশ্রয় (Highest Savings)' : 'Biggest Discounts'}</option>
            <option value="priceAsc">{lang === 'bn' ? 'দাম: কম থেকে বেশি (Price: Low to High)' : 'Price: Low to High'}</option>
            <option value="priceDesc">{lang === 'bn' ? 'দাম: বেশি থেকে কম (Price: High to Low)' : 'Price: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">
            {lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No matching products found'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {lang === 'bn'
              ? 'অনুগ্রহ করে ভিন্ন কোনো শব্দ বা ক্যাটাগরি নির্বাচন করে চেষ্টা করুন।'
              : 'Try adjusting your search query or select another category filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveSearch('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-masik-700 hover:bg-masik-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            {lang === 'bn' ? 'সব পণ্য দেখুন' : 'View All Products'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => {
            const existingBasketItem = basketItemMap.get(product.variantId);
            const inCartQty = existingBasketItem?.quantity || 0;
            const savingsAmount = Math.max(0, product.mrp - product.masikPrice);
            const savingsPercent = Math.round((savingsAmount / product.mrp) * 100);
            const badgeMeta = getCategoryBadge(product.category);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-slate-200/90 hover:border-masik-400 hover:shadow-lg hover:shadow-masik-950/5 transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border ${badgeMeta.bg}`}>
                    <span>{badgeMeta.emoji}</span>
                    <span>{getCategoryName(product.category, lang)}</span>
                  </span>

                  {savingsAmount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🔥 {formatPrice(savingsAmount, lang)} {lang === 'bn' ? 'ছাড়' : 'OFF'}
                    </span>
                  )}
                </div>

                {/* Visual Graphic & Brand */}
                <div className="my-2 p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-100 flex flex-col items-center justify-center text-center group-hover:scale-[1.01] transition-transform">
                  <div className="text-4xl sm:text-5xl select-none mb-2 filter drop-shadow-xs">
                    {badgeMeta.emoji}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    {product.isPrivateLabel && (
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                        {lang === 'bn' ? 'মাসিক এসেনশিয়ালস' : 'Private Label'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Title & Pack Size */}
                <div className="mt-2 space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                    {lang === 'bn' ? product.nameBn : product.nameEn}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                      {product.unitValue} {product.unit}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'ইন স্টক' : 'In Stock'}</span>
                    </span>
                  </div>
                </div>

                {/* Twin Pricing Box */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block line-through">
                      {formatPrice(product.mrp, lang)}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg sm:text-xl font-black text-slate-900">
                        {formatPrice(product.masikPrice, lang)}
                      </span>
                      <span className="text-[10px] font-extrabold text-masik-700 uppercase">
                        {lang === 'bn' ? 'পাইকারি রেট' : 'Wholesale'}
                      </span>
                    </div>
                  </div>

                  {savingsPercent > 0 && (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      {toBengaliNumber(savingsPercent)}% {lang === 'bn' ? 'সাশ্রয়' : 'Saved'}
                    </span>
                  )}
                </div>

                {/* Action Controls */}
                <div className="mt-4">
                  {inCartQty > 0 ? (
                    <div className="flex items-center justify-between bg-masik-50 border border-masik-300 rounded-2xl p-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => handleDecrement(product)}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-masik-100 text-masik-900 flex items-center justify-center font-black transition-colors shadow-2xs cursor-pointer"
                        title={lang === 'bn' ? 'পরিমাণ কমান' : 'Decrease'}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="text-center px-2">
                        <span className="text-xs font-black text-masik-950 block">
                          {formatNumber(inCartQty, lang)} {lang === 'bn' ? 'টি ব্যাগে' : 'in cart'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddOrIncrement(product)}
                        className="w-8 h-8 rounded-xl bg-masik-700 hover:bg-masik-800 text-white flex items-center justify-center font-black transition-colors shadow-2xs cursor-pointer"
                        title={lang === 'bn' ? 'পরিমাণ বাড়ান' : 'Increase'}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddOrIncrement(product)}
                      className="w-full py-2.5 rounded-2xl bg-masik-700 hover:bg-masik-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{lang === 'bn' ? '+ ব্যাগে যোগ করুন' : '+ Add to Basket'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
