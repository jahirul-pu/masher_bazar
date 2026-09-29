'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, TrendingDown, RefreshCw, Check } from 'lucide-react';

interface HeroProps {
  lang: 'bn' | 'en';
  selectedSize?: number;
  onQuickAiPrompt: (prompt: string) => void;
  onSelectFamilyPreset: (size: number, budget: number) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  selectedSize = 4,
  onQuickAiPrompt,
  onSelectFamilyPreset,
}) => {
  const [promptText, setPromptText] = useState('');

  const handleSubmitAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim()) {
      onQuickAiPrompt(promptText);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-masik-50/60 via-slate-50 to-white py-12 sm:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Bengali Catchphrase Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold mb-6 border border-emerald-300 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-masik-600" />
            <span>
              {lang === 'bn'
                ? 'বাজার করতে হবে না। বাজার হয়ে যাবে।'
                : 'You Don’t Have to Shop. We Prepare Your Market.'}
            </span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            {lang === 'bn' ? (
              <>
                এক মাসের বাজার। <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-masik-700 via-masik-600 to-teal-500">
                  এক অর্ডারে। সর্বোচ্চ সাশ্রয়ে।
                </span>
              </>
            ) : (
              <>
                Your Whole Month’s Market. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-masik-700 via-masik-600 to-teal-500">
                  In One Order. Better Price.
                </span>
              </>
            )}
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 mb-10 leading-relaxed">
            {lang === 'bn'
              ? 'আপনার পরিবারের সদস্য সংখ্যা ও মাসিক বাজেট জানান। আমরা আপনার পুরো মাসের প্রয়োজনীয় চাল, ডাল, তেল ও নিত্যপণ্যের বাজার প্রস্তুত করব এবং প্রতি মাসে সাশ্রয় করিয়ে দেব।'
              : 'Tell us about your household and budget. We will prepare, optimize, and deliver your monthly household market with bulk procurement savings.'}
          </p>

          {/* Bengali AI Natural Language Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <form
              onSubmit={handleSubmitAi}
              className="glass-card p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-masik-900/5 flex flex-col sm:flex-row gap-2 border border-masik-200"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Sparkles className="w-5 h-5 text-masik-600 shrink-0" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder={
                    lang === 'bn'
                      ? 'উদাহরণ: "আমাদের বাসায় ৪ জন, মাসে ৬ হাজার টাকার বাজার করি"'
                      : 'e.g., "Family of 4, monthly grocery budget ৳6000"'
                  }
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-masik-700 hover:bg-masik-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-masik-700/20 shrink-0"
              >
                <span>{lang === 'bn' ? 'বাজার তৈরি করুন' : 'Generate Market'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-2 text-left sm:text-center">
              💡 {lang === 'bn' ? 'বাংলা অথবা ইংরেজিতে আপনার পরিবারের চাহিদা লিখুন' : 'Describe your family requirements in Bengali or English'}
            </p>
          </div>

          {/* Quick Family Preset Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              {lang === 'bn' ? 'দ্রুত প্যাকেজ:' : 'Quick Packages:'}
            </span>
            {[
              { size: 2, budget: 3500, icon: '👫', labelBn: 'ছোট পরিবার (১-২ জন)', labelEn: 'Small Family (1-2)' },
              { size: 4, budget: 6000, icon: '👨‍👩‍👧‍👦', labelBn: 'আদর্শ পরিবার (৩-৪ জন)', labelEn: 'Family (3-4)' },
              { size: 6, budget: 9000, icon: '🏡', labelBn: 'বড় পরিবার (৫-৬ জন)', labelEn: 'Large Family (5-6)' },
            ].map((pkg) => {
              const isSelected = selectedSize === pkg.size;
              return (
                <button
                  key={pkg.size}
                  type="button"
                  onClick={() => onSelectFamilyPreset(pkg.size, pkg.budget)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isSelected
                      ? 'bg-masik-700 text-white border border-masik-700 shadow-md shadow-masik-700/25 ring-2 ring-masik-500/40 scale-[1.03]'
                      : 'bg-white hover:bg-masik-50/90 text-slate-700 border border-slate-200 hover:border-masik-300'
                  }`}
                >
                  <span className="text-base">{pkg.icon}</span>
                  <span>{lang === 'bn' ? pkg.labelBn : pkg.labelEn}</span>
                  {isSelected && (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/25 text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Pillars Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-masik-700 flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {lang === 'bn' ? 'গড় ৮-১৫% মাসিক সাশ্রয়' : '8-15% Average Monthly Savings'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'বাল্ক প্রকিউরমেন্টের কারণে সাধারণ খুচরা মূল্যের চেয়ে প্রতি মাসে ৫০০ থেকে ১৫০০ টাকা সাশ্রয়।'
                  : 'Aggregated bulk demand unlocks direct distributor pricing passed directly to your household.'}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {lang === 'bn' ? '৩০ দিনের প্রাইস লক গ্যারান্টি' : '30-Day Price Lock Guarantee'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'বাজারের জিনিসপত্রের দাম বাড়লেও আপনার নিশ্চিত করা মাসের বাজারের মূল্য ৩০ দিন অপরিবর্তিত থাকে।'
                  : 'Shield your family budget against wholesale commodity spikes with guaranteed price locks.'}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {lang === 'bn' ? 'স্যালারি-সাইকেল শিডিউল' : 'Salary-Cycle Scheduled Delivery'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'প্রতি মাসের বেতন পাওয়ার তারিখে স্বয়ংক্রিয়ভাবে আপনার দরজায় পৌঁছে যাবে প্রয়োজনীয় বাজার।'
                  : 'Synchronize monthly delivery directly with your payday (1st, 5th, 10th) with one-tap recurring reorder.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
