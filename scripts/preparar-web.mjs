// Prepara la carpeta web/ antes de publicarla (lo ejecuta GitHub Actions en cada publicación):
//  1. Pone el número de versión en index.html y version.json (así la app detecta las actualizaciones
//     y el navegador no usa archivos viejos de la memoria caché).
//  2. Descarga la biblioteca de ejercicios desde tu API a web/data/catalogo.json, para que la
//     biblioteca viaje con la app y abra al instante.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const raiz = new URL('../web/', import.meta.url);
const version = String(process.env.VERSION_APP || Date.now());

// 1. Versión
const indice = new URL('index.html', raiz);
writeFileSync(indice, readFileSync(indice, 'utf8').replaceAll('__VERSION__', version));
writeFileSync(new URL('version.json', raiz), JSON.stringify({ version }) + '\n');
console.log('Versión de la interfaz: ' + version);

// 2. Catálogo de ejercicios
const config = readFileSync(new URL('js/config.js', raiz), 'utf8');
const m = /API_URL:\s*'([^']+)'/.exec(config);
const apiUrl = m ? m[1] : '';
if (!/^https:\/\//.test(apiUrl) || apiUrl.includes('PEGA_AQUI')) {
  console.log('::warning::API_URL no está configurada en web/js/config.js: la biblioteca se descargará desde la app la primera vez.');
  process.exit(0);
}
try {
  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ accion: 'obtenerCatalogoCompletoApp', args: [] }),
    redirect: 'follow'
  });
  const datos = await resp.json();
  if (!datos || !datos.success || !Array.isArray(datos.items)) throw new Error((datos && datos.error) || 'respuesta inesperada');
  mkdirSync(new URL('data/', raiz), { recursive: true });
  writeFileSync(new URL('data/catalogo.json', raiz), JSON.stringify({ version: datos.version, items: datos.items, pasos: datos.pasos }));
  console.log('Biblioteca incluida: ' + datos.items.length + ' ejercicios (versión ' + datos.version + ').');
} catch (e) {
  // No se detiene la publicación: la app pedirá la biblioteca al servidor la primera vez.
  console.log('::warning::No se pudo descargar la biblioteca (' + e.message + '). La app la pedirá al servidor.');
}
