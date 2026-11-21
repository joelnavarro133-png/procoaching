// version.js · Avisa cuando hay una versión nueva de la interfaz publicada.
// Cada publicación escribe su número en version.json y en <meta name="app-version">.
// Si la app estuvo en segundo plano un rato y al volver hay otra versión, ofrece actualizar.
(function () {
  const meta = document.querySelector('meta[name="app-version"]');
  const actual = meta ? meta.getAttribute('content') : '';
  if (!actual || actual.indexOf('__') === 0) return;        // copia local sin publicar: no se revisa
  let oculta = 0, avisado = false;
  async function revisar() {
    if (avisado) return;
    try {
      const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return;
      const v = String((await r.json()).version || '');
      if (v && v !== actual) {
        avisado = true;
        if (typeof mostrarToast === 'function') mostrarToast('✨ Hay una nueva versión de PRO COACHING', { accion: 'Actualizar', fn: () => location.reload(), ms: 60000 });
      }
    } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { oculta = Date.now(); return; }
    if (oculta && Date.now() - oculta > 10 * 60000) revisar();
  });
  setInterval(() => { if (!document.hidden) revisar(); }, 60 * 60000);
})();
