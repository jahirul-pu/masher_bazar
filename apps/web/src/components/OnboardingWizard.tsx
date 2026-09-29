'use client';

import React from 'react';
import { Users, Utensils, DollarSign, Sparkles, Award } from 'lucide-react';
import { CookingFrequency, FoodPreference, MarketTier } from '@masik/shared-types';
import { formatPrice, formatNumber } from '@/utils/formatters';

export interface OnboardingState {
  size: number;
  adults: number;
  children: number;
  cookingFreq: CookingFrequency;
  preference: FoodPreference;
  budget: number;
  tier: MarketTier;
}

interface OnboardingWizardProps {
  lang: 'bn' | 'en';
  state: OnboardingState;
  onChange: (updates: Partial<OnboardingState>) => void;
  onGenerate: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  lang,
  state,
  onChange,
  onGenerate,
}) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-masik-100 text-masik-700 flex items-center justify-center font-bold">
          1
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {lang === 'bn' ? 'আপনার পরিবারের তথ্য দিন' : 'Customize Household Profile'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'bn'
              ? 'নিচের অপশনগুলো সিলেক্ট করুন—আমাদের ইঞ্জিন আপনার পরিবারের সঠিক বাজার নির্ধারণ করবে।'
              : 'Configure your household metrics to calculate optimal monthly staple quantities.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Step 1: Household Size */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            <Users className="w-4 h-4 text-masik-600" />
            <span>{lang === 'bn' ? 'পরিবারের সদস্য সংখ্যা' : 'Household Size'}</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 4, 6, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ size: s, adults: Math.ceil(s * 0.7), children: Math.floor(s * 0.3) })}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  state.size === s
                    ? 'bg-masik-700 text-white border-masik-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-masik-300'
                }`}
              >
                {formatNumber(s, lang)}{s === 8 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Food Preference */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            <Utensils className="w-4 h-4 text-masik-600" />
            <span>{lang === 'bn' ? 'খাবার পছন্দ' : 'Food Preference'}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { val: FoodPreference.STANDARD, labelBn: 'নরমাল', labelEn: 'Standard' },
              { val: FoodPreference.RICE_HEAVY, labelBn: 'ভাত বেশি', labelEn: 'Rice Heavy' },
              { val: FoodPreference.ROTI_HEAVY, labelBn: 'রুটি বেশি', labelEn: 'Roti Heavy' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => onChange({ preference: p.val })}
                className={`py-2.5 px-1 rounded-xl text-xs font-bold border transition-all ${
                  state.preference === p.val
                    ? 'bg-masik-700 text-white border-masik-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-masik-300'
                }`}
              >
                {lang === 'bn' ? p.labelBn : p.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Cooking Frequency */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-4 h-4 text-masik-600" />
            <span>{lang === 'bn' ? 'বাসায় রান্নার ফ্রিকোয়েন্সি' : 'Cooking Frequency'}</span>
          </label>
          <select
            value={state.cookingFreq}
            onChange={(e) => onChange({ cookingFreq: e.target.value as CookingFrequency })}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-masik-600"
          >
            <option value={CookingFrequency.ALMOST_EVERY_DAY}>
              {lang === 'bn' ? 'প্রতিদিন নিয়মিত রান্না হয়' : 'Almost Every Day'}
            </option>
            <option value={CookingFrequency.FOUR_TO_FIVE_DAYS}>
              {lang === 'bn' ? 'সপ্তাহে ৪-৫ দিন' : '4-5 Days / Week'}
            </option>
            <option value={CookingFrequency.TWO_TO_THREE_DAYS}>
              {lang === 'bn' ? 'সপ্তাহে ২-৩ দিন' : '2-3 Days / Week'}
            </option>
            <option value={CookingFrequency.OCCASIONALLY}>
              {lang === 'bn' ? 'মাঝে মাঝে রান্না হয়' : 'Occasionally'}
            </option>
          </select>
        </div>

        {/* Step 4: Budget Slider */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-masik-600" />
              <span>{lang === 'bn' ? 'মাসিক মুদি বাজেট' : 'Monthly Grocery Budget'}</span>
            </label>
            <span className="text-base font-extrabold text-masik-700 bg-masik-50 px-3 py-0.5 rounded-lg border border-masik-200">
              {formatPrice(state.budget, lang)}
            </span>
          </div>
          <input
            type="range"
            min="3000"
            max="15000"
            step="500"
            value={state.budget}
            onChange={(e) => onChange({ budget: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-masik-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>{formatPrice(3000, lang)}</span>
            <span>{lang === 'bn' ? `${formatPrice(6000, lang)} (গড় পরিবার)` : `${formatPrice(6000, lang)} (Average)`}</span>
            <span>{formatPrice(10000, lang)}+</span>
          </div>
        </div>

        {/* Step 5: Market Tier */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            <Award className="w-4 h-4 text-masik-600" />
            <span>{lang === 'bn' ? 'পণ্যের ধরন' : 'Market Tier'}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { val: MarketTier.BASIC, labelBn: 'বেসিক', labelEn: 'Basic' },
              { val: MarketTier.FAMILY, labelBn: 'ফ্যামিলি', labelEn: 'Family' },
              { val: MarketTier.PREMIUM, labelBn: 'প্রিমিয়াম', labelEn: 'Premium' },
            ].map((t) => (
              <button
                key={t.val}
                type="button"
                onClick={() => onChange({ tier: t.val })}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                  state.tier === t.val
                    ? 'bg-masik-700 text-white border-masik-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-masik-300'
                }`}
              >
                {lang === 'bn' ? t.labelBn : t.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Trigger Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onGenerate}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-masik-700 to-masik-600 hover:from-masik-800 hover:to-masik-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-masik-700/25"
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'bn' ? 'আমার মাসের বাজার তৈরি করুন' : 'Generate My Month’s Market'}</span>
        </button>
      </div>
    </div>
  );
};
