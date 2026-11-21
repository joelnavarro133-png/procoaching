// ⚙️ CONFIGURACIÓN DE PRO COACHING (web y app Android)
// Es lo único que hay que editar para conectar la interfaz con los datos.
window.PROCOACHING_CONFIG = {
  // URL de tu implementación de Apps Script. La encuentras en:
  // Apps Script → Implementar → Gestionar implementaciones → «URL de la aplicación web» (termina en /exec).
  // Si mañana cambias Google Sheets por otra base de datos, aquí pondrás la URL del nuevo servidor.
  API_URL: 'PEGA_AQUI_TU_URL_QUE_TERMINA_EN_/exec',

  // Tiempo máximo de espera por llamada (en milisegundos). Los reportes PDF con fotos pueden tardar.
  TIEMPO_MAXIMO_MS: 120000
};
