// Service worker simples: guarda o "esqueleto" do app (HTML/manifest) em cache
// para abrir mais rápido e funcionar parcialmente offline.
// Dados do Firestore continuam precisando de internet para ler/gravar,
// a menos que a persistência offline do Firestore seja ativada (veja README).

const CACHE_NAME = 'fabrica2-shell-v1';
const ARQUIVOS_PARA_CACHE = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Só intercepta requisições do próprio app; deixa Firebase/CDNs passarem direto pela rede.
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((resposta) => resposta || fetch(event.request))
  );
});
