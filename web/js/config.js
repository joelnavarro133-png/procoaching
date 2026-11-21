// ⚙️ CONFIGURACIÓN DE PRO COACHING (web y app Android)
// Es lo único que hay que editar para conectar la interfaz con los datos.
window.PROCOACHING_CONFIG = {
  // URL de tu implementación de Apps Script. La encuentras en:
  // Apps Script → Implementar → Gestionar implementaciones → «URL de la aplicación web» (termina en /exec).
  // Si mañana cambias Google Sheets por otra base de datos, aquí pondrás la URL del nuevo servidor.
  API_URL: 'https://script.google.com/macros/s/AKfycby_nyCdtrjWpu1Ic5vVZo2DCJUu5M1k192C3SaHj3qlZ9D0z2AuJcdM6otTukQfPeghgg/exec',

  // Tiempo máximo de espera por llamada (en milisegundos). Los reportes PDF con fotos pueden tardar.
  TIEMPO_MAXIMO_MS: 120000
};
