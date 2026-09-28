'use client';

import React, { useState } from 'react';
import { ChefHat, Sparkles, ArrowRight, Utensils, Check } from 'lucide-react';

interface MealPlannerProps {
  lang: 'bn' | 'en';
  onGenerateFromMealPlan: (calculatedNeeds: {
    riceKg: number;
    oilLiters: number;
    dalKg: number;
    attaKg: number;
  }) => void;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  lang,
  onGenerateFromMealPlan,
}) => {
  const [chickenDays, setChickenDays] = useState(3);
  const [fishDays, setFishDays] = useState(3);
  const [beefDays, setBeefDays] = useState(1);
  const [khichuriDays, setKhichuriDays] = useState(2);
  const [breakfastRoti, setBreakfastRoti] = useState(true);

  // Live conversion formula (30 days ~= 4.3 weeks)
  const weeks = 4.3;
  const chickenMeals = Math.round(chickenDays * weeks);
  const fishMeals = Math.round(fishDays * weeks);
  const beefMeals = Math.round(beefDays * weeks);
  const khichuriMeals = Math.round(khichuriDays * weeks);

  const totalCurryMeals = chickenMeals + fishMeals + beefMeals;
  const calculatedRiceKg = Math.max(15, Math.round(totalCurryMeals * 0.45 + khichuriMeals * 0.35));
  const calculatedOilL = Math.max(
    3,
    Math.round(chickenMeals * 0.08 + fishMeals * 0.08 + beefMeals * 0.12 + khichuriMeals * 0.07)
  );
  const calculatedDalKg = Math.max(2, Math.round(30 * 0.1 + khichuriMeals * 0.15));
  const calculatedAttaKg = breakfastRoti ? 10 : 5;

  const handleApply = () => {
    onGenerateFromMealPlan({
      riceKg: calculatedRiceKg,
      oilLiters: calculatedOilL,
      dalKg: calculatedDalKg,
      attaKg: calculatedAttaKg,
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {lang === 'bn' ? 'মিল-টু-মার্কেট ইঞ্জিন (Section 67 PRD)' : 'Meal-to-Market Engine'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn'
                ? 'আপনার পরিবারের ৩০ দিনের রান্নার মেনু সিলেক্ট করুন—আমরা প্রয়োজনীয় চাল, তেল ও ডালের ওজন বের করব।'
                : 'Configure your 30-day recipe frequency—our AI calculates exact bulk ingredient weights.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Chicken Curry */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-700 block mb-1">🍗 মুরগির মাংস (সপ্তাহে)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-black text-emerald-700">{chickenDays} দিন</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  onClick={() => setChickenDays(d)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border ${
                    chickenDays === d ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block mt-2">মাসে প্রায় {chickenMeals}টি মিল</span>
        </div>

        {/* Fish Curry */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-700 block mb-1">🐟 মাছের তরকারি (সপ্তাহে)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-black text-emerald-700">{fishDays} দিন</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  onClick={() => setFishDays(d)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border ${
                    fishDays === d ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block mt-2">মাসে প্রায় {fishMeals}টি মিল</span>
        </div>

        {/* Khichuri */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-700 block mb-1">🍲 ভুনা খিচুড়ি (সপ্তাহে)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-black text-emerald-700">{khichuriDays} দিন</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setKhichuriDays(d)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border ${
                    khichuriDays === d ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block mt-2">মাসে প্রায় {khichuriMeals}টি মিল</span>
        </div>

        {/* Breakfast Roti */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 block">🥞 সকালের নাস্তা</span>
          <button
            onClick={() => setBreakfastRoti(!breakfastRoti)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all mt-2 flex items-center justify-center gap-1.5 ${
              breakfastRoti ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {breakfastRoti && <Check className="w-3.5 h-3.5" />}
            <span>{breakfastRoti ? 'প্রতিদিন রুটি নাস্তা (১০ কেজি আটা)' : 'নরমাল নাস্তা'}</span>
          </button>
          <span className="text-[10px] text-slate-400 block mt-1">আটার কোটা স্বয়ংক্রিয় সমন্বয়</span>
        </div>
      </div>

      {/* Calculated Ingredient Summary Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-800">
          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>প্রয়োজনীয় কাঁচামাল:</span>
          </span>
          <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            🍚 চাল: {calculatedRiceKg} কেজি
          </span>
          <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            🛢️ তেল: {calculatedOilL} লিটার
          </span>
          <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            🥣 ডাল: {calculatedDalKg} কেজি
          </span>
          <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            🌾 আটা: {calculatedAttaKg} কেজি
          </span>
        </div>

        <button
          onClick={handleApply}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span>মেনু অনুযায়ী বাজার তৈরি করুন</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
