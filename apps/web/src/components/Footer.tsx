'use client';

import React from 'react';
import { ShoppingBag, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  lang: 'bn' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                {lang === 'bn' ? 'মাসের বাজার' : 'Masher Bazar'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {lang === 'bn'
                ? 'বাংলাদেশের প্রথম পরিবার-কেন্দ্রিক মাসিক গ্রোসারি অপারেটিং সিস্টেম। বাল্ক প্রকিউরমেন্ট ও শিডিউলড ডেলিভারির মাধ্যমে সাশ্রয়ী ও ঝামেলামুক্ত গৃহস্থালী সমাধান।'
                : 'Bangladesh’s premier household grocery operating system. Eliminating monthly shopping chores through bulk procurement, budget optimization, and scheduled deliveries.'}
            </p>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'bn' ? '১০০% আসল ও ফ্রেশ পণ্যের নিশ্চয়তা' : '100% Genuine & Fresh Guaranteed'}</span>
            </div>
          </div>

          {/* Delivery Hubs (Dhaka Coverage) */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'bn' ? 'ডেলিভারি এরিয়া (ঢাকা)' : 'Dhaka Delivery Hubs'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>গুলশান ও বনানী (হোল সিটি কাভারেজ)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>উত্তরা (সেক্টর ১-১৮)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>ধানমন্ডি ও লালমাটিয়া</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>মিরপুর (সেকশন ১-১৪)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>সাভার ও আশুলিয়া জোন</span>
              </li>
            </ul>
          </div>

          {/* Business & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'bn' ? 'মডিউল ও সেবা' : 'Platform Modules'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>{lang === 'bn' ? 'মাসের বাজার ক্যালকুলেটর' : 'Monthly Market Generator'}</li>
              <li>{lang === 'bn' ? 'স্মার্ট বাজেট অপটিমাইজার' : 'Smart Budget Optimizer'}</li>
              <li>{lang === 'bn' ? '৩০ দিনের প্রাইস লক গ্যারান্টি' : '30-Day Price Lock Guarantee'}</li>
              <li>{lang === 'bn' ? 'মাসের বাজার এসেনশিয়ালস (প্রাইভেট লেবেল)' : 'Masher Essentials (Private Label)'}</li>
              <li>{lang === 'bn' ? 'মেস, হোস্টেল ও অফিস বিটুবি সার্ভিস' : 'B2B Mess & Office Supply'}</li>
            </ul>
          </div>

          {/* Payment & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'bn' ? 'সহযোগিতা ও পেমেন্ট' : 'Support & Payments'}
            </h4>
            <div className="space-y-2 text-xs text-slate-400 mb-4">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>হটলাইন: 16XXX (সকাল ৯টা - রাত ৯টা)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@masherbazar.com</span>
              </p>
            </div>
            <div className="text-[11px] text-slate-500">
              <span className="block mb-1.5 font-semibold text-slate-400">অনুমোদিত পেমেন্ট পার্টনার:</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-slate-800 rounded font-bold text-pink-400">bKash</span>
                <span className="px-2 py-1 bg-slate-800 rounded font-bold text-orange-400">Nagad</span>
                <span className="px-2 py-1 bg-slate-800 rounded font-bold text-blue-400">Visa / Card</span>
                <span className="px-2 py-1 bg-slate-800 rounded font-bold text-slate-300">COD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Masher Bazar Bangladesh. All rights reserved.</p>
          <p>
            {lang === 'bn'
              ? 'বাজার করতে হবে না। বাজার হয়ে যাবে।'
              : 'Your Whole Month’s Market. In One Order.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
