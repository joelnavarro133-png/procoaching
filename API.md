# Contrato de la API de PRO COACHING

Este documento es la frontera entre la **interfaz** (web y app Android) y los **datos** (hoy Google Sheets).
Si mañana se cambia la base de datos (Supabase, Firebase, MySQL…), basta con un servidor nuevo que
responda **estas mismas acciones con estas mismas respuestas**. La web y la app no se tocan: solo se
cambia `API_URL` en `web/js/config.js`.

## Cómo se llama

```
POST  <API_URL>
Content-Type: text/plain;charset=utf-8

{ "accion": "<nombre>", "args": [ ...argumentos en orden... ] }
```

- La respuesta es JSON. Casi todas devuelven `{ "success": true, ... }` o `{ "success": false, "error": "..." }`.
- **Token de sesión:** las acciones marcadas con 🔑 reciben como **último argumento** el `token` que devuelve el inicio de sesión. La web lo agrega sola.
- **Sesión vencida:** si el token no sirve, `error` empieza con `[SESION]`. La app cierra la sesión y vuelve al inicio.
- **Contraseñas:** la app nunca envía la contraseña, sino su SHA-256 en hexadecimal (`passwordHash`).
- Se usa `text/plain` para evitar la verificación CORS previa. Un servidor nuevo debe aceptar CORS desde la web publicada.

## Acciones

| Acción | Quién | Argumentos | Devuelve (además de `success`) |
|---|---|---|---|
| `autenticarUsuario` | Todos | `usuario, passwordHash` | `user` (con `token`), `versionCatalogo`. Coach: `alumnos, plantillas`. Alumno: `progreso, rutina, coach, semanas` |
| `restaurarSesion` | Todos | `token` | Lo mismo que `autenticarUsuario` |
| `cerrarSesionServidor` | Todos | `token` | — |
| `registrarNuevoAlumno` 🔑 | Coach | `{nombreCompleto, usuario, passwordHash, nivel, idCoach, whatsapp}` | `mensaje, alumnos` |
| `guardarEvaluacionCompleta` 🔑 | Coach del alumno | `{idAlumno, fecha, edad, sexo, peso, talla, …40 medidas…, fotoFrente, fotoPerfil, fotoEspalda}` (fotos en data URI) | `mensaje` |
| `actualizarNivelAlumno` 🔑 | Coach del alumno | `idAlumno, nuevoNivel` | `mensaje` |
| `actualizarWhatsAppAlumno` 🔑 | Coach del alumno | `idAlumno, numero` | `whatsapp, mensaje` |
| `obtenerDetallesAlumnoParaCoach` 🔑 | Coach del alumno | `idAlumno` | `progreso, rutina, historialRutinas, semanas, checkins` |
| `guardarRutinaCompleta` 🔑 | Coach | `idDestino` (idAlumno o `"PLANTILLA"`), `nombreRutina, listaEjercicios[], idCoach` | `mensaje, plantillas` |
| `actualizarRutinaAsignada` 🔑 | Coach | `{idRutina, destino, nombreRutina, listaEjercicios[], idCoach}` | `idRutina, mensaje, plantillas` |
| `duplicarRutina` 🔑 | Coach | `{idRutina, desde: "ALUMNO"\|"PLANTILLA", hacia, nombreNuevo, idCoach}` | `idRutina, mensaje, plantillas` |
| `activarRutina` 🔑 | Coach del alumno | `idRutina, idAlumno` | `mensaje, rutina, historialRutinas` |
| `eliminarRutinaAsignada` 🔑 | Coach del alumno | `idRutina` | `mensaje` |
| `asignarPlantillaAAlumno` 🔑 | Coach (dueño de la plantilla) | `idRutinaPlantilla, idAlumnoDestino` | `mensaje` |
| `guardarProgresoSemanal` 🔑 | Alumno o su coach | `{idAlumno, fechaRef: "yyyy-MM-dd", registros: [{dia, clave, valor}]}` | `mensaje, semana` |
| `obtenerProgresoSemanal` 🔑 | Alumno o su coach | `idAlumno` | `semanas` |
| `guardarCheckinSemanal` 🔑 | Alumno o su coach | `idAlumno, {peso, energia, sueno, molestias, nota}` | `mensaje, checkins` |
| `obtenerCheckinsAlumno` 🔑 | Alumno o su coach | `idAlumno` | `checkins` |
| `responderCheckin` 🔑 | Coach del alumno | `idAlumno, semanaISO, respuesta` | `mensaje, checkins` |
| `generarReportePDF` 🔑 | Alumno o su coach | `{idAlumno, semanaA?, semanaB?, incluirFotos}` | `nombre, idArchivo, pdfBase64, mensaje` |
| `actualizarPerfilUsuario` 🔑 | El propio usuario o su coach | `{idUsuario, nuevoNombre, nuevoUsuario, fotoBase64?}` | `mensaje, userActualizado` |
| `cambiarPasswordUsuario` 🔑 | El propio usuario o su coach | `idUsuario, hashActual, hashNuevo` | `mensaje` |
| `obtenerFotoBase64` 🔑 | Dueño de la foto o su coach | `idArchivo` | `dataUri` |
| `obtenerMiniaturaBase64` 🔑 | Dueño de la foto o su coach | `idArchivo` | `dataUri` (versión pequeña) |
| `obtenerCatalogoEjercicios` | Todos | — | `items: [[id, nombreEn, grupo, objetivo, zona, equipo, media, nombreEs], …]` |
| `obtenerDetalleEjercicio` | Todos | `idEjercicio` | `id, nombre, nombreEs, grupo, target, zona, equipo, media, pasos[]` |
| `obtenerDetallesEjercicios` | Todos | `ids[]` (máx. 30) | `items: { id: detalle }` |
| `actualizarNombreEsEjercicio` 🔑 | Coach | `idEjercicio, nombreEs` | `nombreEs, mensaje` |
| `obtenerCatalogoCompletoApp` | Todos | — | `version, items` (como `obtenerCatalogoEjercicios`), `pasos: { id: [pasos en español] }` |

## Biblioteca dentro de la app

La app guarda el catálogo completo en el teléfono y responde sola `obtenerCatalogoEjercicios`, `obtenerDetalleEjercicio` y `obtenerDetallesEjercicios`. Cada inicio de sesión trae `versionCatalogo`. Si no coincide con la guardada, la app pide `obtenerCatalogoCompletoApp`. Un servidor nuevo debe cambiar `versionCatalogo` cada vez que cambie el catálogo.

## Reglas que un servidor nuevo debe respetar

- **Varios coaches:** cada coach solo ve y modifica a sus alumnos (columna `ID_Coach`) y sus plantillas.
- **Rutina activa:** cada alumno tiene una sola rutina activa; las demás quedan como historial.
- **Fotos y PDF privados:** nunca con enlace público; se entregan en base64 solo al dueño o a su coach.
- **Contraseñas:** se guardan con sal y clave secreta del servidor (hoy, HMAC-SHA256 iterado; formato `v3$iteraciones$sal$hash`). Para migrar usuarios a otra base, se puede copiar ese formato tal cual y verificarlo igual.
