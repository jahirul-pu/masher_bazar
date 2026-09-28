'use client';

import React, { useState } from 'react';
import { ShoppingBag, MapPin, Globe, User, Phone } from 'lucide-react';

interface NavbarProps {
  lang: 'bn' | 'en';
  onToggleLang: () => void;
  basketCount: number;
  totalSavings: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  basketCount,
  totalSavings,
}) => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-masik-700 via-masik-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-masik-600/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-masik-900 block leading-tight">
                {lang === 'bn' ? 'মাসিক বাজার' : 'Masik Bazar'}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-masik-600 tracking-wider uppercase block">
                {lang === 'bn' ? 'আপনার মাসিক বাজারের নির্ভরযোগ্য মাধ্যম' : 'Your Monthly Grocery OS'}
              </span>
            </div>
          </div>

          {/* Dhaka Delivery Zone Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-masik-50 text-masik-800 rounded-full text-xs font-medium border border-masik-200">
            <MapPin className="w-3.5 h-3.5 text-masik-600" />
            <span>
              {lang === 'bn'
                ? 'ডেলিভারি এরিয়া: গুলশান, বনানী, উত্তরা, ধানমন্ডি, মিরপুর, সাভার'
                : 'Dhaka Coverage: Gulshan, Banani, Uttara, Dhanmondi, Mirpur, Savar'}
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {totalSavings > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200 animate-pulse">
                <span>🔥 {lang === 'bn' ? 'সাশ্রয়:' : 'Saving:'} ৳{totalSavings.toLocaleString()}</span>
              </div>
            )}

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-masik-600" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Help Hotline */}
            <a
              href="tel:09600000000"
              className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-masik-700"
            >
              <Phone className="w-3.5 h-3.5 text-masik-600" />
              <span>16XXX</span>
            </a>

            {/* Account / Login */}
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-masik-700 hover:bg-masik-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm">
              <User className="w-4 h-4" />
              <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
