/* ==========================================================================
   CRISTOLÂNDIA CHECK - SERVICE WORKER RESILIENTE (NETWORK-FIRST)
   Garante que atualizações na página reflitam instantaneamente sem limpar cache,
   mantendo suporte completo a funcionamento offline.
   ========================================================================== */

const CACHE_NAME = 'cristolandia-check-live-v46';

self.addEventListener('install', (event) => {
  // Ativa imediatamente a nova versão do worker sem esperar o fechamento de abas
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpa caches antigos e assume controle imediatamente de todas as telas
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia NETWORK-FIRST:
// 1. Sempre tenta buscar o arquivo mais recente da rede (mostra alterações na hora)
// 2. Salva uma cópia atualizada no cache
// 3. Se estiver offline ou sem conexão, entrega a versão do cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Ignora Firebase Realtime Database
  if (event.request.url.includes('firebaseio.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
