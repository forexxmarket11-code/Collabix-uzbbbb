import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  Search,
  Send,
  Eye,
  Award,
  MessageSquare,
  Clock,
  BarChart3,
  TrendingUp,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { UserSession } from '../types';
import { activateProSubscription } from '../firebase';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onUpdateUser: (user: UserSession) => void;
  onOpenRegisterModal?: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onOpenRegisterModal,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [selectedProvider, setSelectedProvider] = useState<'click' | 'payme' | 'uzcard'>('click');
  const [cardNumber, setCardNumber] = useState('8600 •••• •••• 4219');
  const [isProcessing, setIsProcessing] = useState(false);
  const [nonLoggedInName, setNonLoggedInName] = useState('');
  const [nonLoggedInPhone, setNonLoggedInPhone] = useState('+998 ');

  if (!isOpen) return null;

  const handleStartPayment = () => {
    if (!currentUser && onOpenRegisterModal) {
      // If user isn't logged in, they can fill short info in payment step or open register
      setStep('payment');
    } else {
      setStep('payment');
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate real API transaction latency (1s)
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (currentUser?.uid) {
        const result = await activateProSubscription(currentUser.uid);
        const updated: UserSession = {
          ...currentUser,
          subscriptionStatus: 'active',
          trialStartDate: result.trialStartDate,
          trialEndDate: result.trialEndDate,
          reminderSent: false,
          subscriptionPlanPrice: 59000,
        };
        onUpdateUser(updated);
      } else {
        // Create demo session for visitor
        const now = new Date();
        const trialStartDate = now.toISOString();
        const trialEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const newSession: UserSession = {
          uid: 'pro_' + Math.random().toString(36).substring(2, 9),
          name: nonLoggedInName.trim() || 'Foydalanuvchi',
          contact: nonLoggedInPhone.trim() || '+998 90 123 45 67',
          role: 'brend',
          registeredAt: now.toLocaleDateString('uz-UZ'),
          city: 'Toshkent',
          subscriptionStatus: 'active',
          trialStartDate,
          trialEndDate,
          reminderSent: false,
          subscriptionPlanPrice: 59000,
        };
        onUpdateUser(newSession);
      }

      setStep('success');
    } catch (err) {
      console.error('Pro toʻlov xatosi:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setStep('details');
    onClose();
  };

  return (
    <div
      id="pro-upgrade-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      <div
        id="pro-upgrade-modal-card"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Decorative subtle gradient ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-indigo-600 to-purple-600" />

        {/* Close button */}
        <button
          type="button"
          id="btn-close-pro-modal"
          onClick={onClose}
          disabled={isProcessing}
          aria-label="Yopish"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'details' && (
          <div className="p-6 sm:p-8">
            {/* Header with Sparkle pill */}
            <div className="text-center max-w-lg mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-300/60 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Collabix Pro imkoniyatlari</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                Pro rejimga oʻtish
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-body mt-1.5 leading-relaxed">
                Platformadagi barcha qulayliklar va vositalardan cheklovlarsiz foydalaning.
              </p>
            </div>

            {/* 4 Clean Categorized Feature Blocks */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* KATEGORIYA: KIRISH IMKONIYATI */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Search className="w-3.5 h-3.5 stroke-[2.4]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                      KIRISH IMKONIYATI
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Toʻliq katalogga cheklovlarsiz kirish (barcha 100+ blogerlar)</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Barcha toifalar: Blogger, Mini Blogger, Model, Brand Face</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Cheksiz briflar yuborish</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* KATEGORIYA: KO'RINISH */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Eye className="w-3.5 h-3.5 stroke-[2.4]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      KOʻRINISH
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Profilingiz katalogda "Pro" nishoni bilan ajralib turadi</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Qidiruv natijalarida yuqoriroq oʻrinda chiqish</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* KATEGORIYA: MULOQOT */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3.5 h-3.5 stroke-[2.4]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      MULOQOT
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Blogerlar bilan toʻgʻridan-toʻgʻri bogʻlanish (Telegram, telefon)</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>24 soat ichida kafolatlangan javob</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Maxsus yordam xizmati (Priority Support)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* KATEGORIYA: STATISTIKA */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-3.5 h-3.5 stroke-[2.4]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      STATISTIKA
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Blogerlarning haqiqiy auditoriya statistikasi (ER, demografiya)</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Soxta (nakrutka) obunachilarni aniqlash tizimi</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-body">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Hamkorlik natijalarini kuzatish</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Section: Primary CTA + Small informational notice + Payment Badges */}
            <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                id="btn-pro-activate-cta"
                onClick={handleStartPayment}
                className="w-full sm:w-auto min-w-[320px] py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-heading font-extrabold text-base sm:text-lg tracking-tight shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-98 transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300/30" />
                <span>Pro rejimga oʻtish — 59 000 soʻm/oy</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Informational reassurance notice */}
              <p className="text-[12px] sm:text-xs text-slate-500 dark:text-slate-400 font-body mt-2.5 max-w-md mx-auto leading-relaxed">
                30 kun ichida birorta ham kreator javob bermasa, 59 000 soʻm toʻliq qaytariladi. Istalgan vaqt bekor qilish mumkin.
              </p>

              {/* Supported Payment Badges */}
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400 dark:text-slate-500">
                <span className="text-[11px] font-mono">Qabul qilinadi:</span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-heading font-bold text-xs border border-blue-200/60 dark:border-blue-800/60">
                  CLICK
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-heading font-bold text-xs border border-cyan-200/60 dark:border-cyan-800/60">
                  Payme
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-heading font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60">
                  UzCard / Humo
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6 sm:p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                Pro rejim toʻlovi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-1">
                30 kunlik toʻliq imkoniyatlar uchun oylik toʻlov
              </p>
            </div>

            {/* Price badge */}
            <div className="mt-5 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-heading font-bold text-indigo-950 dark:text-indigo-200">
                  Pro rejim oylik obunasi
                </span>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-body">
                  Barcha 4 kategoriya imkoniyatlari ochiladi
                </p>
              </div>
              <div className="text-right">
                <span className="font-heading font-black text-xl text-indigo-950 dark:text-indigo-200">
                  59 000 soʻm
                </span>
                <span className="text-[11px] block text-indigo-600/80 dark:text-indigo-400">/ oy</span>
              </div>
            </div>

            {/* Guest form if not logged in */}
            {!currentUser && (
              <div className="mt-4 space-y-2.5">
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ismingiz yoki brend nomi:
                  </label>
                  <input
                    type="text"
                    value={nonLoggedInName}
                    onChange={(e) => setNonLoggedInName(e.target.value)}
                    placeholder="Masalan: Sardor Komilov"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-body text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telefon raqamingiz:
                  </label>
                  <input
                    type="tel"
                    value={nonLoggedInPhone}
                    onChange={(e) => setNonLoggedInPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-body text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Payment provider options */}
            <div className="mt-4">
              <label className="block text-xs font-heading font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Toʻlov usulini tanlang:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedProvider('click')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedProvider === 'click'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-heading">CLICK</span>
                  <span className="text-[10px] opacity-70">Tezkor toʻlov</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider('payme')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedProvider === 'payme'
                      ? 'border-cyan-600 bg-cyan-50/70 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-heading">Payme</span>
                  <span className="text-[10px] opacity-70">1-bosqich</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider('uzcard')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedProvider === 'uzcard'
                      ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-heading">Humo / Uzcard</span>
                  <span className="text-[10px] opacity-70">Bank kartasi</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                disabled={isProcessing}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-heading font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Ortga
              </button>
              <button
                type="button"
                id="btn-confirm-pro-payment"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-heading font-bold text-xs sm:text-sm tracking-tight shadow-md shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Toʻlov amalga oshirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Toʻlash va faollashtirish (59 000 soʻm)</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-3 font-body">
              Oylik obuna — 59 000 soʻm, istalgan vaqt bekor qilishingiz mumkin
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-md mb-4">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
              Pro rejim faollashtirildi! 🎉
            </span>

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Tabriklaymiz!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-body mt-2 max-w-md mx-auto leading-relaxed">
              Pro rejim faollashtirildi, 59 000 soʻm/oy. Toʻliq katalog, cheksiz briflar va barcha tahlillar bevosita ixtiyoringizda.
            </p>

            <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs text-left flex items-start gap-2.5 max-w-md mx-auto">
              <span className="text-base">🛡️</span>
              <div>
                <p className="font-heading font-bold">100% pul qaytarish kafolati</p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5 leading-normal">
                  30 kun ichida birorta ham kreator javob bermasa, 59 000 soʻm toʻliq qaytariladi. Istalgan vaqt profil sozlamalaridan obunani bekor qilish mumkin.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                id="btn-pro-success-finish"
                onClick={handleFinish}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-heading font-bold text-xs tracking-tight shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <span>Imkoniyatlardan foydalanish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
