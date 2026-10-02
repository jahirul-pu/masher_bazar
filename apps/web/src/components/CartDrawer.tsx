'use client';

import React from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowLeftRight,
} from 'lucide-react';
import { DisplayBasketItem, getCategoryName } from './BasketDisplay';
import { formatPrice, formatNumber, toBengaliNumber } from '@/utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  items: DisplayBasketItem[];
  onUpdateQty: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onOptimizeBudget: () => void;
  isBudgetOptimized: boolean;
  swappedCount: number;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  items,
  onUpdateQty,
  onRemoveItem,
  onOptimizeBudget,
  isBudgetOptimized,
  swappedCount,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalMasik = items.reduce((acc, i) => acc + i.unitMasikPrice * i.quantity, 0);
  const totalMarket = items.reduce((acc, i) => acc + i.unitMrp * i.quantity, 0);
  const totalSavings = Math.max(0, totalMarket - totalMasik);
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Delivery progress (Free delivery over ৳2,000)
  const freeDeliveryThreshold = 2000;
  const isFreeDelivery = totalMasik >= freeDeliveryThreshold;
  const deliveryRemaining = Math.max(0, freeDeliveryThreshold - totalMasik);
  const deliveryProgress = Math.min(100, Math.round((totalMasik / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-masik-700 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {lang === 'bn' ? 'আমার বাজার ঝুড়ি' : 'My Grocery Basket'}
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {formatNumber(items.length, lang)} {lang === 'bn' ? 'টি পণ্য' : 'items'} ({formatNumber(totalItemsCount, lang)} {lang === 'bn' ? 'ইউনিট' : 'units'})
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Milestone Progress */}
          <div className="bg-gradient-to-r from-masik-50 via-emerald-50 to-teal-50 px-5 py-3 border-b border-masik-200/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-masik-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-masik-700" />
                <span>
                  {isFreeDelivery
                    ? (lang === 'bn' ? '🎉 আপনি ফ্রি ডেলিভারি পেয়েছেন!' : '🎉 You unlocked FREE Home Delivery!')
                    : (lang === 'bn' ? `আর ${formatPrice(deliveryRemaining, lang)} যোগ করলেই ফ্রি ডেলিভারি!` : `Add ${formatPrice(deliveryRemaining, lang)} more for FREE Delivery!`)}
                </span>
              </span>
              <span className="font-extrabold text-masik-800">{deliveryProgress}%</span>
            </div>
            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-masik-600 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1">
                  {lang === 'bn' ? 'ঝুড়ি বর্তমানে খালি' : 'Your cart is empty'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-4">
                  {lang === 'bn'
                    ? 'ক্যাটালগ থেকে চাল, তেল, ডাল বা নিত্যপ্রয়োজনীয় পণ্য ঝুড়িতে যুক্ত করুন।'
                    : 'Explore the catalog to add rice, oil, lentils, and monthly grocery essentials.'}
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-masik-700 hover:bg-masik-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {lang === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const lineTotal = item.unitMasikPrice * item.quantity;
                const lineMarket = item.unitMrp * item.quantity;
                const lineSaving = lineMarket - lineTotal;

                return (
                  <div key={item.variantId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-masik-100 text-masik-800">
                          {getCategoryName(item.category, lang)}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {lang === 'bn' ? item.nameBn : item.nameEn}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-black text-slate-800">
                          {formatPrice(item.unitMasikPrice, lang)}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatPrice(item.unitMrp, lang)}
                        </span>
                      </div>
                    </div>

                    {/* Stepper & Line Total */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.variantId, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 font-bold transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-extrabold text-xs text-slate-900">
                          {formatNumber(item.quantity, lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.variantId, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[65px]">
                        <span className="text-xs sm:text-sm font-black text-slate-900 block">
                          {formatPrice(lineTotal, lang)}
                        </span>
                        {lineSaving > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            -{formatPrice(lineSaving, lang)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.variantId)}
                        className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
              {/* Savings callout */}
              {totalSavings > 0 && (
                <div className="bg-emerald-100/70 border border-emerald-300/80 rounded-2xl p-2.5 flex items-center justify-between text-xs text-emerald-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'bn' ? 'আপনার মোট সাশ্রয়:' : 'Total Guaranteed Savings:'}</span>
                  </span>
                  <span className="text-emerald-800 text-sm font-black">
                    +{formatPrice(totalSavings, lang)}
                  </span>
                </div>
              )}

              {/* Price rows */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'bn' ? 'পণ্যের মোট মূল্য (খুচরা):' : 'Retail Market MRP:'}</span>
                  <span className="line-through">{formatPrice(totalMarket, lang)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'bn' ? 'হোম ডেলিভারি চার্জ:' : 'Home Delivery:'}</span>
                  <span className="text-emerald-700 font-bold">
                    {isFreeDelivery ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : formatPrice(60, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>{lang === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'}</span>
                  <span className="text-masik-800 text-lg">
                    {formatPrice(totalMasik + (isFreeDelivery ? 0 : 60), lang)}
                  </span>
                </div>
              </div>

              {/* Action button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-masik-700 to-emerald-600 hover:from-masik-800 hover:to-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-masik-800/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-98"
              >
                <span>{lang === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
