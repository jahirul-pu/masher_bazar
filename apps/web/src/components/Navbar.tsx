import React, { useState } from 'react';
import { ShoppingBag, MapPin, Globe, User, Phone, X, CheckCircle, ShieldCheck, LogOut } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface NavbarProps {
  lang: 'bn' | 'en';
  onToggleLang: () => void;
  basketCount: number;
  totalSavings: number;
  totalMasik?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  basketCount,
  totalSavings,
  totalMasik = 0,
  onOpenCart,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [phone, setPhone] = useState('01712345678');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; phone: string; credits: number } | null>(null);

  const handleSendOtp = () => {
    if (phone.length < 11) return;
    setOtpSent(true);
    setOtp('123456');
  };

  const handleVerifyOtp = () => {
    if (otp === '123456' || otp.length === 6) {
      setLoggedInUser({
        name: 'জাহাঙ্গীর আলম',
        phone,
        credits: 100, // ৳100 welcome bonus credits
      });
      setShowAuthModal(false);
      setOtpSent(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <>
      {/* Top E-Commerce Announcement Bar */}
      <div className="bg-gradient-to-r from-masik-950 via-masik-900 to-slate-950 text-white text-[11px] py-1.5 px-4 font-semibold border-b border-masik-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
              {lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
            </span>
            <span className="text-emerald-200 truncate">
              {lang === 'bn'
                ? '🚚 ঢাকা মেট্রোতে ৳২,০০০+ অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি | মিল ও পাইকারি রেটে পুরো মাসের গ্রোসারি'
                : '🚚 Free delivery across Dhaka metro for orders ৳2,000+ | Wholesale monthly grocery'}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-amber-300 hidden md:inline">
              🔥 {lang === 'bn' ? 'কোড: MASHER100 এ ৳১০০ ছাড়' : 'Code: MASHER100 for ৳100 OFF'}
            </span>
            <a
              href="tel:09600000000"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>16XXX</span>
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 glass-card bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-masik-800 via-masik-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-masik-800/30 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-masik-950 block leading-tight">
                    {lang === 'bn' ? 'মাসের বাজার' : 'Masher Bazar'}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-masik-600 tracking-wider uppercase block">
                    {lang === 'bn' ? 'পাইকারি মাসিক বাজার শপ' : 'Wholesale Monthly Grocery'}
                  </span>
                </div>
              </a>
            </div>

            {/* Dhaka Delivery Zone Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-masik-50 text-masik-900 rounded-full text-xs font-semibold border border-masik-200 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-masik-700" />
              <span>
                {lang === 'bn'
                  ? 'ঢাকা মেট্রো: মিরপুর, ধানমন্ডি, গুলশান, বনানী, উত্তরা'
                  : 'Dhaka: Mirpur, Dhanmondi, Gulshan, Banani, Uttara'}
              </span>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {totalSavings > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200">
                  <span>🔥 {lang === 'bn' ? 'সাশ্রয়:' : 'Saving:'} {formatPrice(totalSavings, lang)}</span>
                </div>
              )}

              {/* Language Toggle */}
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-masik-600" />
                <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {/* Interactive Cart Button */}
              <button
                type="button"
                onClick={onOpenCart || (() => {
                  document.getElementById('basket-section')?.scrollIntoView({ behavior: 'smooth' });
                })}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-masik-700 hover:bg-masik-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-masik-700/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                title="View Basket"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  {basketCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {basketCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase">
                    {lang === 'bn' ? 'বাজার ঝুড়ি' : 'My Basket'}
                  </span>
                  <span className="text-xs font-black">
                    {totalMasik > 0 ? formatPrice(totalMasik, lang) : (lang === 'bn' ? 'খালি' : 'Empty')}
                  </span>
                </div>
              </button>

              {/* Account / Login */}
              {loggedInUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                      {loggedInUser.name.slice(0, 1)}
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-slate-800 block leading-tight">{loggedInUser.name}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        {formatPrice(loggedInUser.credits, lang)} {lang === 'bn' ? 'ক্রেডিট' : 'Credits'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-masik-700" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Phone OTP Login Modal (Section 8 PRD) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-masik-100 text-masik-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'bn' ? 'মাসের বাজারে স্বাগতম' : 'Welcome to Masher Bazar'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'bn'
                  ? 'আপনার ১১ ডিজিটের মোবাইল নম্বর দিয়ে সহজে লগইন বা সাইন-আপ করুন'
                  : 'Enter your 11-digit Bangladeshi mobile number to continue'}
              </p>
            </div>

            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর (+৮৮০)' : 'Mobile Number (+880)'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    maxLength={11}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 tracking-wider focus:outline-none focus:border-masik-600 focus:bg-white transition-colors"
                  />
                </div>

                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    🎁 নতুন গ্রাহকদের জন্য প্রথম অর্ডারে ৳১০০ বোনাস ক্রেডিট!
                  </span>
                </div>

                <button
                  onClick={handleSendOtp}
                  className="w-full py-3.5 rounded-xl bg-masik-700 hover:bg-masik-800 text-white font-black text-sm shadow-lg shadow-masik-700/25 transition-all"
                >
                  {lang === 'bn' ? 'ওটিপি পাঠান (Send OTP)' : 'Send Verification OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'bn' ? '৬-ডিজিটের এসএমএস ওটিপি' : 'Enter 6-Digit SMS OTP'}
                    </label>
                    <button
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-masik-700 font-bold hover:underline"
                    >
                      {lang === 'bn' ? 'নম্বর পরিবর্তন' : 'Change Phone'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest text-slate-900 focus:outline-none focus:border-masik-600 focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1 text-center">
                    (স্যান্ডবক্স ওটিপি টেস্ট কোড: <b>123456</b>)
                  </span>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-masik-700 hover:from-emerald-700 hover:to-masik-800 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all"
                >
                  {lang === 'bn' ? 'যাচাই করুন ও প্রবেশ করুন' : 'Verify & Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
