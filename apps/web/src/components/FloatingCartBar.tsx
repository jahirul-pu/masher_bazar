'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, TrendingDown } from 'lucide-react';
import { formatPrice, formatNumber } from '@/utils/formatters';

interface FloatingCartBarProps {
  lang: 'bn' | 'en';
  itemCount: number;
  totalMasik: number;
  totalSavings: number;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  lang,
  itemCount,
  totalMasik,
  totalSavings,
  onOpenCart,
}) => {
  if (itemCount === 0) return null;

  return (
    <aside aria-label="Floating cart summary" className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-40 animate-slide-up">
      <div
        onClick={onOpenCart}
        className="glass-card bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900 transition-all hover:scale-[1.01] active:scale-99 ring-2 ring-masik-500/30"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-masik-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
              {formatNumber(itemCount, lang)}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-white">
                {formatPrice(totalMasik, lang)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                ({formatNumber(itemCount, lang)} {lang === 'bn' ? 'পণ্য' : 'items'})
              </span>
            </div>
            {totalSavings > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>{lang === 'bn' ? `সাশ্রয় ${formatPrice(totalSavings, lang)}` : `Saving ${formatPrice(totalSavings, lang)}`}</span>
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCart();
          }}
          className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-colors"
        >
          <span>{lang === 'bn' ? 'ঝুড়ি দেখুন' : 'View Cart'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
