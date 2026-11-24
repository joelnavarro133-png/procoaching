// sw.js · v18 · Guarda la web en el teléfono/navegador para que abra más rápido y funcione con poca señal.
// SOLO se activa en la web publicada (GitHub Pages) abierta desde un navegador.
// No se usa dentro de la app Android (la app tiene su propia memoria) ni en el enlace de Apps Script.
//
// Reglas:
//  · Página (index.html): primero internet; si tarda más de 3,5 s o no hay señal, la última copia guardada.
//  · JS y CSS con «?v=número»: cada publicación cambia el número, así que la copia guardada nunca queda vieja.
//  · GIFs e imágenes de ejercicios: se guardan la primera vez y después salen del teléfono (máx. 300).
//  · version.json y las llamadas al servidor (Apps Script) NUNCA se guardan.

const CAJA_APP = 'procoaching-app-v18';
const CAJA_EJ = 'procoaching-gifs-v1';
const MAX_EJ = 300;
const ESPERA_RED_MS = 3500;

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CAJA_APP).then(c => c.add('offline.html')).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('procoaching-app-') && k !== CAJA_APP) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (url.pathname.endsWith('/version.json') || url.pathname.endsWith('/sw.js')) return;
    if (url.searchParams.has('v')) { e.respondWith(primeroGuardado(e, req, CAJA_APP, 80)); return; }
    e.respondWith(primeroRed(e, req));
    return;
  }
  if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/exercises-dataset')) {
    e.respondWith(primeroGuardado(e, req, CAJA_EJ, MAX_EJ));
    return;
  }
  if (url.hostname === 'fonts.gstatic.com') e.respondWith(primeroGuardado(e, req, CAJA_APP, 80));
});

/** Copia guardada si existe; si no, internet (y se guarda). */
async function primeroGuardado(e, req, caja, max) {
  const c = await caches.open(caja);
  const g = await c.match(req);
  if (g) return g;
  const externo = new URL(req.url).origin !== self.location.origin;
  // Los recursos de otros sitios se piden «con CORS» para poder guardarlos sin ocupar espacio de más
  const r = await fetch(externo ? new Request(req.url, { mode: 'cors', credentials: 'omit' }) : req).catch(() => null)
    || (externo ? await fetch(req).catch(() => null) : null);
  if (r && r.ok) {
    e.waitUntil(c.put(req, r.clone()).then(() => (max ? podar(c, max) : null)).catch(() => {}));
  }
  return r || Response.error();
}

/** Internet primero; si tarda o falla, la última copia (y para páginas, la pantalla «sin conexión»). */
async function primeroRed(e, req) {
  const c = await caches.open(CAJA_APP);
  const red = fetch(req).then(r => {
    if (r && r.ok && r.type === 'basic') e.waitUntil(c.put(req, r.clone()).catch(() => {}));
    return r;
  });
  e.waitUntil(red.catch(() => {}));
  const tiempo = new Promise(res => setTimeout(() => res(null), ESPERA_RED_MS));
  const primera = await Promise.race([red.catch(() => null), tiempo]);
  if (primera) return primera;
  const g = await c.match(req, { ignoreSearch: req.mode === 'navigate' });
  if (g) return g;
  try { return await red; } catch (err) {
    if (req.mode === 'navigate') { const off = await c.match('offline.html') || await c.match(new URL('offline.html', self.location.href).href); if (off) return off; }
    return Response.error();
  }
}

async function podar(c, max) {
  const ks = await c.keys();
  if (ks.length > max) for (const k of ks.slice(0, ks.length - max)) await c.delete(k);
}
