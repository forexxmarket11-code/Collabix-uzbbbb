import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('collabix_pwa_prompt_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (isInstalled || isDismissed) {
    return null;
  }

  // Show if browser fired beforeinstallprompt OR if user is on iOS and not standalone
  const shouldShow = isInstallable || isIOS;

  if (!shouldShow) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => {
        setIsDismissed(true);
      }, 2500);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('collabix_pwa_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Floating Bottom / Banner Prompt for Mobile & Desktop */}
      <aside
        id="pwa-install-banner"
        aria-label="Ilovani o'rnatish taklifi"
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="bg-[#14121F] text-white p-4 rounded-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 backdrop-blur-md flex items-center justify-between gap-3">
          {/* App Icon Preview */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-0.5 shrink-0 shadow-md flex items-center justify-center">
              <img
                src="/icons/icon-96x96.png"
                alt="Collabix Icon"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  // Fallback icon if image error
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-sm text-white tracking-tight flex items-center gap-1.5 truncate">
                <span>Collabix Ilovasi</span>
                <span className="hidden sm:inline text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PWA
                </span>
              </h4>
              <p className="text-xs text-slate-300 truncate">
                {isIOS
                  ? "Ekranga qo'shing"
                  : "Tez va qulay ishlash"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="btn-pwa-install"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-heading font-bold text-xs shadow-md shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
            >
              {justInstalled ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>O'rnatildi!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>O'rnatish</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-pwa-dismiss"
              onClick={handleDismiss}
              aria-label="Yopish"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Installation Instruction Modal */}
      {showIOSModal && (
        <div
          id="pwa-ios-guide-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-[#14121F] text-white w-full max-w-sm rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className="font-heading font-bold text-lg text-center mb-2">
              iOS (iPhone / iPad) ga o'rnatish
            </h3>
            <p className="text-xs text-slate-300 text-center mb-6 leading-relaxed">
              Safari brauzeri orqali Collabix ilovasini bosh ekranga qo'shish uchun 2 ta oddiy qadam:
            </p>

            <ol className="space-y-4 text-xs text-slate-200 mb-6">
              <li className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  1
                </span>
                <span className="leading-relaxed">
                  Safari pastki panelidagi <strong className="text-white inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 text-blue-400 inline" /> "Ulashish" (Share)</strong> tugmasini bosing.
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  2
                </span>
                <span className="leading-relaxed">
                  Menyuni biroz pastga surib, <strong className="text-white inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-indigo-400 inline" /> "Bosh ekranga qo'shish" (Add to Home Screen)</strong> bandini tanlang.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-xs uppercase tracking-wider"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </>
  );
};
