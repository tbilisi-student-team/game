const CACHE_NAME = 'game-cache_v_1'

const CACHING_URLS = ['/game', '/public']

const sw = self

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Add all URLS to cache.')
        return cache.addAll(CACHING_URLS)
      })
      .catch((error) => {
        console.error(error)
      }),
  )
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.filter(() => true).map((cacheName) => caches.delete(cacheName)))
    }),
  )
})
