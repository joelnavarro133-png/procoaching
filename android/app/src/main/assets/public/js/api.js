// api.js · Capa de conexión con el servidor.
//
// Todo el código de la app llama al servidor con google.script.run (como dentro de Apps Script).
// Cuando la página se abre FUERA de Google (web propia o app Android), ese objeto no existe:
// este archivo lo crea y envía cada llamada por internet a la API (doPost en Código.gs):
//   POST API_URL   { "accion": "<función>", "args": [ ... ] }   →   la misma respuesta en JSON.
// Así el resto del código no cambia, y cambiar de base de datos solo requiere otra API
// que responda las mismas acciones (ver API.md).
(function () {
  if (window.google && window.google.script && window.google.script.run) return;   // dentro de Apps Script: se usa el original

  const cfg = window.PROCOACHING_CONFIG || {};
  const configurada = () => /^https:\/\//.test(String(cfg.API_URL || '')) && String(cfg.API_URL).indexOf('PEGA_AQUI') < 0;

  async function llamarApi(accion, args) {
    if (!configurada()) throw new Error('Falta configurar API_URL en js/config.js.');
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const reloj = ctrl ? setTimeout(() => ctrl.abort(), cfg.TIEMPO_MAXIMO_MS || 120000) : null;
    try {
      // text/plain evita la verificación previa (CORS) que Apps Script no responde
      const resp = await fetch(cfg.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: accion, args: args }),
        redirect: 'follow',
        signal: ctrl ? ctrl.signal : undefined
      });
      if (!resp.ok) throw new Error('El servidor respondió con el código ' + resp.status + '.');
      const texto = await resp.text();
      try { return JSON.parse(texto); }
      catch (e) { throw new Error('Respuesta no válida del servidor. Revisa que la implementación de Apps Script esté publicada para «Cualquier usuario».'); }
    } catch (e) {
      if (e && e.name === 'AbortError') throw new Error('El servidor tardó demasiado en responder.');
      throw e;
    } finally {
      if (reloj) clearTimeout(reloj);
    }
  }

  // ==================== BIBLIOTECA DE EJERCICIOS DENTRO DE LA APP ====================
  // El catálogo (lista + pasos en español) viaja con la web en data/catalogo.json y se guarda en el
  // teléfono. Las consultas de la biblioteca se responden aquí mismo, sin ir al servidor.
  // Si el servidor informa otra versión (el coach corrigió un nombre), se descarga la nueva.
  const ProCatalogo = {
    datos: null, mapa: null, version: '',
    _caja: 'procoaching-datos-v1', _clave: 'catalogo.json',
    _usar(j) {
      if (!j || !Array.isArray(j.items) || !j.items.length) return false;
      this.datos = j; this.version = String(j.version || '');
      this.mapa = new Map(j.items.map(it => [String(it[0]), it]));
      return true;
    },
    async _leerGuardado() {
      try { if (!window.caches) return null; const c = await caches.open(this._caja); const r = await c.match(this._clave); return r ? await r.json() : null; }
      catch (e) { return null; }
    },
    async _guardar(j) {
      try { if (!window.caches) return; const c = await caches.open(this._caja); await c.put(this._clave, new Response(JSON.stringify(j), { headers: { 'Content-Type': 'application/json' } })); }
      catch (e) {}
    },
    async cargar() {
      if (this._usar(await this._leerGuardado())) return;
      try {
        const r = await fetch('data/catalogo.json', { cache: 'no-cache' });
        if (r.ok) { const j = await r.json(); if (this._usar(j)) this._guardar(j); }
      } catch (e) {}
    },
    async verificar(versionServidor) {
      await this.listo;
      if (!versionServidor || String(versionServidor) === this.version) return;
      try {
        const j = await llamarApi('obtenerCatalogoCompletoApp', []);
        if (j && j.success && this._usar(j)) this._guardar(j);
      } catch (e) {}
    },
    detalle(id) {
      const it = this.mapa && this.mapa.get(String(id));
      if (!it) return null;
      return { success: true, id: it[0], nombre: it[1], nombreEs: it[7], grupo: it[2], target: it[3], zona: it[4],
               equipo: it[5], media: it[6], pasos: (this.datos.pasos && this.datos.pasos[it[0]]) || [] };
    }
  };
  ProCatalogo.listo = ProCatalogo.cargar();
  window.ProCatalogo = ProCatalogo;

  // Respuestas locales: si no hay catálogo guardado o falta un ejercicio, se pregunta al servidor.
  const LOCALES = {
    obtenerCatalogoEjercicios: () => ProCatalogo.mapa ? { success: true, items: ProCatalogo.datos.items } : null,
    obtenerDetalleEjercicio: id => ProCatalogo.detalle(id),
    obtenerDetallesEjercicios: ids => {
      if (!ProCatalogo.mapa) return null;
      const items = {};
      for (const id of (Array.isArray(ids) ? ids : [])) { const d = ProCatalogo.detalle(id); if (!d) return null; items[String(id)] = d; }
      return { success: true, items: items };
    }
  };
  async function resolver(accion, args) {
    if (LOCALES[accion]) {
      await ProCatalogo.listo;
      const local = LOCALES[accion].apply(null, args);
      if (local) return local;
    }
    return llamarApi(accion, args);
  }

  // Imita la forma de uso de google.script.run:
  //   google.script.run.withSuccessHandler(ok).withFailureHandler(error).nombreFuncion(arg1, arg2)
  function crearRunner(alExito, alFallo) {
    return new Proxy({}, {
      get(_, prop) {
        if (typeof prop !== 'string' || prop === 'then') return undefined;
        if (prop === 'withSuccessHandler') return cb => crearRunner(cb, alFallo);
        if (prop === 'withFailureHandler') return cb => crearRunner(alExito, cb);
        if (prop === 'withUserObject') return () => crearRunner(alExito, alFallo);
        return (...args) => {
          resolver(prop, args).then(
            res => { if (alExito) alExito(res); },
            err => { if (alFallo) alFallo(err); else console.error('[API] ' + prop, err); }
          );
        };
      }
    });
  }

  window.google = window.google || {};
  window.google.script = { get run() { return crearRunner(null, null); } };

  // Aviso visible si falta la configuración (evita una pantalla que «no hace nada»)
  if (!configurada()) {
    document.addEventListener('DOMContentLoaded', () => {
      const aviso = document.createElement('div');
      aviso.textContent = '⚠️ Falta configurar la conexión: edita API_URL en js/config.js con la URL /exec de tu Apps Script.';
      aviso.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#be123c;color:#fff;padding:10px 14px;font:600 13px system-ui;text-align:center';
      document.body.appendChild(aviso);
    });
  }
})();
