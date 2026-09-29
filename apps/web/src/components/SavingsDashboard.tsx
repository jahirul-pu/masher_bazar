'use client';

import React from 'react';
import { TrendingUp, Award, Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatPrice, formatNumber, toBengaliNumber } from '@/utils/formatters';

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
              {lang === 'bn' ? 'আমার মাসের বাজার সেভিংস ড্যাশবোর্ড' : 'My Lifetime Savings Dashboard'}
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
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {lang === 'bn' ? `${toBengaliNumber(8)}টি` : '8 Orders'}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">✓ ১০০% সফল ডেলিভারি</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block mb-1">
              {lang === 'bn' ? 'মোট খরচ' : 'Total Spent'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{formatPrice(48920, lang)}</span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {lang === 'bn' ? `গড় ${formatPrice(6100, lang)} / মাস` : `Avg ${formatPrice(6100, lang)} / mo`}
            </span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50">
            <span className="text-xs text-emerald-800 font-semibold block mb-1">
              {lang === 'bn' ? 'সর্বমোট সাশ্রয়' : 'Lifetime Savings'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">{formatPrice(4180, lang)}</span>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 block">🔥 সরাসরি বাল্ক ডিসকাউন্ট</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-amber-200 bg-amber-50/50">
            <span className="text-xs text-amber-800 font-semibold block mb-1">
              {lang === 'bn' ? 'গড় সাশ্রয় হার' : 'Average Savings Rate'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block">{formatNumber(8.5, lang)}%</span>
            <span className="text-[11px] text-amber-800 font-bold mt-1 block">মার্কেট রিটেল প্রাইজ তুলনা</span>
          </div>
        </div>

        {/* Visual Bar Chart of Monthly History */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
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
                  +{formatPrice(m.saved, lang)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {lang === 'bn' ? `বাজার: ${formatPrice(m.total, lang)}` : `Market: ${formatPrice(m.total, lang)}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 7: Market Credits Loyalty Wallet & Viral Referral Section (Sections 65 & 66 PRD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Market Credits Wallet Card (Section 65) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-orange-50/50 to-amber-100/40 rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {lang === 'bn' ? 'মার্কেট ক্রেডিট ওয়ালেট (Section 65)' : 'Market Credits Wallet'}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">
                  ✓ সক্রিয়
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs text-amber-900 font-semibold block mb-1">
                  {lang === 'bn' ? 'ব্যবহারযোগ্য কারেন্ট ক্রেডিট ব্যালেন্স' : 'Available Redeemable Balance'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-amber-950">{formatPrice(150, lang)}</span>
                  <span className="text-xs text-amber-800 font-bold">
                    {lang === 'bn' ? `(${toBengaliNumber(150)} ক্রেডিট = ${formatPrice(150, lang)} নগদ মূল্য)` : `(150 credits = ${formatPrice(150, lang)} value)`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-900/80 leading-relaxed mb-4">
                {lang === 'bn'
                  ? 'প্রতিটি মাসের বাজারের জন্য ১% ক্যাশব্যাক ক্রেডিট জমা হয়। টানা ৩ মাস বাজার করলে বোনাস ১.৫ গুণ বৃদ্ধি পায়। চেকআউটে সরাসরি নগদ টাকার মতো কাটানো যায়।'
                  : 'Earn 1% cashback on every cycle. Consecutive on-time subscription orders unlock 1.5x multi-cycle bonus credits.'}
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-3 border border-amber-200/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">লাইফটাইম অর্জিত ক্রেডিট:</span>
              <span className="font-extrabold text-amber-900">{formatPrice(480, lang)}</span>
            </div>
          </div>

          {/* Viral Referral Program Card (Section 66) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 text-emerald-100 px-3 py-1 rounded-full backdrop-blur-sm">
                  {lang === 'bn' ? 'রেফারাল রিওয়ার্ড প্রোগ্রাম (Section 66)' : 'Viral Neighbor Referral'}
                </span>
                <span className="text-xs text-emerald-200">
                  {lang === 'bn' ? `${toBengaliNumber(3)} জন সফল রেফার` : '3 Successful Referrals'}
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black leading-snug mb-2">
                {lang === 'bn'
                  ? `প্রতিবেশী বা কলিগকে রেফার করলেই উভয়ের জন্য ${formatPrice(100, lang)} ডিসকাউন্ট!`
                  : `Give ${formatPrice(100, lang)}, Get ${formatPrice(100, lang)} for every Dhaka neighbor referred!`}
              </h4>

              <p className="text-xs text-emerald-100 leading-relaxed mb-6">
                {lang === 'bn'
                  ? `আপনার রেফারেলে বন্ধু প্রথম মাসের বাজারে পাবেন ${formatPrice(100, lang)} ডিসকাউন্ট, আর অর্ডার ডেলিভারি হতেই আপনার অ্যাকাউন্টে জমা হবে ${formatPrice(100, lang)} ক্রেডিট।`
                  : `Your unique code gives friends ${formatPrice(100, lang)} off their first monthly stock-up, and deposits ${formatPrice(100, lang)} credits directly into your wallet upon delivery.`}
              </p>
            </div>

            {/* Code & WhatsApp Share Buttons */}
            <div className="space-y-3 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-200 uppercase font-bold block">আপনার রেফারেল কোড</span>
                  <span className="text-base font-black text-white tracking-widest">MASHER-DHAKA-26</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://masherbazar.com/ref/MASHER-DHAKA-26');
                    alert(lang === 'bn' ? 'রেফারেল লিঙ্ক কপি হয়েছে!' : 'Referral link copied!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  লিঙ্ক কপি করুন
                </button>
              </div>

              <button
                onClick={() => {
                  const msg = encodeURIComponent(
                    'মাসের বাজার থেকে পাইকারি রেটে পুরো মাসের গ্রোসারি কিনুন এবং প্রথম অর্ডারে ৳১০০ ছাড় পান! কোড: MASHER-DHAKA-26 https://masherbazar.com/ref/MASHER-DHAKA-26'
                  );
                  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>💬 হোয়াটসঅ্যাপে শেয়ার করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
