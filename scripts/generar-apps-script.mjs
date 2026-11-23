// Genera la interfaz de Apps Script (la URL /exec de siempre) a partir de la carpeta web/.
// Así hay UNA sola copia del código: cualquier mejora en web/ llega también a Apps Script.
//
// Uso:   node scripts/generar-apps-script.mjs
// Crea en la carpeta apps-script-interfaz/:
//   Index.html  Estilos.html  JS_Nucleo.html  JS_Coach.html  JS_Vistas.html
// Copia el contenido de cada uno al archivo del mismo nombre en tu proyecto de Apps Script.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const web = new URL('../web/', import.meta.url);
const salida = new URL('../apps-script-interfaz/', import.meta.url);
const leer = ruta => readFileSync(new URL(ruta, web), 'utf8');

let indice = leer('index.html');
const quitar = [
  /\s*<meta charset="utf-8">/,
  /\s*<title>[^<]*<\/title>/,                    // el título lo pone doGet()
  /\s*<meta name="app-version" content="[^"]*">/,
  /\s*<link rel="icon"[^>]*>/
];
quitar.forEach(re => { indice = indice.replace(re, ''); });

// Apps Script no puede servir archivos sueltos como js/vendor/…: se usa el CDN con versión fija y
// comprobación de integridad (SRI). Si el archivo del CDN cambiara, el navegador no lo ejecuta.
// El hash corresponde a chart.js@4.4.1/dist/chart.umd.js (el mismo archivo que web/js/vendor/chart.umd.js).
const chartLocal = '<script src="js/vendor/chart.umd.js"></script>';
if (!indice.includes(chartLocal)) throw new Error('No encontré Chart.js (js/vendor/chart.umd.js) en index.html');
indice = indice.replace(chartLocal,
  '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js" ' +
  'integrity="sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG" crossorigin="anonymous"></script>');

const css = '<link rel="stylesheet" href="css/estilos.css?v=__VERSION__">';
if (!indice.includes(css)) throw new Error('No encontré la hoja de estilos en index.html');
indice = indice.replace(css, "<?!= incluir('Estilos'); ?>");

const ini = indice.indexOf('<!-- Configuración (URL de la API)');
const fin = indice.indexOf('<script src="js/version.js?v=__VERSION__"></script>');
if (ini < 0 || fin < 0) throw new Error('No encontré el bloque de scripts en index.html');
indice = indice.slice(0, ini) +
  "<?!= incluir('JS_Nucleo'); ?>\n<?!= incluir('JS_Coach'); ?>\n<?!= incluir('JS_Vistas'); ?>" +
  indice.slice(fin + '<script src="js/version.js?v=__VERSION__"></script>'.length);

if ((indice.match(/<\?/g) || []).length !== 4) throw new Error('index.html contiene «<?» inesperados: Apps Script los tomaría como código.');

const aviso = 'Generado desde web/ con scripts/generar-apps-script.mjs. No lo edites a mano: edita web/ y vuelve a generar.';
const envolverJs = (archivo, nombre) => {
  const js = leer('js/' + archivo);
  if (/<\/script/i.test(js)) throw new Error(archivo + ' contiene «</script»');
  return `<script>\n// ${nombre}.html · ${aviso}\n${js}\n</script>\n`;
};

mkdirSync(salida, { recursive: true });
// El comentario va DESPUÉS de <!DOCTYPE html>: antes, el navegador dibujaría en modo antiguo
writeFileSync(new URL('Index.html', salida), indice.replace(/^<!DOCTYPE html>\n/i, `<!DOCTYPE html>\n<!-- Index.html · ${aviso} -->\n`));
writeFileSync(new URL('Estilos.html', salida), `<style>\n/* Estilos.html · ${aviso} */\n${leer('css/estilos.css')}</style>\n`);
writeFileSync(new URL('JS_Nucleo.html', salida), envolverJs('nucleo.js', 'JS_Nucleo'));
writeFileSync(new URL('JS_Coach.html', salida), envolverJs('coach.js', 'JS_Coach'));
writeFileSync(new URL('JS_Vistas.html', salida), envolverJs('vistas.js', 'JS_Vistas'));
console.log('Listo: apps-script-interfaz/ (Index, Estilos, JS_Nucleo, JS_Coach, JS_Vistas)');
