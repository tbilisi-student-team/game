export function startServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.update();
    }).catch((error: string) => {
      console.error('ServiceWorker registration failed: ', error);
    });
  }
}
