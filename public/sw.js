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

sw.addEventListener('fetch', (event) => {
  const { request } = event

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        console.log('Get response from cache.')
        return response
      }

      const requestClone = request.clone()

      return fetch(requestClone).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          console.log('Get bad response from server.')
          return response
        }

        const responseClone = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          console.log('Put response to cache.')
          cache.put(request, responseClone)
        })

        console.log('Get response from server.')
        return response
      })
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
