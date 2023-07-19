/* eslint-disable no-unused-expressions,no-restricted-globals */
// noinspection BadExpressionStatementJS

const CACHE_NAME = '<CACHE_NAME>';

self.addEventListener('install', () => {
  console.log('install 成功');
});

self.addEventListener('activate', (event) => {
  console.log('activate');
  async function cacheRequest() {
    return caches.keys()
      .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => {
        if (cacheName !== CACHE_NAME) {
          console.log('清除旧缓存:', cacheName);
          return caches.delete(cacheName);
        }
        return null;
      })));
  }

  event.waitUntil(cacheRequest());
});

self.addEventListener('fetch', (e) => {
  const event = e;

  // 只处理带 hash 的资源请求
  if (!event.request.url.startsWith('http') || !/\/\w*([.-])\w*\.(css|js)$/.test(event.request.url)) {
    return;
  }

  event.respondWith(caches.match(event.request)
    .then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          console.log('不缓存请求', response.status, response.type);
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(event.request, responseToCache));

        return response;
      });
    }));
});
