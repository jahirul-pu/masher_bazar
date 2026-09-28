'use client';

import React, { useState } from 'react';
import {
  Users,
  Building2,
  Share2,
  FileText,
  Calculator,
  CheckCircle2,
  Coffee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { DisplayBasketItem } from './BasketDisplay';

interface B2bCorporateMessProps {
  lang: 'bn' | 'en';
  onApplyMessBasket: (items: DisplayBasketItem[]) => void;
}

export const B2bCorporateMess: React.FC<B2bCorporateMessProps> = ({
  lang,
  onApplyMessBasket,
}) => {
  const [activeTab, setActiveTab] = useState<'mess' | 'corporate'>('mess');

  // Mess State
  const [messMembers, setMessMembers] = useState(6);
  const [messCookType, setMessCookType] = useState<'cook' | 'self'>('cook');
  const [messCopied, setMessCopied] = useState(false);

  // Corporate State
  const [staffCount, setStaffCount] = useState(25);
  const [companyName, setCompanyName] = useState('Tech Solutions Dhaka Ltd');
  const [binNumber, setBinNumber] = useState('123456789-0101');
  const [corporateOrderSubmitted, setCorporateOrderSubmitted] = useState(false);

  // Mess Bulk Calculations
  // 6 members = ~50kg rice, 16L oil, 10kg dal, 15kg potato, 10kg onion
  const messRiceKg = Math.max(25, messMembers * 8);
  const messOilLiters = Math.max(8, Math.round(messMembers * 2.5));
  const messDalKg = Math.max(4, Math.round(messMembers * 1.5));
  const messPotatoKg = Math.max(10, messMembers * 2.5);
  const messOnionKg = Math.max(5, Math.round(messMembers * 1.5));

  // Pricing (Wholesale bulk discount)
  const messRiceCost = Math.round(messRiceKg * 72); // ৳72/kg wholesale
  const messOilCost = Math.round(messOilLiters * 155); // ৳155/L
  const messDalCost = Math.round(messDalKg * 145);
  const messPotatoCost = Math.round(messPotatoKg * 42);
  const messOnionCost = Math.round(messOnionKg * 75);
  const messMiscSpicesCost = messMembers * 250;

  const totalMessCost =
    messRiceCost + messOilCost + messDalCost + messPotatoCost + messOnionCost + messMiscSpicesCost;
  const perMemberCost = Math.round(totalMessCost / messMembers);

  // Corporate Office Pantry Calculations (Section 74 PRD)
  const teaPacks = Math.ceil(staffCount / 10);
  const sugarKg = Math.ceil(staffCount * 0.4);
  const milkPacks = Math.ceil(staffCount * 0.3);
  const tissueBoxes = Math.ceil(staffCount * 0.8);
  const biscuitsPacks = Math.ceil(staffCount * 1.2);
  const cleanerPacks = Math.ceil(staffCount / 12);

  const corporateSubtotal =
    teaPacks * 480 +
    sugarKg * 140 +
    milkPacks * 780 +
    tissueBoxes * 65 +
    biscuitsPacks * 55 +
    cleanerPacks * 450;
  const corporateVat = Math.round(corporateSubtotal * 0.05); // 5% VAT
  const corporateTotal = corporateSubtotal + corporateVat;

  const handleApplyMessToBasket = () => {
    const messItems: DisplayBasketItem[] = [
      {
        variantId: 'v-mess-rice-50k',
        nameEn: `Bulk Miniket Rice (${messRiceKg}kg Sack)`,
        nameBn: `মেস বাল্ক মিনিকেট চাল (${messRiceKg} কেজি বস্তা)`,
        category: 'চাল ও ডাল',
        unit: 'KG',
        unitValue: messRiceKg,
        quantity: 1,
        unitMasikPrice: messRiceCost,
        unitMrp: Math.round(messRiceCost * 1.1),
        isRecurring: true,
      },
      {
        variantId: 'v-mess-oil-16l',
        nameEn: `Bulk Fortified Soybean Oil (${messOilLiters} Liters)`,
        nameBn: `মেস বাল্ক সয়াবিন তেল (${messOilLiters} লিটার ড্রাম/বোতল)`,
        category: 'তেল ও ঘি',
        unit: 'LITER',
        unitValue: messOilLiters,
        quantity: 1,
        unitMasikPrice: messOilCost,
        unitMrp: Math.round(messOilCost * 1.09),
        isRecurring: true,
      },
      {
        variantId: 'v-mess-dal-bulk',
        nameEn: `Desi Masoor Dal (${messDalKg}kg Sack)`,
        nameBn: `মেস দেশি মসুর ডাল (${messDalKg} কেজি)`,
        category: 'চাল ও ডাল',
        unit: 'KG',
        unitValue: messDalKg,
        quantity: 1,
        unitMasikPrice: messDalCost,
        unitMrp: Math.round(messDalCost * 1.1),
        isRecurring: true,
      },
      {
        variantId: 'v-mess-potato-bulk',
        nameEn: `Fresh Munshiganj Potato (${messPotatoKg}kg Sack)`,
        nameBn: `মুন্সীগঞ্জ আলু বস্তা (${messPotatoKg} কেজি)`,
        category: 'তাজা আলু ও পেঁয়াজ',
        unit: 'KG',
        unitValue: messPotatoKg,
        quantity: 1,
        unitMasikPrice: messPotatoCost,
        unitMrp: Math.round(messPotatoCost * 1.12),
        isRecurring: true,
      },
      {
        variantId: 'v-mess-onion-bulk',
        nameEn: `Pabna Red Onion (${messOnionKg}kg Sack)`,
        nameBn: `পাবনার দেশি পেঁয়াজ (${messOnionKg} কেজি)`,
        category: 'তাজা আলু ও পেঁয়াজ',
        unit: 'KG',
        unitValue: messOnionKg,
        quantity: 1,
        unitMasikPrice: messOnionCost,
        unitMrp: Math.round(messOnionCost * 1.14),
        isRecurring: true,
      },
    ];

    onApplyMessBasket(messItems);
  };

  const handleCopyMessWhatsapp = () => {
    const text = `📢 মাসের বাজার মেস হিসাব (মেম্বার: ${messMembers} জন)\nমোট বাজার: ৳${totalMessCost.toLocaleString()}\nজনপ্রতি খরচ: ৳${perMemberCost.toLocaleString()}\nচাল: ${messRiceKg}kg, তেল: ${messOilLiters}L, ডাল: ${messDalKg}kg, আলু: ${messPotatoKg}kg\nঅর্ডার করতে ভিজিট করুন: https://masherbazar.com`;
    navigator.clipboard.writeText(text);
    setMessCopied(true);
    setTimeout(() => setMessCopied(false), 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 shadow-md">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>{lang === 'bn' ? 'স্পেশাল বি২বি ও যৌথ বাজার' : 'Corporate & Bachelor Mess Division'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {lang === 'bn' ? 'মেস ও করপোরেট প্যান্ট্রি বাজার (Section 70-74)' : 'Mess & Corporate Pantry Solutions'}
          </h2>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('mess')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'mess'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ব্যাচেলর মেস মোড' : 'Bachelor Mess Mode'}</span>
          </button>
          <button
            onClick={() => setActiveTab('corporate')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'corporate'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'কর্পোরেট অফিস প্যান্ট্রি' : 'Corporate Pantry Mode'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'mess' ? (
        /* ================== BACHELOR MESS MODE ================== */
        <div className="space-y-6">
          <div className="bg-indigo-50/80 rounded-2xl p-4 sm:p-5 border border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-indigo-950">
                {lang === 'bn' ? 'ঢাকা মেস কোটা ক্যালকুলেটর' : 'Dhaka Bachelor Mess Cost Sharing'}
              </h4>
              <p className="text-xs text-indigo-800 mt-0.5">
                {lang === 'bn'
                  ? 'ধানমন্ডি, মিরপুর বা উত্তরায় ব্যাচেলর মেসের জন্য ৫০ কেজি চালের বস্তা ও ১৬ লিটার ড্রাম তেলে সর্বোচ্চ সাশ্রয়।'
                  : 'Automated bulk quota for Dhaka flat shares with instant WhatsApp split bill generation.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-indigo-900">মেস মেম্বার:</label>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-indigo-200">
                {[3, 4, 5, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setMessMembers(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold ${
                      messMembers === num ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Quotas Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">মিনিকেট চাল</span>
              <span className="text-xl font-black text-slate-800 block">{messRiceKg} কেজি</span>
              <span className="text-xs font-bold text-emerald-600 block mt-1">৳{messRiceCost}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">সয়াবিন ভোজ্য তেল</span>
              <span className="text-xl font-black text-slate-800 block">{messOilLiters} লিটার</span>
              <span className="text-xs font-bold text-emerald-600 block mt-1">৳{messOilCost}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">দেশি মসুর ডাল</span>
              <span className="text-xl font-black text-slate-800 block">{messDalKg} কেজি</span>
              <span className="text-xs font-bold text-emerald-600 block mt-1">৳{messDalCost}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">মুন্সীগঞ্জ আলু</span>
              <span className="text-xl font-black text-slate-800 block">{messPotatoKg} কেজি</span>
              <span className="text-xs font-bold text-emerald-600 block mt-1">৳{messPotatoCost}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">পাবনার দেশি পেঁয়াজ</span>
              <span className="text-xl font-black text-slate-800 block">{messOnionKg} কেজি</span>
              <span className="text-xs font-bold text-emerald-600 block mt-1">৳{messOnionCost}</span>
            </div>
          </div>

          {/* Split Bill Summary Card */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-indigo-200 uppercase tracking-wider font-semibold block mb-1">
                {messMembers} জন সদস্যের মেস হিসাব
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black">৳{totalMessCost.toLocaleString()}</span>
                <span className="text-xs text-indigo-200">মোট মাসের বাজার</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                <span className="text-xs text-indigo-100">জনপ্রতি খরচ:</span>
                <span className="text-base font-black text-emerald-300">৳{perMemberCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleCopyMessWhatsapp}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{messCopied ? '✓ কপি হয়েছে!' : 'মেস হোয়াটসঅ্যাপে শেয়ার'}</span>
              </button>

              <button
                onClick={handleApplyMessToBasket}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all"
              >
                <span>মেস বাজার লোড করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================== CORPORATE OFFICE PANTRY MODE ================== */
        <div className="space-y-6">
          <div className="bg-blue-50/80 rounded-2xl p-4 sm:p-5 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-blue-950">
                {lang === 'bn' ? 'কর্পোরেট অফিস প্যান্ট্রি ও ভ্যাট চালানের সুবিধা' : 'Corporate Office Pantry & Mushak-6.3'}
              </h4>
              <p className="text-xs text-blue-800 mt-0.5">
                {lang === 'bn'
                  ? 'অফিস টিস্যু, চা-কফি, ড্রিংকিং ওয়াটার ও পরিচ্ছন্নতা পণ্য সরাসরি বাল্ক সাপ্লাই এবং ৩০ দিনের ক্রেডিট ফ্যাসিলিটি।'
                  : 'Monthly office essentials with official 5% Mushak-6.3 VAT invoice and Net-30 enterprise credit.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-blue-900">কর্মী সংখ্যা:</label>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-blue-200">
                {[15, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => setStaffCount(count)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      staffCount === count ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {count} জন
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Corporate Form & Quotation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>কোম্পানি তথ্য ও ভ্যাট চালান</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">প্রতিষ্ঠানের নাম:</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">BIN / TIN নম্বর:</label>
                  <input
                    type="text"
                    value={binNumber}
                    onChange={(e) => setBinNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Monthly Office Consumption List */}
              <div className="border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  {staffCount} জন কর্মীর মাসিক গড় অফিস প্যান্ট্রি প্রয়োজন:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    ☕ ইস্পাহানি চা: <span className="font-bold">{teaPacks} প্যাক</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    🥛 ডানো মিল্ক: <span className="font-bold">{milkPacks} কেজি</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    🍚 ফ্রেশ চিনি: <span className="font-bold">{sugarKg} কেজি</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    🧻 বসুন্ধরা টিস্যু: <span className="font-bold">{tissueBoxes} বক্স</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    🍪 কুকিজ ও বিস্কুট: <span className="font-bold">{biscuitsPacks} প্যাক</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    🧴 হারপিক ও ফ্লোর ক্লিনার: <span className="font-bold">{cleanerPacks} প্যাক</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Invoice / Net-30 Approval */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
                <span className="text-xs font-bold text-indigo-300">আনুষ্ঠানিক কোটেশন সামারি</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Net-30 অনুমোদনযোগ্য
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-indigo-200">
                  <span>প্যান্ট্রি সাবটোটাল:</span>
                  <span className="font-bold">৳{corporateSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>সরকারি ভ্যাট (৫%):</span>
                  <span className="font-bold">৳{corporateVat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>ডেলিভারি (ঢাকা মেট্রো):</span>
                  <span className="text-emerald-400 font-bold uppercase">ফ্রি বাল্ক ডেলিভারি</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-indigo-800">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-emerald-300">৳{corporateTotal.toLocaleString()}</span>
                </div>
              </div>

              {corporateOrderSubmitted ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 text-center text-xs text-emerald-300 font-semibold">
                  ✓ কর্পোরেট কোটেশন ও ভ্যাট চালান আবেদন গৃহিত হয়েছে। আপনার সাথে আমাদের কী-অ্যাকাউন্ট ম্যানেজার যোগাযোগ করবেন।
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setCorporateOrderSubmitted(true)}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>কর্পোরেট ইনভয়েস অনুমোদন করুন</span>
                  </button>
                  <p className="text-[10px] text-center text-indigo-300">
                    *মুশক-৬.৩ চালান সরাসরি অ্যাকাউন্টিং ইমেইলে পাঠানো হবে।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
