// nativo.js · Ajustes que solo se activan dentro de la app Android (Capacitor).
// En el navegador no hace nada.
(function () {
  const Cap = window.Capacitor;
  if (!Cap || typeof Cap.isNativePlatform !== 'function' || !Cap.isNativePlatform()) return;
  const P = Cap.Plugins || {};
  document.documentElement.classList.add('app-android');

  // --- Enlaces externos (WhatsApp, correo, teléfono): se abren en la app que corresponde ---
  const abrirOriginal = window.open;
  window.open = function (url) {
    const u = String(url || '');
    if (/^(https?:|whatsapp:|mailto:|tel:)/i.test(u) && u.indexOf(location.origin) !== 0) {
      window.location.href = u;   // Capacitor lo envía al sistema (WhatsApp, navegador, etc.)
      return null;
    }
    return abrirOriginal.apply(window, arguments);
  };

  // --- Reporte PDF: guardar en el teléfono y abrir el menú «Compartir» de Android ---
  function blobABase64(blob) {
    return new Promise((ok, mal) => {
      const lector = new FileReader();
      lector.onload = () => ok(String(lector.result).split(',')[1] || '');
      lector.onerror = () => mal(lector.error);
      lector.readAsDataURL(blob);
    });
  }

  async function compartirReporte(idAlumno, texto) {
    const r = (typeof reportesGenerados !== 'undefined') ? reportesGenerados[idAlumno] : null;
    if (!r) return;
    if (!P.Filesystem || !P.Share) { alert('Esta versión de la app no puede compartir archivos. Actualiza la app.'); return; }
    try {
      const datos = await blobABase64(r.blob);
      const archivo = await P.Filesystem.writeFile({ path: r.nombre, data: datos, directory: 'CACHE' });
      await P.Share.share({ title: r.nombre, text: texto || '', files: [archivo.uri], dialogTitle: 'Enviar reporte PDF' });
    } catch (e) {
      const msg = String((e && e.message) || e || '');
      if (/cancel/i.test(msg)) return;   // el usuario cerró el menú
      alert('No se pudo compartir el PDF: ' + msg);
    }
  }

  // Reemplaza las versiones web (descarga del navegador) por las nativas
  window.descargarReporte = function (idAlumno) { compartirReporte(idAlumno, ''); };
  window.enviarReportePorWhatsApp = function (idAlumno, paraCoach) {
    const a = (typeof alumnoPorId === 'function' ? alumnoPorId(idAlumno) : null) || {};
    const yo = (typeof estadoGlobal !== 'undefined' && estadoGlobal.user) || {};
    const coach = (typeof estadoGlobal !== 'undefined' && estadoGlobal.coachInfo) || {};
    const texto = paraCoach
      ? 'Hola ' + (typeof primerNombreDe === 'function' ? primerNombreDe(a.nombre) : '') + ', te comparto tu reporte de progreso de PRO COACHING.'
      : 'Hola ' + (coach.nombre || 'coach') + ', soy ' + (yo.nombre || '') + '. Te envío mi reporte de progreso.';
    compartirReporte(idAlumno, texto);
  };

  // --- Cronómetro: notificación con sonido y vibración a la hora exacta (aun con pantalla bloqueada) ---
  const LN = P.LocalNotifications, HP = P.Haptics;
  const ID_DESCANSO = 7001;
  let permisoNotif = null;          // null = aún no preguntado
  let alarmaExacta = true;

  async function prepararNotificaciones() {
    if (!LN) return false;
    if (permisoNotif !== null) return permisoNotif;
    try {
      let s = await LN.checkPermissions();
      if (s.display !== 'granted') s = await LN.requestPermissions();   // Android 13+: se pregunta una sola vez
      permisoNotif = s.display === 'granted';
    } catch (e) { permisoNotif = false; }
    if (permisoNotif) {
      try {
        await LN.createChannel({ id: 'descanso', name: 'Fin del descanso', description: 'Aviso cuando termina el cronómetro',
          importance: 5, visibility: 1, vibration: true, lights: true, lightColor: '#10B981' });
      } catch (e) {}
      // Sin permiso de alarma exacta, el plugin abriría Ajustes cada vez: se usa una notificación normal
      try { if (LN.checkExactNotificationSetting) alarmaExacta = (await LN.checkExactNotificationSetting()).exact_alarm === 'granted'; } catch (e) {}
    }
    return permisoNotif;
  }
  function cancelarNotificacionDescanso() {
    if (LN) LN.cancel({ notifications: [{ id: ID_DESCANSO }] }).catch(() => {});
  }

  if (typeof iniciarCronometro === 'function' && LN) {
    const iniciarWeb = iniciarCronometro, detenerWeb = detenerCronometro, avisarWeb = avisarFinDescanso;

    window.iniciarCronometro = function (segundos) {
      iniciarWeb(segundos);                       // también cancela la notificación anterior (vía detenerCronometro)
      if (!segundos || segundos <= 0 || !cronometroFin) return;
      const fin = cronometroFin;
      prepararNotificaciones().then(ok => {
        estadoGlobal.notificacionDescanso = !!ok;
        if (!ok || cronometroFin !== fin) return;   // sin permiso, o el cronómetro ya cambió
        LN.schedule({ notifications: [{
          id: ID_DESCANSO, channelId: 'descanso',
          title: '⏱️ ¡Descanso terminado!', body: 'A la siguiente serie. 💪',
          smallIcon: 'ic_stat_procoaching', iconColor: '#10B981',
          schedule: { at: new Date(fin), allowWhileIdle: true },
          isExactNotification: alarmaExacta
        }] }).catch(() => { estadoGlobal.notificacionDescanso = false; });
      });
    };

    window.detenerCronometro = function (terminado) {
      detenerWeb(terminado);
      if (!terminado) cancelarNotificacionDescanso();   // el usuario lo detuvo: no debe sonar
    };

    // Al terminar con la app abierta: si la notificación está programada, ella suena y vibra
    // (evita escuchar dos alarmas). Si no hay permiso, suena el aviso de la app + vibración.
    window.avisarFinDescanso = function () {
      if (estadoGlobal.notificacionDescanso) {
        mostrarToast('⏱️ ¡Descanso terminado! A la siguiente serie.');
        estadoGlobal.notificacionDescanso = false;
        return;
      }
      avisarWeb();
      if (HP) HP.vibrate({ duration: 700 }).catch(() => {});
    };
  }

  // --- Botón «Atrás» de Android: cierra la ventana abierta; si no hay ninguna, minimiza la app ---
  const CIERRES = { modalEjercicio: 'cerrarModalEjercicio', hojaDuplicar: 'cerrarDuplicar' };
  if (P.App && P.App.addListener) {
    P.App.addListener('backButton', () => {
      const abiertos = Array.from(document.querySelectorAll('[id^="modal"], #hojaDuplicar'))
        .filter(el => !el.classList.contains('hidden') && getComputedStyle(el).display !== 'none');
      const ultimo = abiertos[abiertos.length - 1];
      if (ultimo) {
        const fn = CIERRES[ultimo.id];
        if (fn && typeof window[fn] === 'function') window[fn]();
        else ultimo.classList.add('hidden');
        return;
      }
      if (P.App.minimizeApp) P.App.minimizeApp();
    });
  }
})();
