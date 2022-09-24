export function startServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.update();
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((error: string) => {
      console.error('ServiceWorker registration failed: ', error);
    });
  }
}
