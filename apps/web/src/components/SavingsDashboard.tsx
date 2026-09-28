'use client';

import React from 'react';
import { TrendingUp, Award, Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SavingsDashboardProps {
  lang: 'bn' | 'en';
  onRepeatLastMarket: () => void;
}

export const SavingsDashboard: React.FC<SavingsDashboardProps> = ({
  lang,
  onRepeatLastMarket,
}) => {
  const monthlySavingsHistory = [
    { monthBn: 'এপ্রিল', monthEn: 'April', saved: 420, total: 5800 },
    { monthBn: 'মে', monthEn: 'May', saved: 510, total: 6100 },
    { monthBn: 'জুন', monthEn: 'June', saved: 380, total: 5750 },
    { monthBn: 'জুলাই', monthEn: 'July', saved: 620, total: 6250 },
    { monthBn: 'আগস্ট', monthEn: 'August', saved: 540, total: 5900 },
    { monthBn: 'সেপ্টেম্বর', monthEn: 'September', saved: 680, total: 6050 },
  ];

  return (
    <section className="py-12 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-masik-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ব্যক্তিগত সেভিংস পোর্টাল' : 'Household Savings Intelligence'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {lang === 'bn' ? 'আমার মাসিক বাজার সেভিংস ড্যাশবোর্ড' : 'My Lifetime Savings Dashboard'}
            </h2>
          </div>

          {/* 1-Tap Repeat Last Month Button (Section 20 PRD) */}
          <button
            onClick={onRepeatLastMarket}
            className="px-5 py-2.5 rounded-xl bg-masik-100 hover:bg-masik-200 text-masik-900 font-bold text-xs sm:text-sm flex items-center gap-2 border border-masik-300 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-masik-700" />
            <span>{lang === 'bn' ? 'আগের মাসের বাজার পুনরাবৃত্তি করুন' : '1-Tap Reorder Last Month'}</span>
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block mb-1">
              {lang === 'bn' ? 'মোট সম্পন্ন অর্ডার' : 'Total Monthly Orders'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">৮টি</span>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">✓ ১০০% সফল ডেলিভারি</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block mb-1">
              {lang === 'bn' ? 'মোট খরচ' : 'Total Spent'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">৳৪৮,৯২০</span>
            <span className="text-[11px] text-slate-400 mt-1 block">গড় ৳৬,১০০ / মাস</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50">
            <span className="text-xs text-emerald-800 font-semibold block mb-1">
              {lang === 'bn' ? 'সর্বমোট সাশ্রয়' : 'Lifetime Savings'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">৳৪,১৮০</span>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 block">🔥 সরাসরি বাল্ক ডিসকাউন্ট</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-amber-200 bg-amber-50/50">
            <span className="text-xs text-amber-800 font-semibold block mb-1">
              {lang === 'bn' ? 'গড় সাশ্রয় হার' : 'Average Savings Rate'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block">৮.৫%</span>
            <span className="text-[11px] text-amber-800 font-bold mt-1 block">মার্কেট রিটেল প্রাইজ তুলনা</span>
          </div>
        </div>

        {/* Visual Bar Chart of Monthly History */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-masik-600" />
            <span>{lang === 'bn' ? 'মাসওয়ারী সাশ্রয়ের ইতিহাস' : 'Month-over-Month Verified Savings'}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {monthlySavingsHistory.map((m) => (
              <div
                key={m.monthEn}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center flex flex-col justify-between"
              >
                <span className="text-xs font-bold text-slate-700 mb-2 block">
                  {lang === 'bn' ? m.monthBn : m.monthEn}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${(m.saved / 800) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-black text-emerald-700 block">
                  +৳{m.saved}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  বাজার: ৳{m.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
