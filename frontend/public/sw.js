const SHELL_CACHE = 'wonder-sprout-shell-v1';
const ASSET_CACHE = 'wonder-sprout-assets-v1';
const API_CACHE = 'wonder-sprout-api-v1';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const home = await fetch('/', { cache: 'reload' });
    if (!home.ok) throw new Error('Could not save the WonderSprout home screen.');
    const html = await home.clone().text();
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1]);
    const shell = await caches.open(SHELL_CACHE);
    await shell.put('/', home.clone());
    await shell.put('/index.html', home.clone());
    const staticFiles = ['/manifest.webmanifest', '/sprout-icon.svg', '/wonder-world-hero.png', ...assets];
    const cache = await caches.open(ASSET_CACHE);
    await Promise.all(staticFiles.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch { /* Optional art or fonts can be fetched on the next visit. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL_CACHE, ASSET_CACHE, API_CACHE]);
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('wonder-sprout-') && !keep.has(name)).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith((async () => {
      const cache = await caches.open(API_CACHE);
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        const saved = await cache.match(request);
        return saved ?? new Response(JSON.stringify({ message: 'This game has not been saved for offline play yet. Connect once, open the game, and try again.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    })());
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(SHELL_CACHE);
          await cache.put('/', response.clone());
          await cache.put('/index.html', response.clone());
        }
        return response;
      } catch {
        return (await caches.open(SHELL_CACHE)).match('/index.html') ?? Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(ASSET_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      return Response.error();
    }
  })());
});
