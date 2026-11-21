# PRO COACHING · Web y app Android

La misma interfaz funciona de tres formas, todas con los mismos datos de Google Sheets:

| Dónde | Cómo se abre |
|---|---|
| **App Android** | APK instalable que se descarga de GitHub |
| **Página web** | `https://<tu-usuario>.github.io/<repositorio>/` |
| **Apps Script (como hoy)** | La URL `/exec` de siempre: sigue funcionando |

```
web/            ← la página (index.html, css/, js/). Es la misma que usa la app.
  js/config.js  ← ÚNICA configuración: la URL de tu API (Apps Script)
  js/api.js     ← conecta la página con la API por internet
  js/nativo.js  ← solo en Android: compartir PDF y botón «Atrás»
android/        ← proyecto Android (Capacitor 8), generado; normalmente no se toca
assets/         ← ícono y pantalla de inicio de la app
.github/workflows/publicar.yml ← publica la web y compila el APK solo
API.md          ← contrato de la API (clave para cambiar de base de datos)
```

**Rapidez:** la app guarda en el teléfono la rutina, el progreso semanal, los check-ins y la biblioteca de ejercicios, así que **abre al instante** y luego se actualiza sola en segundo plano. Las evaluaciones (datos médicos) y las fotos no se guardan en el teléfono, y todo se borra al cerrar sesión.

La app Android abre la web publicada. **Cada vez que actualizas la web, la app se actualiza sola**, sin reinstalar. Solo hace falta un APK nuevo si cambia algo de Android (ícono, nombre, permisos).

---

## Instalación (una sola vez, unos 20 minutos)

### 1. Publicar la API en Apps Script
1. Reemplaza `Código.gs` por la versión v7 (trae la nueva función `doPost`).
2. **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar**.
   Debe seguir con «Ejecutar como: **Yo**» y «Quién tiene acceso: **Cualquier usuario**».
3. Copia la **URL de la aplicación web** (termina en `/exec`).

### 2. Configurar la web
Abre `web/js/config.js` y pega esa URL en `API_URL`.

### 3. Crear el repositorio en GitHub
1. Crea una cuenta en github.com, si no tienes.
2. **New repository** → nombre `procoaching` → **Public** → *Create repository*.
   (Debe ser público para que GitHub Pages y la compilación sean gratis. Aquí no hay nada secreto: la llave de firma va en «Secrets», y el código de Apps Script **no** se sube.)
3. GitHub acepta hasta 100 archivos por carga, así que súbelos en **dos tandas** (**Add file → Upload files** → arrastra → *Commit changes*):
   - **Tanda 1:** todo **menos** la carpeta `android` (unos 27 archivos, incluida la carpeta oculta `.github`).
   - **Tanda 2:** solo la carpeta `android` (unos 83 archivos). Arrastra la carpeta completa para que conserve su estructura.

> Si tu explorador no muestra la carpeta `.github`, créala desde GitHub: **Add file → Create new file**, escribe `.github/workflows/publicar.yml` como nombre y pega su contenido.

### 4. Guardar la llave de firma (secretos)
**Settings → Secrets and variables → Actions → New repository secret**, y crea dos:

| Nombre | Valor |
|---|---|
| `PC_LLAVE_BASE64` | todo el texto del archivo `procoaching.p12.base64` |
| `PC_LLAVE_CLAVE` | la contraseña del archivo `CLAVE-LLAVE.txt` |

⚠️ Guarda también `procoaching.p12` y su contraseña fuera de GitHub (en tu Drive, por ejemplo). **Si se pierde la llave, los teléfonos no aceptarán actualizaciones** y habría que desinstalar e instalar de nuevo.

### 5. Activar GitHub Pages
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 6. Ejecutar la primera publicación
**Actions → Publicar web y app Android → Run workflow**. Tarda unos 5–8 minutos.
- Web: `https://<tu-usuario>.github.io/procoaching/`
- APK: `https://github.com/<tu-usuario>/procoaching/releases/latest/download/ProCoaching.apk`

Comparte ese enlace del APK con tus alumnos (por ejemplo, por WhatsApp).

---

## Instalar la app en un Android
1. Abre el enlace del APK en el teléfono y descárgalo.
2. Android pedirá permitir «instalar apps desconocidas» para Chrome o WhatsApp: acéptalo solo para este archivo.
3. Abre **PRO COACHING**. La sesión queda guardada 7 días.

## Hacer cambios después
- **Cambios en la interfaz o en la lógica de la página** → edita `web/…` en GitHub → la web y la app se actualizan en minutos.
- **Cambios en web/** → también actualizan la URL `/exec`: ejecuta `node scripts/generar-apps-script.mjs` y copia los 5 archivos de `apps-script-interfaz/` (Index, Estilos, JS_Nucleo, JS_Coach, JS_Vistas) a Apps Script. No edites esos archivos a mano.
- **Pruebas (Tests.gs)** → nunca corren sobre producción: necesitan una copia de la hoja y una carpeta de pruebas (ver la cabecera de Tests.gs).
- **Cambios en Código.gs** → en Apps Script, **Nueva versión** de la implementación (la URL `/exec` no cambia).
- **Cambiar de base de datos** → crea la nueva API siguiendo `API.md` y cambia `API_URL` en `web/js/config.js`.

## Biblioteca de ejercicios
- Viaja con la app: en cada publicación, GitHub la descarga de tu API y la incluye.
- Si el coach corrige un nombre desde la app, las demás apps se actualizan solas.
- **Si editas la pestaña CATALOGO_EJERCICIOS a mano**, ejecuta `publicarCambiosCatalogo` desde el editor de Apps Script para que las apps descarguen los cambios.

## Cronómetro en Android
- La primera vez que un alumno usa el cronómetro, la app pide permiso para **notificaciones**. Si lo acepta, al terminar el descanso suena y vibra aunque la pantalla esté bloqueada.
- Si no lo acepta, suena y vibra solo con la app abierta.
- Algunos teléfonos con «ahorro de batería» agresivo (Xiaomi, Huawei, Samsung) pueden retrasar la notificación. Si pasa, desactiva el ahorro de batería para PRO COACHING en *Ajustes → Batería*.

## Si algo falla
| Síntoma | Causa probable |
|---|---|
| Franja roja «Falta configurar la conexión» | `API_URL` vacía en `web/js/config.js` |
| «Respuesta no válida del servidor» | La implementación no es «Cualquier usuario» o no se creó una **Nueva versión** tras pegar el Código.gs v7 |
| La compilación falla en «Revisar la llave de firma» | Faltan los secretos del paso 4 |
| La app muestra «Sin conexión» | El teléfono no tiene internet, o GitHub Pages aún no está activo (paso 5) |
| «No se pudo instalar» al actualizar | El APK se firmó con otra llave: usa siempre la misma |
