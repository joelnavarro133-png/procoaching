// Prepara capacitor.config.json antes de compilar la app Android.
//
// Si existe la variable WEB_URL (la dirección de la web publicada, por ejemplo
// https://usuario.github.io/procoaching/), la app abre esa web: cada vez que
// actualizas la web, la app se actualiza sola, sin reinstalar el APK.
// Si no existe, la app lleva la web dentro del APK (funciona igual, pero cada
// cambio en la web requiere instalar un APK nuevo).
import { readFileSync, writeFileSync } from 'node:fs';

const archivo = new URL('../capacitor.config.json', import.meta.url);
const config = JSON.parse(readFileSync(archivo, 'utf8'));
const url = String(process.env.WEB_URL || '').trim();

config.server = config.server || {};
if (url) {
  if (!/^https:\/\//.test(url)) {
    console.error('WEB_URL debe empezar con https:// → ' + url);
    process.exit(1);
  }
  config.server.url = url;
  config.server.cleartext = false;
  console.log('La app abrirá la web publicada: ' + url);
} else {
  delete config.server.url;
  console.log('Sin WEB_URL: la web va empaquetada dentro del APK.');
}
writeFileSync(archivo, JSON.stringify(config, null, 2) + '\n');

// La página «Sin conexión» usa esta dirección para el botón «Reintentar»
writeFileSync(new URL('../web/destino.js', import.meta.url),
  'window.PROCOACHING_WEB_URL = ' + JSON.stringify(url) + ';\n');
