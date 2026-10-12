export * from './hooks/usePWAInstall';

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          registration.update();
          console.log('Collabix Service Worker faollashtirildi, qamrov doirasi:', registration.scope);
        })
        .catch((error) => {
          console.warn('Collabix Service Worker ro‘yxatdan o‘tishda xatolik:', error);
        });
    });
  }
}
