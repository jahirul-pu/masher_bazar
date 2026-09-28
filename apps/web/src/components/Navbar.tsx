import React, { useState } from 'react';
import { ShoppingBag, MapPin, Globe, User, Phone, X, CheckCircle, ShieldCheck, LogOut } from 'lucide-react';

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
              {loggedInUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                      {loggedInUser.name.slice(0, 1)}
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-slate-800 block leading-tight">{loggedInUser.name}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">৳{loggedInUser.credits} ক্রেডিট বোনাস</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-masik-700 hover:bg-masik-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
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
                {lang === 'bn' ? 'মাসিক বাজারে স্বাগতম' : 'Welcome to Masik Bazar'}
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
