    // coach.js · Panel del coach: alumnos, evaluaciones, constructor de rutinas, editar/duplicar, PDF y WhatsApp.
    // ==================== COACH ====================
    function inicializarPanelCoach() {
      if (typeof precargarRecords === 'function') precargarRecords();   // v18.1: muro listo antes de tocarlo
      document.getElementById('coachView').classList.remove('hidden');
      actualizarAvataresUI();
      actualizarSelectoresAlumnos();
      actualizarSelectorPlantillas();
      renumerarConstructor();
      document.getElementById('evFecha').value = fechaLocalISO();
      cambiarTabCoach('tabHoyCoach');
      iniciarActividadCoach();
    }

    // v17: la navegación del coach (menú lateral, barra inferior y hoja «Más») está en el bloque «NAVEGACIÓN DEL COACH» al final.
    function actualizarSelectoresAlumnos() {
      const html = estadoGlobal.alumnos.map(a => `<option value="${escHtml(a.id)}">${escHtml(a.nombre)} (${escHtml(a.nivel)})</option>`).join('');
      document.querySelectorAll('.select-alumnos').forEach(s => s.innerHTML = html);
      renderListaMisAlumnosTab1();
      renderTarjetasAlumnos();
    }

    async function crearAlumno() {
      const nombre = document.getElementById('regNombre').value.trim();
      const usuario = document.getElementById('regUser').value.trim();
      const pass = document.getElementById('regPass').value;
      const nivel = document.getElementById('regNivel').value;
      const btn = document.getElementById('btnCrearAlumno');
      if (!nombre || !usuario || !pass) return avisar('Completa todos los campos.', 'atencion');

      btn.innerText = 'Creando carpeta en Drive...';
      btn.disabled = true;
      const passwordHash = await sha256(pass);

      GS()
        .withSuccessHandler(res => {
          btn.innerText = 'Crear Alumno';
          btn.disabled = false;
          avisar(res.mensaje || res.error, res.success ? 'exito' : 'error');
          if (res.success) {
            estadoGlobal.alumnos = res.alumnos;
            actualizarSelectoresAlumnos();
            document.getElementById('regNombre').value = '';
            document.getElementById('regUser').value = '';
            document.getElementById('regPass').value = '';
            const wa = document.getElementById('regWhatsApp'); if (wa) wa.value = '';
          }
        })
        .registrarNuevoAlumno({ nombreCompleto: nombre, usuario, passwordHash, nivel, idCoach: estadoGlobal.user.id, whatsapp: (document.getElementById('regWhatsApp') || {}).value || '' });
    }

    async function procesarYGuardarEvaluacion() {
      const idAlumno = document.getElementById('selectAlumnoMedidas').value;
      const fecha = document.getElementById('evFecha').value;
      if (!idAlumno || !fecha) return avisar('Selecciona alumno y fecha.', 'atencion');
      const alertaMedidas = document.getElementById('alertaMedidasAtipicas');
      if (alertaMedidas && !alertaMedidas.classList.contains('hidden')) {
        alertaMedidas.scrollIntoView({ behavior: modoScroll(), block: 'center' });
        return avisar('Hay medidas que no cuadran (revisa el aviso rojo). Corrígelas antes de guardar la evaluación.', 'atencion');
      }

      const btn = document.getElementById('btnGuardarEvaluacion');
      btn.innerText = 'Comprimiendo fotos y guardando en Drive...';
      btn.disabled = true;

      const fFrente = document.getElementById('fotoFrente').files[0];
      const fPerfil = document.getElementById('fotoPerfil').files[0];
      const fEspalda = document.getElementById('fotoEspalda').files[0];

      const payload = {
        idAlumno, fecha,
        tienePlicometro: document.getElementById('evTienePlicometro').value,
        edad: document.getElementById('evEdad').value,
        sexo: document.getElementById('evSexo').value,
        peso: document.getElementById('evPeso').value,
        talla: document.getElementById('evTalla').value,
        imc: document.getElementById('evImc').value,
        grasaCorporal: document.getElementById('evGrasa').value,
        masaCorporal: document.getElementById('evMasa').value,
        envergadura: document.getElementById('evEnvergadura').value,
        subescapular: document.getElementById('evSubescapular').value,
        tricipital: document.getElementById('evTricipital').value,
        bicipital: document.getElementById('evBicipital').value,
        supracrestal: document.getElementById('evSupracrestal').value,
        suprailiaca: document.getElementById('evSuprailiaca').value,
        abdominal: document.getElementById('evAbdominal').value,
        cuello: document.getElementById('evCuello').value,
        hombros: document.getElementById('evHombros').value,
        pecho: document.getElementById('evPecho').value,
        brazoRelajado: document.getElementById('evBrazoRel').value,
        brazoFlexionado: document.getElementById('evBrazoFlex').value,
        cintura: document.getElementById('evCintura').value,
        cadera: document.getElementById('evCadera').value,
        gluteos: document.getElementById('evGluteos').value,
        muslo: document.getElementById('evMuslo').value,
        pantorrilla: document.getElementById('evPantorrilla').value,
        humero: document.getElementById('evHumero').value,
        muneca: document.getElementById('evMuneca').value,
        femur: document.getElementById('evFemur').value,
        lesion: document.getElementById('evLesion').value,
        enfermedad: document.getElementById('evEnfermedad').value,
        medicamento: document.getElementById('evMedicamento').value,
        cirugia: document.getElementById('evCirugia').value,
        limitacion: document.getElementById('evLimitacion').value,
        observacion: document.getElementById('evObservacion').value,
        fotoFrente: fFrente ? await comprimirImagen(fFrente) : null,
        fotoPerfil: fPerfil ? await comprimirImagen(fPerfil) : null,
        fotoEspalda: fEspalda ? await comprimirImagen(fEspalda) : null
      };

      GS()
        .withSuccessHandler(res => {
          btn.innerText = 'Guardar Evaluación y Subir Fotos';
          btn.disabled = false;
          avisar(res.mensaje || res.error, res.success ? 'exito' : 'error');
          if (res.success) {
            document.getElementById('fotoFrente').value = '';
            document.getElementById('fotoPerfil').value = '';
            document.getElementById('fotoEspalda').value = '';
            irPasoEvaluacion(1, true);
            cargarPanelCoach();
          }
        })
        .guardarEvaluacionCompleta(payload);
    }

    function crearTarjetaConstructor() {
      const lista = document.getElementById('listaConstructorRutina');
      const prev = lista.lastElementChild;
      const v = (cls, def) => prev ? (prev.querySelector(cls).value || def) : def;
      const opcionesDias = DIAS_SEMANA.map(d => `<option value="${d}" ${v('.r-dia', 'LUNES') === d ? 'selected' : ''}>${d}</option>`).join('');
      const tipos = [['NORMAL','NORMAL'],['BISERIE','BISERIE (2 seguidos)'],['TRISERIE','TRISERIE (3 seguidos)'],['DROP SET','DROP SET (bajar peso)'],
        ['ASCENDING SET','ASCENDING SET (subir peso)'],['PIRAMIDE COMPLETA','PIRÁMIDE COMPLETA (5 series)']];
      const tipoPrev = v('.r-tipo', 'NORMAL');
      const inp = 'w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-center font-bold text-white';
      const lbl = 'block text-[11px] text-slate-400 font-bold uppercase tracking-wide mb-1';
      const card = document.createElement('div');
      card.className = 'fila-rutina bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md';
      card.innerHTML = `
        <input type="hidden" class="r-idej" value="">
        <div class="flex items-center gap-2 mb-3">
          <span class="r-num shrink-0 w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/40 text-sky-300 font-black text-xs flex items-center justify-center"></span>
          <select class="r-dia flex-1 min-w-0 p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-emerald-400 font-extrabold text-sm">${opcionesDias}</select>
          <button type="button" onclick="quitarTarjetaConstructor(this)" class="shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold" title="Quitar ejercicio">${ico('trash-2', 'w-4 h-4')}</button>
        </div>
        <div class="flex gap-3 items-start">
          <div class="r-media shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center text-3xl">${ico('dumbbell', 'w-8 h-8')}</div>
          <div class="flex-1 min-w-0 space-y-2">
            <textarea rows="2" placeholder="NOMBRE DEL EJERCICIO" class="r-ejer w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-extrabold text-white uppercase resize-none leading-snug"></textarea>
            <p class="r-en hidden text-xs text-sky-300/90 italic font-semibold leading-tight"></p>
            <input type="text" placeholder="MÚSCULO (ej. PECHO)" class="r-musc w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-emerald-300 uppercase">
          </div>
        </div>
        <button type="button" onclick="abrirCatalogoParaFila(this)" class="mt-2 w-full py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold">${ico('library', 'w-4 h-4')} Elegir / cambiar ejercicio de la biblioteca</button>
        <div class="grid grid-cols-3 gap-2 mt-3">
          <div><label class="${lbl}">Series</label><input type="number" inputmode="numeric" min="1" placeholder="4" value="${escHtml(v('.r-ser', ''))}" class="r-ser ${inp}"></div>
          <div><label class="${lbl}">Reps</label><input type="text" placeholder="10 / 8-10-12" value="${escHtml(v('.r-rep', ''))}" class="r-rep ${inp}"></div>
          <div><label class="${lbl} text-emerald-400">Descanso (s)</label><input type="number" inputmode="numeric" min="0" placeholder="90" value="${escHtml(v('.r-desc', ''))}" class="r-desc ${inp.replace('border-slate-700', 'border-emerald-800')} text-emerald-400"></div>
        </div>
        <div class="mt-3">
          <label class="${lbl}">${ico('zap', 'w-4 h-4')} Tempo (segundos): bajar · pausa · subir · pausa</label>
          <div class="grid grid-cols-4 gap-2">
            <input type="text" inputmode="numeric" placeholder="3" value="${escHtml(v('.r-exc', ''))}" class="r-exc ${inp} text-amber-300" title="Excéntrica (bajada)">
            <input type="text" inputmode="numeric" placeholder="1" value="${escHtml(v('.r-pexc', ''))}" class="r-pexc ${inp} text-amber-300" title="Pausa excéntrica">
            <input type="text" inputmode="numeric" placeholder="1" value="${escHtml(v('.r-conc', ''))}" class="r-conc ${inp} text-amber-300" title="Concéntrica (subida)">
            <input type="text" inputmode="numeric" placeholder="0" value="${escHtml(v('.r-pconc', ''))}" class="r-pconc ${inp} text-amber-300" title="Pausa concéntrica">
          </div>
        </div>
        <div class="mt-3">
          <label class="${lbl}">Tipo de serie</label>
          <select class="r-tipo w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 font-bold text-sky-400 text-sm">
            ${tipos.map(t => `<option value="${t[0]}" ${t[0] === tipoPrev ? 'selected' : ''}>${t[1]}</option>`).join('')}
          </select>
        </div>`;
      lista.appendChild(card);
      renumerarConstructor();
      return card;
    }

    function llenarTarjetaConEjercicio(card, e) {
      card.querySelector('.r-idej').value = e.id;
      card.querySelector('.r-ejer').value = nombreEsDe(e);
      const en = card.querySelector('.r-en');
      en.textContent = 'EN · ' + e.nombre;
      en.classList.remove('hidden');
      card.querySelector('.r-musc').value = trCat(GRUPOS_ES, e.grupo);
      const caja = card.querySelector('.r-media');
      caja.className = 'r-media shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white border border-slate-700 overflow-hidden flex items-center justify-center cursor-pointer';
      caja.innerHTML = `<img src="${urlMini(e.media)}" alt="" loading="lazy" decoding="async" class="w-full h-full object-contain p-1">`;
      caja.onclick = () => abrirModalEjercicio(e.id, nombreEsDe(e), e.media);
    }

    let ultimaFilaBorrada = null;
    function quitarTarjetaConstructor(btn) {
      const card = btn.closest('.fila-rutina');
      const lista = card.parentElement;
      ultimaFilaBorrada = { card, siguiente: card.nextElementSibling, lista };
      card.remove();
      renumerarConstructor();
      mostrarToast('🗑️ Ejercicio quitado', { accion: 'Deshacer', fn: deshacerBorradoConstructor, ms: 8000 });
    }
    function deshacerBorradoConstructor() {
      const u = ultimaFilaBorrada; if (!u) return;
      ultimaFilaBorrada = null;
      if (u.siguiente && u.siguiente.parentElement === u.lista) u.lista.insertBefore(u.card, u.siguiente);
      else u.lista.appendChild(u.card);
      renumerarConstructor();
      u.card.scrollIntoView({ behavior: modoScroll(), block: 'center' });
    }

    function renumerarConstructor() {
      const cards = document.querySelectorAll('#listaConstructorRutina .fila-rutina');
      cards.forEach((c, i) => { c.querySelector('.r-num').textContent = i + 1; });
      const vacio = document.getElementById('constructorVacio');
      if (vacio) vacio.classList.toggle('hidden', cards.length > 0);
    }

    // Añadir ejercicio: primero se elige en la biblioteca (con GIF); "libre" crea la tarjeta vacía
    function agregarFilaEjercicio(desdeBiblioteca = true) {
      if (desdeBiblioteca) { abrirCatalogo(null); return; }
      const card = crearTarjetaConstructor();
      card.querySelector('.r-ejer').focus();
    }

    function actualizarSelectorPlantillas() {
      const sel = document.getElementById('selectPlantillaAsignar');
      if (!sel) return;
      if (!estadoGlobal.plantillas || estadoGlobal.plantillas.length === 0) {
        sel.innerHTML = '<option value="">-- Sin plantillas creadas aún --</option>';
        return;
      }
      sel.innerHTML = estadoGlobal.plantillas.map(p => 
        `<option value="${escHtml(p.idRutina)}">${escHtml(p.nombreRutina)} (${escHtml(p.totalEjercicios)} ejercicios)</option>`
      ).join('');
    }

    function toggleDestinoCreacionRutina() {
      const modo = document.getElementById('modoCreacionRutina').value;
      const contAlumno = document.getElementById('contenedorSelectAlumnoConstructor');
      if (modo === 'PLANTILLA') {
        contAlumno.classList.add('opacity-40', 'pointer-events-none');
      } else {
        contAlumno.classList.remove('opacity-40', 'pointer-events-none');
      }
    }

    function ejecutarAsignacionPlantilla() {
      const idPlantilla = document.getElementById('selectPlantillaAsignar').value;
      const idAlumno = document.getElementById('selectAlumnoDestinoPlantilla').value;
      if (!idPlantilla) return avisar('Primero debes crear al menos una plantilla en el constructor.', 'atencion');
      if (!idAlumno) return avisar('Selecciona un alumno destino.', 'atencion');

      const btn = document.getElementById('btnAsignarPlantilla');
      btn.innerText = 'Asignando...';
      btn.disabled = true;

      GS()
        .withSuccessHandler(res => {
          btn.innerHTML = ico('link') + ' Designar Rutina al Alumno';
          btn.disabled = false;
          avisar(res.mensaje || res.error, res.success ? 'exito' : 'error');
        })
        .asignarPlantillaAAlumno(idPlantilla, idAlumno);
    }

    // ==================== EDITAR / DUPLICAR RUTINAS ====================
    // Solo el coach ve estos botones, y solo cuando la rutina ya está guardada.
    function accionesRutinaCoach(rutina) {
      if (!esCoach() || !rutina || !rutina.length || !rutina[0].idRutina) return '';
      const id = rutina[0].idRutina, nom = rutina[0].nombreRutina || 'Rutina';
      return `
        <div class="flex gap-2 mb-4">
          <button onclick="editarRutinaAsignada()" class="flex-1 min-w-0 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-extrabold text-xs px-3 py-3 rounded-xl active:scale-[0.98] transition whitespace-nowrap">${ico('pencil', 'w-4 h-4')} Editar</button>
          <button onclick="abrirDuplicarRutina()" class="flex-1 min-w-0 bg-sky-500/15 border border-sky-500/40 text-sky-300 font-extrabold text-xs px-3 py-3 rounded-xl active:scale-[0.98] transition whitespace-nowrap">${ico('copy', 'w-4 h-4')} Duplicar</button>
          <button onclick="borrarRutinaAsignada()" class="shrink-0 bg-slate-950 border border-rose-500/30 text-rose-400 font-bold text-xs px-4 py-3 rounded-xl" title="Eliminar la rutina «${escHtml(nom)}»">${ico('trash-2', 'w-4 h-4')}</button>
        </div>`;
    }

    /** Vuelca la rutina que está en pantalla dentro del constructor, tarjeta por tarjeta. */
    function cargarRutinaEnConstructor(rutina) {
      const lista = document.getElementById('listaConstructorRutina');
      lista.innerHTML = '';
      rutina.forEach(r => {
        const card = crearTarjetaConstructor();
        const set = (cls, val) => { const el = card.querySelector(cls); if (el) el.value = val === undefined || val === null ? '' : String(val); };
        set('.r-idej', r.idEjercicio);
        set('.r-ejer', r.ejercicio);
        set('.r-musc', r.musculo);
        set('.r-ser', r.serie);
        set('.r-rep', r.repeticiones);
        set('.r-desc', r.descanso);
        set('.r-conc', r.concentrica);
        set('.r-pconc', r.pausaConcentrica);
        set('.r-exc', r.excentrica);
        set('.r-pexc', r.pausaExcentrica);
        const selDia = card.querySelector('.r-dia');
        const diaObj = DIAS_SEMANA.find(d => normalizarDia(d) === normalizarDia(r.dia));
        if (selDia && diaObj) selDia.value = diaObj;
        const selTipo = card.querySelector('.r-tipo');
        if (selTipo && r.tipoEjercicio) {
          const op = [...selTipo.options].find(o => o.value === String(r.tipoEjercicio).toUpperCase());
          if (op) selTipo.value = op.value;
        }
        if (r.nombreEn) { const en = card.querySelector('.r-en'); en.textContent = 'EN · ' + r.nombreEn; en.classList.remove('hidden'); }
        if (r.media) {
          const caja = card.querySelector('.r-media');
          caja.className = 'r-media shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white border border-slate-700 overflow-hidden flex items-center justify-center cursor-pointer';
          caja.innerHTML = `<img src="${urlMini(r.media)}" alt="" loading="lazy" decoding="async" class="w-full h-full object-contain p-1">`;
          caja.onclick = () => abrirModalEjercicio(r.idEjercicio, r.ejercicio, r.media);
        }
      });
      renumerarConstructor();
    }

    function bloquearSelectoresEdicion(bloquear) {
      const selModo = document.getElementById('modoCreacionRutina');
      const selAl = document.getElementById('selectAlumnoRutina');
      [selModo, selAl].forEach(el => {
        if (!el) return;
        el.disabled = bloquear;
        el.classList.toggle('opacity-50', bloquear);
        el.classList.toggle('cursor-not-allowed', bloquear);
      });
    }

    function editarRutinaAsignada() {
      const rutina = estadoGlobal.rutinaActual || [];
      if (!rutina.length || !rutina[0].idRutina) return avisar('Este alumno no tiene una rutina guardada todavía.', 'atencion');
      const idAlumno = (estadoGlobal.checkinsCoach || {}).idAlumno || document.getElementById('selectAlumnoAnalizar')?.value || '';
      const alu = alumnoPorId(idAlumno) || {};
      estadoGlobal.edicionRutina = { idRutina: rutina[0].idRutina, destino: idAlumno, nombre: rutina[0].nombreRutina || '' };

      cargarRutinaEnConstructor(rutina);
      document.getElementById('nombreRutinaInput').value = rutina[0].nombreRutina || '';
      document.getElementById('modoCreacionRutina').value = 'ALUMNO';
      toggleDestinoCreacionRutina();
      const selAl = document.getElementById('selectAlumnoRutina');
      if (selAl && idAlumno) selAl.value = idAlumno;
      bloquearSelectoresEdicion(true);

      document.getElementById('txtEdicionRutina').textContent =
        `"${rutina[0].nombreRutina || 'Rutina'}" de ${alu.nombre || 'el alumno'} · ${rutina.length} ejercicio(s). Al guardar se reemplaza la rutina actual y se conservan los pesos ya registrados.`;
      document.getElementById('avisoEdicionRutina').classList.remove('hidden');
      document.getElementById('btnGuardarRutina').innerHTML = ico('save') + ' Guardar cambios';
      cambiarTabCoach('tabCrearRutina');
      document.getElementById('avisoEdicionRutina').scrollIntoView({ behavior: modoScroll(), block: 'center' });
    }

    function cancelarEdicionRutina(silencioso = false) {
      estadoGlobal.edicionRutina = null;
      bloquearSelectoresEdicion(false);
      document.getElementById('avisoEdicionRutina').classList.add('hidden');
      document.getElementById('listaConstructorRutina').innerHTML = '';
      document.getElementById('nombreRutinaInput').value = '';
      document.getElementById('btnGuardarRutina').innerText = 'Guardar Rutina';
      renumerarConstructor();
      if (!silencioso) mostrarToast('Edición cancelada');
    }

    function enviarRutinaCompleta() {
      const ed = estadoGlobal.edicionRutina;
      const modo = document.getElementById('modoCreacionRutina').value;
      const idDestino = ed
        ? ed.destino
        : (modo === 'PLANTILLA' ? 'PLANTILLA' : document.getElementById('selectAlumnoRutina').value);
      const nombreRutina = document.getElementById('nombreRutinaInput').value.trim() || 'RUTINA GENERAL';
      const filas = document.querySelectorAll('#listaConstructorRutina .fila-rutina');
      const lista = [];

      filas.forEach(tr => {
        const ejer = tr.querySelector('.r-ejer').value.trim();
        if (ejer) {
          lista.push({
            dia: tr.querySelector('.r-dia').value,
            musculo: tr.querySelector('.r-musc').value,
            ejercicio: ejer,
            idEjercicio: (tr.querySelector('.r-idej') || { value: '' }).value,
            serie: tr.querySelector('.r-ser').value,
            repeticiones: tr.querySelector('.r-rep').value,
            concentrica: tr.querySelector('.r-conc').value,
            pausaConcentrica: tr.querySelector('.r-pconc').value,
            excentrica: tr.querySelector('.r-exc').value,
            pausaExcentrica: tr.querySelector('.r-pexc').value,
            descanso: tr.querySelector('.r-desc').value || '0',
            tipoEjercicio: tr.querySelector('.r-tipo').value
          });
        }
      });

      if (lista.length === 0) return avisar('Agrega al menos un ejercicio.', 'atencion');
      const btn = document.getElementById('btnGuardarRutina');
      const textoBoton = ed ? ico('save') + ' Guardar cambios' : 'Guardar Rutina';
      btn.innerText = 'Guardando...';
      btn.disabled = true;

      const alTerminar = res => {
        btn.innerHTML = textoBoton;
        btn.disabled = false;
        if (res && res.plantillas) {
          estadoGlobal.plantillas = res.plantillas;
          actualizarSelectorPlantillas();
        }
        avisar((res && (res.mensaje || res.error)) || 'No se pudo guardar.', res && res.success ? 'exito' : 'error');
        if (ed && res && res.success) {
          const idAlumno = ed.destino;
          cancelarEdicionRutina(true); // silencioso: evita toast "Edición cancelada"
          if (idAlumno) {
            cambiarTabCoach('tabComparativaCoach'); // vuelve al expediente del alumno
            cargarProgresoParaCoach(idAlumno);
          }
        }
      };

      if (ed) {
        GS().withSuccessHandler(alTerminar).actualizarRutinaAsignada({
          idRutina: ed.idRutina, destino: idDestino, nombreRutina: nombreRutina,
          listaEjercicios: lista, idCoach: estadoGlobal.user.id
        });
      } else {
        GS().withSuccessHandler(alTerminar)
            .guardarRutinaCompleta(idDestino, nombreRutina, lista, estadoGlobal.user.id);
      }
    }

    function abrirDuplicarRutina() {
      const rutina = estadoGlobal.rutinaActual || [];
      if (!rutina.length || !rutina[0].idRutina) return avisar('Este alumno no tiene una rutina guardada todavía.', 'atencion');
      const idAlumno = (estadoGlobal.checkinsCoach || {}).idAlumno || '';
      const nom = rutina[0].nombreRutina || 'Rutina';
      estadoGlobal.duplicando = { idRutina: rutina[0].idRutina, desde: 'ALUMNO', origen: idAlumno };

      const otros = (estadoGlobal.alumnos || []).filter(a => a.id !== idAlumno);
      document.getElementById('dupDestino').innerHTML =
        '<option value="PLANTILLA">Mi catálogo de plantillas</option>' +
        otros.map(a => `<option value="${escHtml(a.id)}">${escHtml(a.nombre)}</option>`).join('');
      document.getElementById('dupNombre').value = nom + ' (copia)';
      document.getElementById('dupOrigen').textContent = `Origen: "${nom}" · ${rutina.length} ejercicio(s)`;
      document.getElementById('hojaDuplicar').classList.remove('hidden');
    }
    function cerrarDuplicar() { document.getElementById('hojaDuplicar').classList.add('hidden'); }

    function ejecutarDuplicarRutina() {
      const d = estadoGlobal.duplicando;
      if (!d) return;
      const hacia = document.getElementById('dupDestino').value;
      const nombreNuevo = document.getElementById('dupNombre').value.trim();
      if (!hacia) return avisar('Selecciona el destino.', 'atencion');
      const btn = document.getElementById('btnDuplicar');
      btn.disabled = true; btn.innerText = 'Duplicando...';
      GS().withSuccessHandler(res => {
        btn.disabled = false; btn.innerText = 'Duplicar';
        if (res && res.success) {
          if (res.plantillas) { estadoGlobal.plantillas = res.plantillas; actualizarSelectorPlantillas(); }
          cerrarDuplicar();
          mostrarToast('✅ Rutina duplicada');
        }
        avisar((res && (res.mensaje || res.error)) || 'No se pudo duplicar.', res && res.success ? 'exito' : 'error');
      }).duplicarRutina({ idRutina: d.idRutina, desde: d.desde, hacia, nombreNuevo, idCoach: estadoGlobal.user.id });
    }

    function borrarRutinaAsignada() {
      const rutina = estadoGlobal.rutinaActual || [];
      if (!rutina.length || !rutina[0].idRutina) return;
      confirmar(`¿Eliminar la rutina «${rutina[0].nombreRutina || ''}» (${rutina.length} ejercicios)?\n\nEl progreso ya registrado por el alumno NO se borra.`,
        { titulo: 'Eliminar rutina', textoSi: 'Eliminar', peligro: true }).then(ok => { if (ok) borrarRutinaAsignadaConfirmado(); });
    }
    function borrarRutinaAsignadaConfirmado() {
      const rutina = estadoGlobal.rutinaActual || [];
      GS().withSuccessHandler(res => {
        avisar((res && (res.mensaje || res.error)) || 'No se pudo eliminar.', res && res.success ? 'exito' : 'error');
        if (res && res.success) {
          estadoGlobal.rutinaActual = [];
          const idAlumno = (estadoGlobal.checkinsCoach || {}).idAlumno;
          if (idAlumno) cargarProgresoParaCoach(idAlumno);
        }
      }).eliminarRutinaAsignada(rutina[0].idRutina);
    }
          
        // ==================== WHATSAPP ====================
    const COD_PAIS = '51';   // Perú
    function telWhatsApp(num) {
      const d = String(num || '').replace(/\D/g, '');
      if (!d) return '';
      return (d.length === 9 && d.charAt(0) === '9') ? COD_PAIS + d : d;
    }
    function abrirWhatsApp(numero, texto) {
      const tel = telWhatsApp(numero);
      if (!tel) { mostrarToast('❌ Ese alumno no tiene WhatsApp registrado.'); return; }
      window.open('https://wa.me/' + tel + '?text=' + encodeURIComponent(texto), '_blank');
    }
    const alumnoPorId = id => (estadoGlobal.alumnos || []).find(a => a.id === id);
    const primerNombreDe = n => { const p = String(n || '').trim().split(/\s+/)[0] || ''; return p.charAt(0) + p.slice(1).toLowerCase(); };

    /** Resumen de la semana: días entrenados, check-in y último peso. */
    function textoResumenSemanal(idAlumno) {
      const a = alumnoPorId(idAlumno) || {};
      const sem = infoSemana(fechaLocalISO());
      const rutina = estadoGlobal.rutinaActual || [];
      const programados = DIAS_SEMANA.filter(d => rutina.some(r => normalizarDia(r.dia) === normalizarDia(d)));
      const datosSem = (estadoGlobal.semanas || []).find(x => x.semanaISO === sem.semanaISO);
      const regs = (datosSem && datosSem.registros) || [];
      const entrenados = programados.filter(d => regs.some(r => normalizarDia(r.dia) === normalizarDia(d) && r.valor));
      const ck = ((estadoGlobal.checkinsCoach && estadoGlobal.checkinsCoach.lista) || []).find(c => c.semanaISO === sem.semanaISO);
      const ult = (estadoGlobal.progresoActual || []).slice(-1)[0];
      let t = `Hola ${primerNombreDe(a.nombre)}, este es tu resumen de la semana ${sem.numero} (${sem.rango}):\n\n`;
      t += `🏋️ Entrenaste ${entrenados.length} de ${programados.length} día${programados.length === 1 ? '' : 's'} programados.\n`;
      if (ck && ck.peso) t += `⚖️ Peso que reportaste: ${ck.peso} kg.\n`;
      else if (ult && ult.peso !== '' && ult.peso !== undefined) t += `⚖️ Último peso registrado: ${ult.peso} kg.\n`;
      if (ck && ck.molestias) t += `⚠️ Anotaste esta molestia: ${ck.molestias}.\n`;
      if (!ck) t += `📋 Te falta enviar tu check-in de la semana.\n`;
      t += `\nSeguimos la próxima semana. — Tu coach`;
      return t;
    }

    /** Recordatorio del entrenamiento de hoy. */
    function textoRecordatorio(idAlumno) {
      const a = alumnoPorId(idAlumno) || {};
      const hoy = obtenerDiaActualSemana();
      const ejs = (estadoGlobal.rutinaActual || []).filter(r => normalizarDia(r.dia) === normalizarDia(hoy));
      if (!ejs.length) return `Hola ${primerNombreDe(a.nombre)}, hoy ${hoy.toLowerCase()} toca descanso. Aprovecha para hidratarte y dormir bien. — Tu coach`;
      const musculos = [...new Set(ejs.map(r => String(r.musculo || '').trim().toUpperCase()).filter(Boolean))];
      let t = `Hola ${primerNombreDe(a.nombre)}, hoy ${hoy.toLowerCase()} te toca entrenar:\n\n`;
      if (musculos.length) t += `💪 ${musculos.join(' · ')}\n`;
      t += `🔢 ${ejs.length} ejercicio${ejs.length === 1 ? '' : 's'}\n\n`;
      t += `Abre la app para ver la técnica de cada uno y registrar tus series. ¡Nos vemos! — Tu coach`;
      return t;
    }

    // ==================== REPORTE PDF ====================
    const reportesGenerados = {};   // idAlumno -> { nombre, blob, url (objeto local) }

    function blobDesdeBase64(b64, tipo) {
      const bin = atob(b64), bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new Blob([bytes], { type: tipo });
    }

    /** Descarga el PDF al teléfono o PC. Si el navegador no deja descargar, lo abre en otra pestaña. */
    function descargarReporte(idAlumno) {
      const r = reportesGenerados[idAlumno];
      if (!r) return;
      try {
        const a = document.createElement('a');
        a.href = r.url; a.download = r.nombre; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); a.remove();
      } catch (e) {
        try { window.open(r.url, '_blank'); } catch (e2) { avisar('No se pudo descargar el PDF en este navegador.', 'error'); }
      }
    }

    function bloqueReportePDF(idAlumno, paraCoach) {
      const hecho = reportesGenerados[idAlumno];
      const a = alumnoPorId(idAlumno) || {};
      const destino = paraCoach ? 'al alumno' : 'a tu coach';
      const telDestino = paraCoach ? a.whatsapp : ((estadoGlobal.coachInfo || {}).whatsapp || '');
      const enlace = hecho ? `
        <div class="mt-3 bg-slate-950 border border-emerald-500/30 rounded-xl p-3">
          <p class="text-xs text-slate-400 mb-2">Listo: <span class="text-emerald-400 font-bold">${escHtml(hecho.nombre)}</span></p>
          <div class="flex flex-wrap gap-2">
            <button onclick="descargarReporte('${escHtml(idAlumno)}')" class="flex-1 min-w-[130px] text-center bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl">${ico('download', 'w-4 h-4')} Descargar PDF</button>
            ${telDestino ? `<button onclick="enviarReportePorWhatsApp('${escHtml(idAlumno)}', ${paraCoach ? 'true' : 'false'})" class="flex-1 min-w-[130px] bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl active:scale-[0.98] transition">${ico('message-circle', 'w-4 h-4')} Enviar ${escHtml(destino)}</button>` : ''}
          </div>
          <p class="text-[11px] text-slate-400 mt-2">${ico('lock', 'w-4 h-4')} El reporte es privado: no se comparte por enlace. Se envía como archivo adjunto.</p>
        </div>` : '';
      return `
        <div id="bloqueReportePDF-${escHtml(idAlumno)}" class="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <h3 class="text-sm font-extrabold text-white mb-1">${ico('file-text', 'w-4 h-4')} Reporte PDF de progreso</h3>
          <p class="text-xs text-slate-400 mb-3">Incluye medidas y composición corporal, progreso de cargas, adherencia, check-ins y las fotos de antes y después.</p>
          <button id="btnReporte-${escHtml(idAlumno)}" onclick="generarReportePDFCliente('${escHtml(idAlumno)}', ${paraCoach ? 'true' : 'false'})"
            class="w-full sm:w-auto bg-emerald-500 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl active:scale-[0.98] transition">
            ${hecho ? '' + ico('refresh-cw', 'w-4 h-4') + ' Volver a generar' : '' + ico('file-text', 'w-4 h-4') + ' Generar reporte PDF'}
          </button>
          ${enlace}
        </div>`;
    }

    function generarReportePDFCliente(idAlumno, paraCoach) {
      const btn = document.getElementById('btnReporte-' + idAlumno);
      const txtPrev = btn ? btn.innerHTML : ico('file-text') + ' Generar reporte PDF';
      if (btn) { btn.disabled = true; btn.innerHTML = ico('loader-circle', 'w-4 h-4 animate-spin') + ' Generando PDF...'; btn.classList.add('opacity-60'); }
      GS().withSuccessHandler(res => {
        if (!res || !res.success) {
          if (btn) { btn.disabled = false; btn.innerHTML = txtPrev; btn.classList.remove('opacity-60'); }
          return avisar((res && res.error) || 'No se pudo generar el reporte.', 'error');
        }
        const previo = reportesGenerados[idAlumno];
        if (previo && previo.url) { try { URL.revokeObjectURL(previo.url); } catch (e) {} }
        const blob = blobDesdeBase64(res.pdfBase64 || '', 'application/pdf');
        reportesGenerados[idAlumno] = { nombre: res.nombre, blob: blob, url: URL.createObjectURL(blob) };

        const contClasico = document.getElementById('bloqueReportePDF-' + idAlumno);
        if (contClasico) contClasico.outerHTML = bloqueReportePDF(idAlumno, paraCoach);

        const contCoach = document.getElementById('estadoReporteCoach-' + idAlumno);
        if (contCoach) {
          if (btn) { btn.disabled = false; btn.innerHTML = ico('refresh-cw') + ' Volver a generar PDF'; btn.classList.remove('opacity-60'); }
          contCoach.innerHTML = barraDescargaReporteCoach(idAlumno);
        }
        mostrarToast('✅ Reporte listo para descargar o enviar');
      }).generarReportePDF({ idAlumno: idAlumno, incluirFotos: true });
    }

    function barraDescargaReporteCoach(idAlumno) {
      const hecho = reportesGenerados[idAlumno];
      if (!hecho) return '';
      const a = alumnoPorId(idAlumno) || {};
      return `
        <div class="bg-slate-900 border border-emerald-500/40 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-extrabold text-emerald-400 truncate">${ico('file-text', 'w-4 h-4')} ${escHtml(hecho.nombre)}</p>
            <p class="text-[11px] text-slate-400">${ico('lock', 'w-4 h-4')} Privado en Drive · Se comparte como archivo adjunto</p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button onclick="descargarReporte('${escHtml(idAlumno)}')" class="flex-1 sm:flex-none bg-slate-950 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl">${ico('download', 'w-4 h-4')} Descargar</button>
            ${a.whatsapp ? `<button onclick="enviarReportePorWhatsApp('${escHtml(idAlumno)}', true)" class="flex-1 sm:flex-none bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl">${ico('message-circle', 'w-4 h-4')} Enviar WhatsApp</button>` : ''}
          </div>
        </div>`;
    }

    /**
     * Envía el PDF como ARCHIVO. Si el teléfono permite compartir archivos, abre el menú
     * «Compartir» (elige WhatsApp). Si no, descarga el PDF y abre el chat para adjuntarlo.
     */
    async function enviarReportePorWhatsApp(idAlumno, paraCoach) {
      const hecho = reportesGenerados[idAlumno];
      if (!hecho) return;
      const a = alumnoPorId(idAlumno) || {};
      const yo = estadoGlobal.user || {};
      const numero = paraCoach ? a.whatsapp : (estadoGlobal.coachInfo || {}).whatsapp;
      const texto = paraCoach
        ? `Hola ${primerNombreDe(a.nombre)}, te comparto tu reporte de progreso de PRO COACHING (PDF adjunto).`
        : `Hola ${(estadoGlobal.coachInfo || {}).nombre || 'coach'}, soy ${yo.nombre || ''}. Te envío mi reporte de progreso (PDF adjunto).`;
      try {
        const archivo = new File([hecho.blob], hecho.nombre, { type: 'application/pdf' });
        if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
          await navigator.share({ files: [archivo], text: texto, title: hecho.nombre });
          return;
        }
      } catch (e) {
        if (e && e.name === 'AbortError') return;   // el usuario cerró el menú de compartir
      }
      descargarReporte(idAlumno);
      mostrarToast('📥 PDF descargado: adjúntalo en el chat de WhatsApp que se abrirá.');
      setTimeout(() => abrirWhatsApp(numero, texto), 900);
    }

    function construirBarraWhatsApp(idAlumno) {
      const a = alumnoPorId(idAlumno) || {};
      const tel = telWhatsApp(a.whatsapp);
      const cuerpo = tel
        ? `<div class="flex flex-wrap gap-2">
             <button onclick="enviarWhatsApp('${escHtml(idAlumno)}','resumen')" class="flex-1 min-w-[150px] bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl active:scale-[0.98] transition">${ico('chart-column', 'w-4 h-4')} Resumen semanal</button>
             <button onclick="enviarWhatsApp('${escHtml(idAlumno)}','recordatorio')" class="flex-1 min-w-[150px] bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-4 py-3 rounded-xl active:scale-[0.98] transition">${ico('alarm-clock', 'w-4 h-4')} Recordar entrenamiento</button>
             <button onclick="abrirWhatsApp('${escHtml(a.whatsapp)}','')" class="shrink-0 bg-slate-950 border border-slate-700 text-slate-300 font-bold text-xs px-4 py-3 rounded-xl">${ico('message-circle', 'w-4 h-4')} Escribir</button>
           </div>
           <p class="text-[11px] text-slate-400 mt-2">Número: +${escHtml(tel)} · <button onclick="pedirWhatsApp('${escHtml(idAlumno)}')" class="underline text-slate-400">cambiar</button></p>`
        : `<div class="flex flex-wrap items-center gap-2">
             <input type="tel" inputmode="tel" id="inpWa-${escHtml(idAlumno)}" placeholder="987654321" class="flex-1 min-w-[160px] p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white">
             <button onclick="guardarWhatsApp('${escHtml(idAlumno)}')" class="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl">Guardar</button>
           </div>
           <p class="text-[11px] text-slate-400 mt-2">Este alumno aún no tiene WhatsApp registrado.</p>`;
      return `
        <div id="bloqueWhatsAppCoach" class="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <h3 class="text-sm font-extrabold text-white mb-3">${ico('message-circle', 'w-4 h-4')} Enviar por WhatsApp</h3>
          ${cuerpo}
        </div>`;
    }

    function enviarWhatsApp(idAlumno, tipo) {
      const a = alumnoPorId(idAlumno);
      if (!a) return;
      abrirWhatsApp(a.whatsapp, tipo === 'resumen' ? textoResumenSemanal(idAlumno) : textoRecordatorio(idAlumno));
    }
    function pedirWhatsApp(idAlumno) {
      const a = alumnoPorId(idAlumno) || {};
      preguntar('Número de WhatsApp del alumno (sin código de país si es de Perú):',
        { titulo: 'WhatsApp del alumno', valor: a.whatsapp || '', placeholder: 'Ej. 987654321', tipoEntrada: 'tel', max: 20, textoSi: 'Guardar' })
        .then(nuevo => { if (nuevo !== null) guardarWhatsApp(idAlumno, nuevo); });
    }
    function guardarWhatsApp(idAlumno, valorDirecto) {
      const inp = document.getElementById('inpWa-' + idAlumno);
      const valor = valorDirecto !== undefined ? valorDirecto : (inp ? inp.value : '');
      GS().withSuccessHandler(res => {
        if (!res || !res.success) { mostrarToast('❌ ' + ((res && res.error) || 'No se pudo guardar.')); return; }
        const a = alumnoPorId(idAlumno);
        if (a) a.whatsapp = res.whatsapp;
        const barra = document.getElementById('bloqueWhatsAppCoach');
        if (barra) barra.outerHTML = construirBarraWhatsApp(idAlumno);
        mostrarToast('✅ ' + res.mensaje);
      }).actualizarWhatsAppAlumno(idAlumno, valor);
    }

    // ---- Listas de alumnos (Pestaña 1 y Pestaña 4) ----
    let alumnoCoachActivo = null;
    function inicialesDe(nombre) {
      const p = String(nombre || '').trim().split(/\s+/);
      return ((p[0] || '')[0] || '') + ((p[1] || '')[0] || '');
    }

    function toggleDrawerAlumnos(drawerId, abrir) {
      const dr = document.getElementById(drawerId);
      const ov = document.getElementById('overlay-' + drawerId);
      if (!dr || !ov) return;
      if (abrir) {
        dr.classList.remove('-translate-x-full');
        ov.classList.remove('hidden');
      } else {
        dr.classList.add('-translate-x-full');
        ov.classList.add('hidden');
      }
    }

    /** Formato único de tarjeta de alumno para Pestaña 1 y Pestaña 4. */
    // v17: etiquetas de estado de cada alumno (vienen del panel del coach)
    const ETIQUETA_PENDIENTE = {
      CHECKIN: ['Check-in', 'bg-amber-500/15 text-amber-300'], RECORD: ['Récord', 'bg-amber-500/15 text-amber-300'],
      SIN_ENTRENAR: ['Sin entrenar', 'bg-rose-500/15 text-rose-300'], EVALUACION: ['Evaluación', 'bg-rose-500/15 text-rose-300']
    };
    function etiquetasAlumnoCoach(id) {
      if (!panelCoach || !panelCoach.estado || !panelCoach.estado[id]) return '';
      const p = [...new Set(panelCoach.estado[id].pendientes)];
      if (!p.length) return '<span class="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">Al día</span>';
      return p.slice(0, 2).map(t => `<span class="text-[11px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${ETIQUETA_PENDIENTE[t][1]}">${ETIQUETA_PENDIENTE[t][0]}</span>`).join('') +
        (p.length > 2 ? `<span class="text-[11px] font-bold text-slate-400">+${p.length - 2}</span>` : '');
    }

    function htmlTarjetaAlumnoCoach(a, { activo = false, onclick = '' }) {
      const act = actividadCoach[a.id] || {};
      const avatar = a.foto
        ? `<img src="${escHtml(urlFotoConCache(a.foto))}" data-mini="1" referrerpolicy="no-referrer" onerror="cargarFotoSegura(this, false)" alt="" loading="lazy" class="w-11 h-11 rounded-full object-cover border-2 ${activo ? 'border-emerald-400' : 'border-slate-700'} shrink-0">`
        : `<span class="w-11 h-11 rounded-full font-black text-sm flex items-center justify-center shrink-0 ${activo ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'}">${escHtml(inicialesDe(a.nombre).toUpperCase())}</span>`;
      const linea = textoActividad(a.id);
      return `
        <button type="button" onclick="${onclick}"
          class="w-full text-left p-3 rounded-2xl border transition flex items-center gap-3 active:scale-[0.99] ${activo ? 'bg-emerald-500/10 border-emerald-500/60' : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700'}">
          <span class="relative shrink-0">${avatar}${act.enLinea ? '<span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" aria-label="En línea"></span>' : ''}</span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-extrabold text-white truncate">${escHtml(nombreCortoCoach(a.nombre))}</span>
            <span class="block text-xs text-slate-400 truncate mt-0.5">${escHtml(String(a.nivel || 'Sin nivel').replace(/:.*$/, ''))}${linea ? ' · ' + escHtml(linea.replace(/^● /, '')) : ''}</span>
          </span>
          <span class="flex flex-col items-end gap-1 shrink-0">${etiquetasAlumnoCoach(a.id)}</span>
          <span class="${activo ? 'text-emerald-400' : 'text-slate-400'} shrink-0">${ico('chevron-right', 'w-4 h-4')}</span>
        </button>`;
    }

    function renderListaMisAlumnosTab1() {
      const cont = document.getElementById('listaMisAlumnosTab1');
      if (!cont) return;
      const lista = estadoGlobal.alumnos || [];
      const txtCnt = lista.length + (lista.length === 1 ? ' alumno' : ' alumnos');
      ['contadorMisAlumnos', 'contadorMisAlumnosMovil', 'contadorAnalizarMovil'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = txtCnt;
      });
      if (!lista.length) {
        cont.innerHTML = '<div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">Aún no tienes alumnos registrados.</div>';
        return;
      }
      cont.innerHTML = lista.map(a => htmlTarjetaAlumnoCoach(a, {
        activo: false,
        onclick: `toggleDrawerAlumnos('drawerAlumnosTab1', false); cambiarTabCoach('tabComparativaCoach'); cargarProgresoParaCoach('${escHtml(a.id)}')`
      })).join('');
    }

    function mostrarVistaAnalizarMovil(verExpediente) {
      const lista = document.getElementById('panelListaAnalizar');
      const exp = document.getElementById('panelExpedienteAnalizar');
      if (!lista || !exp) return;
      if (verExpediente) {
        lista.classList.add('hidden', 'sm:flex');
        exp.classList.remove('hidden');
      } else {
        lista.classList.remove('hidden');
        exp.classList.add('hidden');
      }
    }

    function volverAListaAlumnosMovil() {
      mostrarVistaAnalizarMovil(false);
      window.scrollTo({ top: 0, behavior: modoScroll() });
    }

    const filtroAlumnosCoach = { q: '', f: 'TODOS' };
    function renderTarjetasAlumnos() {
      const cont = document.getElementById('tarjetasAlumnosCoach');
      if (!cont) return;
      const lista = estadoGlobal.alumnos || [];
      const cnt = document.getElementById('contadorAnalizarMovil');
      const atencion = a => panelCoach && panelCoach.estado && panelCoach.estado[a.id] && panelCoach.estado[a.id].pendientes.length > 0;
      const nivelDe = a => (String(a.nivel || '').match(/NIVEL (I{1,3})\b/) || [])[1] || '';
      const filtros = [['TODOS', 'Todos', lista.length], ['ATENCION', 'Atención', lista.filter(atencion).length], ['I', 'Nivel I'], ['II', 'Nivel II'], ['III', 'Nivel III']]
        .filter(([k]) => ['TODOS', 'ATENCION'].includes(k) || lista.some(a => nivelDe(a) === k));
      const fc = document.getElementById('filtrosAlumnosCoach');
      if (fc) fc.innerHTML = filtros.map(([k, t, n]) => `<button type="button" aria-pressed="${filtroAlumnosCoach.f === k}" onclick="filtroAlumnosCoach.f='${k}'; renderTarjetasAlumnos()"
        class="shrink-0 min-h-[36px] px-3.5 rounded-full text-xs font-extrabold border ${filtroAlumnosCoach.f === k ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-slate-900 text-slate-300 border-slate-800'}">${t}${n !== undefined ? ' ' + n : ''}</button>`).join('');
      if (cnt) cnt.textContent = lista.length + (lista.length === 1 ? ' alumno' : ' alumnos') + (panelCoach ? ` · ${panelCoach.resumen.entrenaronHoy} entrenaron hoy` : '');
      if (!lista.length) {
        cont.innerHTML = `<div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center"><p class="text-sm font-bold text-white">Aún no tienes alumnos</p><p class="text-xs text-slate-400 mt-1">Crea el primero con el botón «Nuevo».</p></div>`;
        return;
      }
      const q = normBusq(filtroAlumnosCoach.q || '');
      const vis = lista.filter(a => (!q || normBusq((a.nombre || '') + ' ' + (a.usuario || '')).includes(q)) &&
        (filtroAlumnosCoach.f === 'TODOS' || (filtroAlumnosCoach.f === 'ATENCION' ? atencion(a) : nivelDe(a) === filtroAlumnosCoach.f)));
      cont.innerHTML = vis.length ? vis.map(a => htmlTarjetaAlumnoCoach(a, { activo: a.id === alumnoCoachActivo, onclick: `cargarProgresoParaCoach('${escHtml(a.id)}')` })).join('')
        : '<p class="p-4 text-sm text-slate-400 text-center">Ningún alumno coincide con la búsqueda o el filtro.</p>';
    }

    // ---- KPIs del expediente del Coach ----
    function calcularKPIsAlumno(progreso, semanas) {
      // 1. Adherencia (última semana registrada)
      let adherencia = '—';
      if (semanas && semanas.length) {
        const ultSem = semanas[semanas.length - 1];
        const g = agruparSemana(ultSem);
        const claves = Object.keys(g);
        if (claves.length) {
          const ok = claves.filter(k => ejercicioHecho(g[k])).length;
          adherencia = Math.round((ok / claves.length) * 100) + '%';
        }
      }

      // 2. Masa magra y 3. % Grasa (delta entre primera y última evaluación, o valor actual si hay 1)
      let masaTxt = '—', masaPos = true, grasaTxt = '—', grasaPos = true;
      const evals = (progreso || []).filter(p => p && (p.peso || p.grasaCorporal || p.masaCorporal));
      const magraDe = e => {
        const m = parseFloat(e.masaCorporal);
        if (!isNaN(m) && m > 0) return m;
        const p = parseFloat(e.peso), gr = parseFloat(e.grasaCorporal);
        return (!isNaN(p) && !isNaN(gr)) ? p * (1 - gr / 100) : NaN;
      };
      if (evals.length >= 2) {
        const pri = evals[0], ult = evals[evals.length - 1];
        const m0 = magraDe(pri), m1 = magraDe(ult);
        if (!isNaN(m0) && !isNaN(m1)) {
          const dm = Math.round((m1 - m0) * 10) / 10;
          masaTxt = (dm > 0 ? '+' : '') + dm.toFixed(1) + ' kg';
          masaPos = dm >= 0;
        }
        const g0 = parseFloat(pri.grasaCorporal), g1 = parseFloat(ult.grasaCorporal);
        if (!isNaN(g0) && !isNaN(g1)) {
          const dg = Math.round((g1 - g0) * 10) / 10;
          grasaTxt = (dg > 0 ? '+' : '') + dg.toFixed(1) + '%';
          grasaPos = dg <= 0;
        }
      } else if (evals.length === 1) {
        const m1 = magraDe(evals[0]), g1 = parseFloat(evals[0].grasaCorporal);
        if (!isNaN(m1)) masaTxt = m1.toFixed(1) + ' kg';
        if (!isNaN(g1)) grasaTxt = g1.toFixed(1) + '%';
      }

      // 4. Carga total (cambio medio % entre las 2 últimas semanas)
      let cargaTxt = '—', cargaPos = true;
      if (semanas && semanas.length >= 2) {
        const gA = agruparSemana(semanas[semanas.length - 2]);
        const gB = agruparSemana(semanas[semanas.length - 1]);
        const pcts = [];
        Object.keys(gB).forEach(k => {
          const nA = valorNumerico(gA[k]), nB = valorNumerico(gB[k]);
          if (nA !== null && nB !== null && nA > 0) pcts.push(((nB - nA) / nA) * 100);
        });
        if (pcts.length) {
          const media = pcts.reduce((a, b) => a + b, 0) / pcts.length;
          cargaTxt = (media > 0 ? '+' : '') + media.toFixed(1) + '%';
          cargaPos = media >= 0;
        }
      }

      return { adherencia, masaTxt, masaPos, grasaTxt, grasaPos, cargaTxt, cargaPos };
    }

    function construirTarjetaCheckinReciente(lista) {
      if (!lista || !lista.length) {
        return `
          <div id="tarjetaCheckinDestacado" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-extrabold text-white">Check-in semanal</p>
              <span class="text-xs font-bold text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-full">Sin envíos</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">Este alumno aún no ha enviado su primer check-in semanal.</p>
          </div>`;
      }
      const c = lista[0];
      const badge = c.respuesta
        ? '<span class="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">Respondido</span>'
        : '<span class="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 px-3 py-1 rounded-full">Pendiente</span>';
      return `
        <div id="tarjetaCheckinDestacado" class="bg-slate-900/90 border ${c.respuesta ? 'border-slate-800' : 'border-amber-500/40'} rounded-2xl p-4 sm:p-5 space-y-3">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <p class="text-sm font-extrabold text-white">Check-in · ${escHtml(c.semanaISO)} <span class="text-xs font-normal text-slate-400">(${escHtml(c.fecha)})</span></p>
            ${badge}
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            ${c.peso ? `<span>${ico('scale', 'w-4 h-4')} <strong>${escHtml(c.peso)} kg</strong></span>` : ''}
            <span class="inline-flex items-center gap-1">${ico('zap', 'w-3.5 h-3.5')} Energía ${CARAS[(parseInt(c.energia) || 3) - 1]}</span>
            <span class="inline-flex items-center gap-1">${ico('moon', 'w-3.5 h-3.5')} Sueño ${CARAS[(parseInt(c.sueno) || 3) - 1]}</span>
            <span>${c.molestias ? `<span class="text-rose-300">${ico('triangle-alert', 'w-4 h-4')} ${escHtml(c.molestias)}</span>` : '' + ico('bandage', 'w-4 h-4') + ' Sin molestias'}</span>
          </div>
          ${c.nota ? `<p class="text-xs text-slate-300 italic">“${escHtml(c.nota)}”</p>` : ''}
          ${c.respuesta
            ? `<div class="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200">${escHtml(c.respuesta)}</div>`
            : `<div class="flex gap-2">
                 <input type="text" maxlength="500" placeholder="Responder al alumno..." id="respTop-${escHtml(c.semanaISO)}"
                   class="flex-1 min-w-0 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white">
                 <button onclick="responderCheckinCoach('${escHtml(c.semanaISO)}', 'respTop-')"
                   class="shrink-0 px-4 bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-xs">Enviar</button>
               </div>`}
        </div>`;
    }

    function cambiarSubTabExpediente(subId) {
      document.querySelectorAll('.subtab-exp').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById(subId);
      if (target) target.classList.remove('hidden');
      document.querySelectorAll('.btn-subtab-exp').forEach(btn => {
        const on = btn.id === 'btnSub-' + subId;
        btn.className = 'btn-subtab-exp shrink-0 whitespace-nowrap min-h-[44px] px-3 text-sm font-extrabold border-b-2 transition ' + (on ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white');
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (subId === 'expProgreso') {
        setTimeout(() => inicializarGraficosSeparados(), 60);
      }
    }

    function cargarProgresoParaCoach(idDirecto) {
      detenerVivoCoach();
      editandoAlerta = false;
      const idAlumno = idDirecto || document.getElementById('selectAlumnoAnalizar').value;
      if (!idAlumno) return;
      alumnoCoachActivo = idAlumno;
      const selHidden = document.getElementById('selectAlumnoAnalizar');
      if (selHidden) selHidden.value = idAlumno;
      renderTarjetasAlumnos();
      
      mostrarVistaAnalizarMovil(true);
      window.scrollTo({ top: 0, behavior: modoScroll() });

      const cont = document.getElementById('contenedorComparativaCoach');
      cont.innerHTML = esqueleto('tarjetas', 3, 'Cargando expediente del alumno');

      GS()
        .withSuccessHandler(res => {
          if (!res || res.success === false) {
            cont.innerHTML = '<p class="text-rose-400 text-sm">' + escHtml((res && res.error) || 'No se pudo cargar el expediente.') + '</p>';
            return;
          }
          estadoGlobal.progresoActual = res.progreso || [];
          estadoGlobal.rutinaActual = res.rutina || [];
          estadoGlobal.historialRutinas = res.historialRutinas || [];
          estadoGlobal.semanas = res.semanas || [];
          estadoGlobal.checkinsCoach = { idAlumno, lista: res.checkins || [] };
          estadoGlobal.notasCoach = Object.assign({ idAlumno }, res.notasCoach || {});
          inicializarProgresoCoach();
          estadoGlobal.diaSeleccionado = obtenerDiaActualSemana();

          const alu = alumnoPorId(idAlumno) || { nombre: 'Alumno', nivel: '' };
          const kpi = calcularKPIsAlumno(estadoGlobal.progresoActual, estadoGlobal.semanas);
          const racha = rachaSemanas();
          const avatarHtml = alu.foto
            ? `<img src="${escHtml(urlFotoConCache(alu.foto))}" data-mini="1" referrerpolicy="no-referrer" onerror="cargarFotoSegura(this, false)" class="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/60 shrink-0">`
            : `<span class="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 font-black text-base flex items-center justify-center shrink-0">${escHtml(inicialesDe(alu.nombre).toUpperCase())}</span>`;

          const kpiCard = (etiqueta, valor, positivo) => `
            <div class="bg-slate-950 border border-slate-800/90 rounded-xl p-3">
              <span class="block text-[11px] text-slate-400 font-semibold">${etiqueta}</span>
              <span class="block text-lg sm:text-xl font-black mt-0.5 ${valor === '—' ? 'text-slate-400' : (positivo ? 'text-emerald-400' : 'text-rose-400')}">${escHtml(valor)}</span>
            </div>`;

          const act = actividadCoach[idAlumno] || {};
          const accion = (icono, texto, onclick, id = '') => `
            <button type="button" ${id ? `id="${id}"` : ''} onclick="${onclick}" class="flex flex-col items-center justify-center gap-1.5 min-h-[72px] px-1 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-100 text-xs font-bold text-center active:scale-[0.98] transition">
              <span class="text-emerald-400">${ico(icono, 'w-5 h-5')}</span>${texto}</button>`;
          const pestana = (id, texto, activa) => `<button type="button" role="tab" id="btnSub-${id}" aria-selected="${activa}" onclick="cambiarSubTabExpediente('${id}')"
              class="btn-subtab-exp shrink-0 whitespace-nowrap min-h-[44px] px-3 text-sm font-extrabold border-b-2 transition ${activa ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white'}">${texto}</button>`;

          cont.innerHTML = `
            <div class="space-y-4">
              <!-- v17 · CABECERA DE LA FICHA -->
              <div class="flex items-center gap-3">
                <button type="button" onclick="volverAListaAlumnosMovil()" aria-label="Volver a la lista de alumnos" class="sm:hidden w-11 h-11 shrink-0 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-center">${ico('arrow-left', 'w-5 h-5')}</button>
                ${avatarHtml}
                <div class="min-w-0 flex-1">
                  <h3 class="text-lg font-black text-white truncate">${escHtml(nombreCortoCoach(alu.nombre))}</h3>
                  <div class="flex items-center gap-2 flex-wrap mt-1">
                    <button type="button" id="chipNivel-${escHtml(idAlumno)}" onclick="abrirCambioNivel('${escHtml(idAlumno)}')" aria-label="Cambiar nivel" class="inline-flex items-center gap-1.5 min-h-[32px] px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold whitespace-nowrap hover:bg-emerald-500/20">${ico('graduation-cap', 'w-3.5 h-3.5')}<span>${htmlNivelCorto(alu.nivel)}</span>${ico('pencil', 'w-3 h-3')}</button>
                    <span class="text-xs text-slate-400 truncate">${textoActividad(idAlumno) ? escHtml(textoActividad(idAlumno).replace(/^● /, '')) : ''}${act.entrenoHoy ? ' · entrenó hoy' : ''}</span>
                  </div>
                </div>
                <span class="shrink-0 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1">${ico('flame', 'w-3.5 h-3.5')} ${racha} ${racha === 1 ? 'sem.' : 'sem.'}</span>
              </div>

              <!-- v17 · ACCIONES RÁPIDAS -->
              <div class="grid grid-cols-4 gap-2">
                ${accion('message-circle', 'WhatsApp', `cambiarSubTabExpediente('expComunicacion')`)}
                ${accion('clipboard-pen', 'Evaluar', `abrirEvaluacionPara('${escHtml(idAlumno)}')`)}
                ${accion('clipboard-list', 'Rutina', `cambiarSubTabExpediente('expRutina')`)}
                ${accion('file-text', 'Reporte PDF', `generarReportePDFCliente('${escHtml(idAlumno)}', true)`, 'btnReporte-' + escHtml(idAlumno))}
              </div>
              <div id="estadoReporteCoach-${escHtml(idAlumno)}">${barraDescargaReporteCoach(idAlumno)}</div>

              <!-- v17 · PESTAÑAS DE LA FICHA -->
              <div role="tablist" aria-label="Secciones del alumno" class="flex gap-1 overflow-x-auto no-scrollbar border-b border-slate-800">
                ${pestana('expResumen', 'Resumen', true)}${pestana('expRutina', 'Rutina', false)}${pestana('expProgreso', 'Medidas y fotos', false)}${pestana('expComunicacion', 'Check-ins y WhatsApp', false)}
              </div>

              <div id="expResumen" class="subtab-exp space-y-4">
                <div id="vivoCoach" aria-live="polite"></div>
                <div id="resumenFicha">${htmlResumenFicha(idAlumno)}</div>
              </div>

              <div id="expRutina" class="subtab-exp hidden">
                ${construirResumenRutinaCoach(estadoGlobal.rutinaActual, estadoGlobal.historialRutinas)}
              </div>

              <div id="expProgreso" class="subtab-exp hidden">
                ${construirBloqueHistorialHTML(estadoGlobal.progresoActual)}
              </div>

              <div id="expComunicacion" class="subtab-exp hidden space-y-4">
                ${construirBarraWhatsApp(idAlumno)}
                ${construirBloqueCheckinsCoach(res.checkins || [])}
              </div>
            </div>
          `;

          seleccionarDiaResumen(estadoGlobal.diaSeleccionado);
          inicializarSelectoresFotos();
          renderComparadorSemanas();
          iniciarVivoCoach(idAlumno, res.rutina || []);
        })
        .obtenerDetallesAlumnoParaCoach(idAlumno);
    }

    function construirBloqueCheckinsCoach(lista) {
      const tarjetas = lista.length ? lista.map(c => `
        <div class="bg-slate-950 border ${c.respuesta ? 'border-slate-800' : 'border-amber-500/40'} rounded-xl p-3">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="text-xs font-extrabold text-white">${escHtml(c.semanaISO)} <span class="text-slate-400 font-semibold">· ${escHtml(c.fecha)}</span></span>
            <span class="text-xs text-slate-300">${c.peso ? ico('scale', 'w-3.5 h-3.5') + ' ' + escHtml(c.peso) + ' kg · ' : ''}Energía ${CARAS[(parseInt(c.energia) || 3) - 1]} · Sueño ${CARAS[(parseInt(c.sueno) || 3) - 1]}</span>
          </div>
          ${c.molestias ? `<p class="text-xs text-rose-300 mt-2">${ico('triangle-alert', 'w-4 h-4')} ${escHtml(c.molestias)}</p>` : ''}
          ${c.nota ? `<p class="text-sm text-slate-200 mt-2 italic">“${escHtml(c.nota)}”</p>` : '<p class="text-xs text-slate-400 mt-2">Sin nota.</p>'}
          ${c.respuesta
            ? `<div class="mt-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5"><p class="text-[11px] font-bold text-emerald-300 uppercase">Tu respuesta · ${escHtml(c.fechaRespuesta)}</p><p class="text-sm text-white mt-0.5">${escHtml(c.respuesta)}</p></div>`
            : `<div class="mt-2 flex gap-2"><input type="text" maxlength="500" placeholder="Responder al alumno..." class="flex-1 min-w-0 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white" id="resp-${escHtml(c.semanaISO)}">
               <button onclick="responderCheckinCoach('${escHtml(c.semanaISO)}')" class="shrink-0 px-3 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">Enviar</button></div>`}
        </div>`).join('') : '<p class="text-sm text-slate-400">Este alumno aún no ha enviado check-ins.</p>';
      const pendientes = lista.filter(c => !c.respuesta).length;
      return `
        <div id="bloqueCheckinsCoach" class="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
          <h3 class="text-sm font-extrabold text-white mb-3">${ico('clipboard-list', 'w-4 h-4')} Historial de Check-ins ${pendientes ? `<span class="ml-2 text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">${pendientes} sin responder</span>` : ''}</h3>
          <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">${tarjetas}</div>
        </div>`;
    }

    function responderCheckinCoach(semanaISO, prefijoId) {
      const inp = document.getElementById((prefijoId || 'resp-') + semanaISO);
      if (!inp || !inp.value.trim()) return;
      const ctx = estadoGlobal.checkinsCoach; if (!ctx) return;
      GS().withSuccessHandler(res => {
        if (!res || !res.success) { mostrarToast('❌ ' + ((res && res.error) || 'No se pudo responder.')); return; }
        ctx.lista = res.checkins || [];
        const bloque = document.getElementById('bloqueCheckinsCoach');
        if (bloque) bloque.outerHTML = construirBloqueCheckinsCoach(ctx.lista);
        const dest = document.getElementById('tarjetaCheckinDestacado');
        if (dest) dest.outerHTML = construirTarjetaCheckinReciente(ctx.lista);
        mostrarToast('✅ ' + res.mensaje);
        cargarPanelCoach();
      }).responderCheckin(ctx.idAlumno, semanaISO, inp.value.trim());
    }
 

    // ==================== ACTIVIDAD DE LOS ALUMNOS (v11) ====================
    let actividadCoach = {}, actividadHoy = '', actividadTimer = null;

    function iniciarActividadCoach() {
      cargarActividadCoach();
      clearInterval(actividadTimer);
      // v19: cada 30 s con el inicio a la vista («Entrenando ahora»); cada 60 s en el resto
      let ultimaAct = Date.now();
      actividadTimer = setInterval(() => {
        if (document.hidden || !esCoach()) return;
        const tabHoy = document.getElementById('tabHoyCoach');
        const enInicio = tabHoy && !tabHoy.classList.contains('hidden');
        if (!enInicio && Date.now() - ultimaAct < 59000) return;
        ultimaAct = Date.now();
        cargarActividadCoach();
      }, SEG_REFRESCO_INICIO * 1000);
    }
    function detenerActividadCoach() { clearInterval(actividadTimer); actividadTimer = null; actividadCoach = {}; }
    function cargarActividadCoach() {
      GS().withSuccessHandler(res => {
        if (!res || !res.success) return;
        actividadCoach = {}; actividadHoy = res.hoy;
        (res.actividad || []).forEach(a => { actividadCoach[a.id] = a; });
        if (Array.isArray(res.vivos) && panelCoach) {
          aplicarVivosEquipo(res.vivos);
          const tabHoy = document.getElementById('tabHoyCoach');
          if (tabHoy && !tabHoy.classList.contains('hidden')) renderHoyCoach();
        }
        renderListaMisAlumnosTab1();
        renderTarjetasAlumnos();
        const modal = document.getElementById('modalActividadHoy');
        if (modal && !modal.classList.contains('hidden')) renderListaActividadHoy();
      }).withFailureHandler(() => {}).obtenerActividadAlumnos();
    }

    function haceCuanto(iso) {
      const t = Date.parse(iso || '');
      if (!t) return 'sin conexiones';
      const min = Math.max(0, Math.round((Date.now() - t) / 60000));
      if (min < 2) return 'hace un momento';
      if (min < 60) return 'hace ' + min + ' min';
      const h = Math.round(min / 60);
      if (h < 24) return 'hace ' + h + ' h';
      const dias = Math.round(h / 24);
      return dias === 1 ? 'ayer' : 'hace ' + dias + ' días';
    }
    function textoActividad(id) {
      const a = actividadCoach[id];
      if (!a) return '';
      if (a.enLinea) return '● En línea · ' + (a.origen === 'app' ? 'app' : 'web');
      return haceCuanto(a.ultimaConexion) + (a.ultimaConexion && a.origen ? ' · ' + a.origen : '');
    }

    function abrirActividadHoy() {
      renderListaActividadHoy();
      document.getElementById('modalActividadHoy').classList.remove('hidden');
    }
    function renderListaActividadHoy() {
      const cont = document.getElementById('listaActividadHoy');
      if (!cont) return;
      const nombre = id => (alumnoPorId(id) || {}).nombre || 'Alumno';
      const lista = Object.values(actividadCoach).sort((x, y) =>
        (y.entrenoHoy - x.entrenoHoy) || (y.enLinea - x.enLinea) || ((Date.parse(y.ultimaConexion) || 0) - (Date.parse(x.ultimaConexion) || 0)));
      cont.innerHTML = lista.map(a => `
        <button type="button" onclick="document.getElementById('modalActividadHoy').classList.add('hidden'); cambiarTabCoach('tabComparativaCoach'); cargarProgresoParaCoach('${escHtml(a.id)}')"
          class="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border ${a.entrenoHoy ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'}">
          <span class="w-2.5 h-2.5 rounded-full shrink-0 ${a.enLinea ? 'bg-emerald-400' : 'bg-slate-600'}"></span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-bold text-white truncate">${escHtml(nombre(a.id))}</span>
            <span class="block text-xs text-slate-400">${escHtml(textoActividad(a.id))}</span>
          </span>
          <span class="shrink-0 text-xs font-bold ${a.entrenoHoy ? 'text-emerald-300' : 'text-slate-400'}">${a.entrenoHoy ? `${ico('circle-check', 'w-4 h-4')} ${a.ejerciciosHoy} ej. · ${a.seriesHoy} series` : 'No entrenó hoy'}</span>
        </button>`).join('') || '<p class="text-xs text-slate-400">Aún no tienes alumnos.</p>';
    }

    // ==================== RÉCORDS DEL COACH (v11) ====================
    function bloquePendientesRecords(d) {
      const p = d.pendientes || [];
      const cuerpo = p.length ? `<div class="space-y-2">${p.map((r, i) => `
        <div class="ko-low rounded-xl p-3" style="box-shadow:inset 0 0 0 1px rgba(249,115,22,.4)">
          <div class="flex items-center gap-3">${avatarRec({ nombre: r.alumno, foto: r.foto }, 36)}
            <div class="min-w-0"><p class="text-sm font-bold truncate">${escHtml(r.alumno)}</p>
            <p class="text-xs t-mu">${escHtml(r.ejercicio)} · <strong class="t-lima2">${kgRec(r.peso)}</strong> × ${escHtml(r.reps)} · ${escHtml(fechaRec(r.fecha))}</p></div></div>
          <label class="ko-lbl t-mu block mt-3 mb-1">Comentario del logro (lo verán sus compañeros)</label>
          <input id="comRec-${i}" maxlength="140" value="${escHtml(r.comentario || '')}" placeholder="Ej. Bloqueo limpio, sin correas" class="ko-in">
          <div class="flex gap-2 mt-2.5">
            <button onclick="revisarRecordCoach('${escHtml(r.id)}', true, ${i})" class="ko-btn flex-1 text-xs py-2.5">${ico('circle-check', 'w-4 h-4')} Aprobar</button>
            <button onclick="revisarRecordCoach('${escHtml(r.id)}', false, ${i})" class="ko-btn2 flex-1 text-xs py-2.5 t-err">${ico('x', 'w-4 h-4')} Rechazar</button>
          </div>
        </div>`).join('')}</div>` : '<p class="text-xs t-mu">No hay récords esperando tu aprobación.</p>';
      return `<div class="ko-card" style="${p.length ? 'box-shadow:inset 0 0 0 1px rgba(249,115,22,.45)' : ''}">${tituloRec('inbox', 'Récords por aprobar', p.length ? `<span class="ko-pill b-nar-s">${p.length}</span>` : '')}${cuerpo}</div>`;
    }
    function revisarRecordCoach(id, aprobar, i) {
      if (!aprobar) {
        return preguntar('Motivo del rechazo (opcional, el alumno lo verá):', { titulo: 'Rechazar récord', textoSi: 'Rechazar', peligro: true, max: 200, placeholder: 'Ej. Faltó profundidad en la sentadilla' })
          .then(nota => { if (nota !== null) enviarRevisionRecord(id, false, nota.trim()); });
      }
      const campo = document.getElementById('comRec-' + i);
      enviarRevisionRecord(id, true, { nota: '', comentario: campo ? campo.value.trim() : '' });
    }
    function enviarRevisionRecord(id, aprobar, arg) {
      GS().withSuccessHandler(res => {
        mostrarToast((res && res.success ? '✅ ' : '❌ ') + ((res && (res.mensaje || res.error)) || ''));
        cargarRecords(recordsContenedor);
      }).revisarRecord(id, aprobar, arg);
    }

    function bloqueEjerciciosRanking() {
      const lista = recordsEdicion || [];
      const chips = lista.map((e, i) => `
        <span class="inline-flex items-center gap-1 ko-hi text-xs font-bold pl-3 pr-1 py-1 rounded-full">
          ${escHtml(e.nombre)}
          <button onclick="quitarEjercicioRanking(${i})" aria-label="Quitar" class="tap w-6 h-6 rounded-full t-err flex items-center justify-center" title="Quitar">${icoRec('close', '!text-[16px]')}</button>
        </span>`).join('');
      const cambiado = JSON.stringify(lista) !== JSON.stringify((recordsData.ejercicios || []).map(e => ({ idEjercicio: e.idEjercicio, nombre: e.nombre })));
      return `<div class="ko-card">${tituloRec('fitness_center', 'Ejercicios del ranking')}
        <p class="text-xs t-mu mb-3">Elige hasta 12. Los pesos que tus alumnos registran en estos ejercicios cuentan para el ranking.</p>
        <div class="flex flex-wrap gap-2 mb-3">${chips || '<span class="text-xs t-dim">Todavía no elegiste ejercicios.</span>'}</div>
        <div class="flex flex-wrap gap-2">
          <button onclick="agregarEjercicioRanking()" ${lista.length >= 12 ? 'disabled' : ''} class="ko-btn2 flex-1 min-w-[150px] text-xs py-3 disabled:opacity-40">${ico('library', 'w-4 h-4')} Añadir de la biblioteca</button>
          <button onclick="guardarEjerciciosRankingCoach()" id="btnGuardarRanking" ${cambiado ? '' : 'disabled'} class="ko-btn flex-1 min-w-[150px] text-xs py-3">${ico('save', 'w-4 h-4')} Guardar</button>
        </div></div>`;
    }
    function agregarEjercicioRanking() {
      abrirCatalogo(e => {
        const nombre = String(nombreEsDe(e) || e.nombre || '').toUpperCase();
        if ((recordsEdicion || []).some(x => x.idEjercicio === e.id || x.nombre === nombre)) return mostrarToast('Ese ejercicio ya está en el ranking.');
        recordsEdicion.push({ idEjercicio: e.id, nombre: nombre });
        renderRecords();
      });
    }
    function quitarEjercicioRanking(i) { recordsEdicion.splice(i, 1); renderRecords(); }
    function guardarEjerciciosRankingCoach() {
      const btn = document.getElementById('btnGuardarRanking'); if (btn) { btn.disabled = true; btn.innerText = 'Guardando...'; }
      GS().withSuccessHandler(res => {
        mostrarToast((res && res.success ? '✅ ' : '❌ ') + ((res && (res.mensaje || res.error)) || ''));
        cargarRecords(recordsContenedor);
      }).guardarEjerciciosRanking(recordsEdicion || []);
    }

    // ---- Clubes de honor (v12): el coach define metas por ejercicio del ranking ----
    function bloqueEditarClubes(d) {
      const ejs = d.ejercicios || [];
      const lista = clubesEdicion || [];
      const chips = lista.map((c, i) => `
        <span class="inline-flex items-center gap-1 ko-hi text-xs font-bold pl-3 pr-1 py-1 rounded-full">
          ${icoRec('shield', 't-cian !text-[15px]', true)} ${escHtml(c.nombre)} · ${numRec(c.kg)} kg
          <button onclick="quitarClub(${i})" aria-label="Quitar" class="tap w-6 h-6 rounded-full t-err flex items-center justify-center" title="Quitar">${icoRec('close', '!text-[16px]')}</button>
        </span>`).join('');
      const cambiado = JSON.stringify(lista) !== JSON.stringify((d.clubes || []).map(c => ({ idEjercicio: c.idEjercicio, nombre: c.ejercicio, kg: c.kg })));
      const form = ejs.length ? `
        <div class="grid grid-cols-[1fr_90px_auto] gap-2 items-end">
          <div><label class="ko-lbl t-mu block mb-1">Ejercicio</label>
            <select id="clubEj" class="ko-in">${ejs.map((e, i) => `<option value="${i}">${escHtml(e.nombre)}</option>`).join('')}</select></div>
          <div><label class="ko-lbl t-mu block mb-1">Meta (kg)</label>
            <input id="clubKg" type="number" inputmode="decimal" min="1" max="1000" step="0.5" placeholder="100" class="ko-in"></div>
          <button onclick="agregarClub()" ${lista.length >= 10 ? 'disabled' : ''} class="ko-btn2 h-[40px] px-3 text-xs">${icoRec('add', '!text-[18px]')}</button>
        </div>` : '<p class="text-xs t-dim">Primero elige los ejercicios del ranking.</p>';
      return `<div class="ko-card">${tituloRec('workspace_premium', 'Editar clubes de honor')}
        <p class="text-xs t-mu mb-3">Hasta 10 metas. Solo cuentan los récords que tú apruebas. Ej.: Press banca 100 kg.</p>
        <div class="flex flex-wrap gap-2 mb-3">${chips || '<span class="text-xs t-dim">Todavía no creaste clubes.</span>'}</div>
        ${form}
        <button onclick="guardarClubesCoach()" id="btnGuardarClubes" ${cambiado ? '' : 'disabled'} class="ko-btn w-full text-xs py-3 mt-3">${ico('save', 'w-4 h-4')} Guardar clubes</button>
      </div>`;
    }
    function agregarClub() {
      const ejs = (recordsData && recordsData.ejercicios) || [];
      const e = ejs[parseInt(document.getElementById('clubEj').value, 10)];
      const kg = Math.round(parseFloat(String(document.getElementById('clubKg').value).replace(',', '.')) * 10) / 10;
      if (!e) return;
      if (!(kg > 0 && kg <= 1000)) return mostrarToast('Escribe la meta en kg (1 a 1000).');
      clubesEdicion = clubesEdicion || [];
      if (clubesEdicion.some(c => c.nombre === e.nombre && c.kg === kg)) return mostrarToast('Ese club ya existe.');
      clubesEdicion.push({ idEjercicio: e.idEjercicio, nombre: e.nombre, kg: kg });
      renderRecords();
    }
    function quitarClub(i) { clubesEdicion.splice(i, 1); renderRecords(); }
    function guardarClubesCoach() {
      const btn = document.getElementById('btnGuardarClubes'); if (btn) { btn.disabled = true; btn.innerText = 'Guardando...'; }
      GS().withSuccessHandler(res => {
        mostrarToast((res && res.success ? '✅ ' : '❌ ') + ((res && (res.mensaje || res.error)) || ''));
        cargarRecords(recordsContenedor);
      }).guardarClubes(clubesEdicion || []);
    }


    // ==================== v17 · NAVEGACIÓN DEL COACH, «HOY» Y MENSAJES ====================
    const NAV_COACH = {
      tabHoyCoach: ['HOY', 'Hoy'], tabComparativaCoach: ['ALUMNOS', 'Alumnos'], tabNuevoAlumno: ['ALUMNOS', 'Nuevo alumno'],
      tabMedidasFotos: ['EVALUACIONES', 'Evaluaciones'], tabCrearRutina: ['RUTINAS', 'Rutinas'], tabRecordsCoach: ['RECORDS', 'Récords'],
      tabMensajesCoach: ['MENSAJES', 'Mensajes']
    };
    let panelCoach = null, panelCoachCargando = false, hoyVerTodos = false, mensajesFiltro = 'PEND';

    function cambiarTabCoach(tabId) {
      if (tabId !== 'tabComparativaCoach') detenerVivoCoach();
      if (!document.getElementById(tabId)) tabId = 'tabHoyCoach';
      document.querySelectorAll('.tab-coach').forEach(el => el.classList.add('hidden'));
      document.getElementById(tabId).classList.remove('hidden');
      const [clave, titulo] = NAV_COACH[tabId] || ['HOY', 'Hoy'];
      const claveBot = (clave === 'EVALUACIONES' || clave === 'MENSAJES') ? 'MAS' : clave;
      document.querySelectorAll('.navc-side').forEach(b => {
        const on = b.dataset.navc === clave;
        b.classList.toggle('bg-emerald-500', on); b.classList.toggle('text-slate-950', on);
        b.classList.toggle('text-slate-300', !on); b.classList.toggle('hover:bg-slate-800/70', !on);
        if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      });
      document.querySelectorAll('.navc-bot').forEach(b => {
        const on = b.dataset.navc === claveBot;
        b.classList.toggle('text-emerald-400', on); b.classList.toggle('text-slate-400', !on);
        const barra = b.querySelector('.navc-barra');
        if (on && !barra) b.insertAdjacentHTML('afterbegin', '<span class="navc-barra absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] rounded-full bg-emerald-400"></span>');
        if (!on && barra) barra.remove();
        if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      });
      const t = document.getElementById('tituloCoachMovil'); if (t) t.textContent = titulo;
      if (tabId === 'tabRecordsCoach') cargarRecords('contenedorRecordsCoach');
      if (tabId === 'tabHoyCoach') { renderHoyCoach(); cargarPanelCoach(); }
      if (tabId === 'tabMensajesCoach') { renderMensajesCoach(); cargarPanelCoach(); }
      if (tabId === 'tabComparativaCoach' && !panelCoach) cargarPanelCoach();
      if (tabId === 'tabMedidasFotos' && typeof irPasoEvaluacion === 'function') irPasoEvaluacion(evalPaso || 1, true);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    function abrirMasCoach() { document.getElementById('hojaMasCoach').classList.remove('hidden'); }
    function cerrarMasCoach() { document.getElementById('hojaMasCoach').classList.add('hidden'); }

    function cargarPanelCoach() {
      if (panelCoachCargando) return;
      panelCoachCargando = true;
      // v18: el último panel guardado en el teléfono se muestra al instante; luego se reemplaza por el del servidor
      const clavePanel = 'panel/' + ((estadoGlobal.user && estadoGlobal.user.id) || '');
      if (!panelCoach) CajaLocal.leerJSON(CAJA_VISTAS, clavePanel).then(g => {
        if (!g || !g.success || !g.resumen || panelCoach || !estadoGlobal.user) return;
        panelCoach = g;
        renderHoyCoach(); renderMensajesCoach(); actualizarBadgesCoach(); renderTarjetasAlumnos();
      });
      GS().withFailureHandler(() => { panelCoachCargando = false; })
        .withSuccessHandler(res => {
          panelCoachCargando = false;
          if (!res || !res.success || !res.resumen) {
            const c = document.getElementById('contenedorHoyCoach');
            if (c && !panelCoach) c.innerHTML = `<p class="text-rose-300 text-sm">${escHtml((res && res.error) || 'No se pudo cargar el panel. Verifica que el Apps Script esté actualizado a la última versión.')}</p>`;
            return;
          }
          panelCoach = res;
          if (estadoGlobal.user) CajaLocal.guardarJSON(CAJA_VISTAS, clavePanel, res);
          renderHoyCoach(); renderMensajesCoach(); actualizarBadgesCoach();
          if (typeof renderTarjetasAlumnos === 'function') renderTarjetasAlumnos();
        }).obtenerPanelCoach();
    }

    function actualizarBadgesCoach() {
      const n = panelCoach ? panelCoach.resumen.checkinsPendientes : 0;
      ['badgeMensajesSide', 'badgeMensajesMovil', 'badgeMensajesMas'].forEach(id => {
        const b = document.getElementById(id); if (!b) return;
        b.textContent = n; b.classList.toggle('hidden', !n);
        b.setAttribute('aria-label', n + (n === 1 ? ' check-in sin responder' : ' check-ins sin responder'));
      });
      const d = document.getElementById('badgeMasCoach'); if (d) d.classList.toggle('hidden', !n);
    }

    function avatarAlumnoCoach(id, tam = 'w-10 h-10', texto = 'text-sm') {
      const a = alumnoPorId(id) || {};
      const ini = escHtml(inicialesDe(a.nombre || '?').toUpperCase());
      return a.foto
        ? `<img src="${escHtml(urlFotoConCache(a.foto))}" alt="" data-mini="1" referrerpolicy="no-referrer" onerror="cargarFotoSegura(this, false)" class="${tam} rounded-full object-cover border border-slate-700 shrink-0">`
        : `<span class="${tam} ${texto} rounded-full bg-slate-800 text-slate-200 font-black flex items-center justify-center shrink-0" aria-hidden="true">${ini}</span>`;
    }
    const nombreCortoCoach = n => String(n || '').trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    const ESTILO_PENDIENTE = {
      CHECKIN: { ico: 'message-circle', tono: 'bg-amber-500/15 text-amber-300', accion: 'Responder' },
      RECORD: { ico: 'trophy', tono: 'bg-amber-500/15 text-amber-300', accion: 'Revisar' },
      SIN_ENTRENAR: { ico: 'activity', tono: 'bg-rose-500/15 text-rose-300', accion: 'WhatsApp' },
      EVALUACION: { ico: 'calendar-check', tono: 'bg-rose-500/15 text-rose-300', accion: 'Evaluar' }
    };

    function accionPendiente(i) {
      const p = panelCoach && panelCoach.pendientes[i]; if (!p) return;
      if (p.tipo === 'CHECKIN') return irAMensajeCoach(p.idAlumno, p.semanaISO);
      if (p.tipo === 'RECORD') return cambiarTabCoach('tabRecordsCoach');
      if (p.tipo === 'EVALUACION') return abrirEvaluacionPara(p.idAlumno);
      if (p.tipo === 'SIN_ENTRENAR') {
        const a = alumnoPorId(p.idAlumno) || {};
        const txt = p.dias
          ? `Hola ${primerNombreDe(a.nombre)}, hace ${p.dias} días que no registras entrenamiento en la app. ¿Todo bien? Si necesitas ajustar la rutina o los horarios, avísame y lo vemos. — Tu coach`
          : `Hola ${primerNombreDe(a.nombre)}, aún no veo entrenamientos registrados en la app. ¿Necesitas ayuda para empezar? — Tu coach`;
        if (!telWhatsApp(a.whatsapp)) return pedirWhatsApp(p.idAlumno);
        return abrirWhatsApp(a.whatsapp, txt);
      }
    }
    function abrirFichaAlumno(id) { cambiarTabCoach('tabComparativaCoach'); cargarProgresoParaCoach(id); }

    // ==================== v19 · INICIO DEL COACH ====================
    // Qué hacer hoy en 5 segundos: quién entrena ahora, a quién le toca hoy, cómo va la semana del equipo
    // y qué pendientes atender, con la alerta física y la última nota de cada alumno a la vista.
    const SEG_REFRESCO_INICIO = 30;
    const tituloEj = t => String(t || '').trim().toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
    const PUNTO_VIVO = (on) => on
      ? '<span class="relative flex w-2.5 h-2.5 shrink-0"><span class="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-60 animate-ping motion-reduce:animate-none"></span><span class="relative inline-flex w-2.5 h-2.5 rounded-full bg-rose-500"></span></span>'
      : '<span class="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0"></span>';
    function etiquetasNotaCoach(id) {
      const n = panelCoach && panelCoach.notas && panelCoach.notas[id];
      if (!n) return '';
      const t = [];
      if (n.alerta) t.push(`<span class="inline-flex items-center gap-1 max-w-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold px-2 py-0.5 rounded-full"><span class="shrink-0">${ico('triangle-alert', 'w-3 h-3')}</span><span class="truncate">${escHtml(n.alerta)}</span></span>`);
      if (n.nota) t.push(`<span class="inline-flex items-center gap-1 max-w-full bg-slate-800 text-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full" title="Tu última nota"><span class="shrink-0">${ico('notebook-pen', 'w-3 h-3')}</span><span class="truncate">${escHtml(n.nota)}</span></span>`);
      return `<span class="flex flex-wrap gap-1.5 mt-1.5">${t.join('')}</span>`;
    }
    const vivosAhora = () => {     // el panel guardado en el teléfono puede ser de antes: se exige una marca reciente
      const lim = ((panelCoach && panelCoach.reglas && panelCoach.reglas.minEntrenandoAhora) || 20) * 60000;
      return ((panelCoach && panelCoach.vivos) || []).filter(v => v.ahora && !(Date.now() - Date.parse(v.t) > lim));
    };
    /** Lo que llega cada 30 s (obtenerActividadAlumnos) actualiza «Entrenando ahora» y el estado de «Hoy les toca». */
    function aplicarVivosEquipo(vivos) {
      if (!panelCoach || !Array.isArray(vivos)) return;
      panelCoach.vivos = vivos;
      const r = panelCoach.resumen;
      (panelCoach.sesionesHoy || []).forEach(x => {
        const v = vivos.find(y => y.id === x.idAlumno && y.dia === panelCoach.diaHoy);
        if (!v || x.estado === 'COMPLETO') return;
        const pct = v.total ? Math.round(v.hechas / v.total * 100) : 0;
        if (v.completo) { x.estado = 'COMPLETO'; x.pct = 100; }
        else if (v.hechas > 0) { x.estado = 'EN_CURSO'; x.pct = Math.max(x.pct || 0, pct); }
      });
      r.entrenandoAhora = vivos.filter(v => v.ahora).length;
      r.sesionesHoyCompletas = (panelCoach.sesionesHoy || []).filter(x => x.estado === 'COMPLETO').length;
    }
    function htmlVivoInicio() {
      const lista = vivosAhora();
      const filas = lista.map(v => {
        const pct = v.total ? Math.round(v.hechas / v.total * 100) : 0;
        const a = v.actual;
        const detalle = a ? (a.siguiente ? `Siguiente: ${escHtml(tituloEj(a.nombre))}` : `${escHtml(tituloEj(a.nombre))} · serie ${Math.min(a.serie, a.series)} de ${a.series}`) : 'Marcando su rutina';
        return `
          <button type="button" onclick="abrirFichaAlumno('${escHtml(v.id)}')" class="w-full text-left mt-3 first:mt-0 rounded-xl hover:bg-slate-800/50 p-1 -m-1">
            <span class="flex items-center gap-2.5">
              ${avatarAlumnoCoach(v.id, 'w-9 h-9', 'text-xs')}
              <span class="flex-1 min-w-0">
                <span class="block text-sm font-extrabold text-white truncate">${escHtml(nombreCortoCoach(v.nombre))}${v.grupos && v.grupos.length ? ' · ' + escHtml(tituloEj(v.grupos.join(' y '))) : ''}</span>
                <span class="block text-xs text-amber-300 break-words">${detalle}</span>
              </span>
              <span class="text-right shrink-0"><span class="block text-sm font-black text-emerald-400">${v.ejHechos}/${v.ejTotal || '–'}</span><span class="block text-[11px] text-slate-400">${escHtml(haceCuanto(v.t))}</span></span>
            </span>
            <span class="block h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Avance de ${escHtml(nombreCortoCoach(v.nombre))}"><span class="block h-full bg-emerald-500 rounded-full" style="width:${pct}%"></span></span>
          </button>`;
      }).join('');
      return `
        <section id="hoyVivo" class="order-1 bg-slate-900 border border-slate-800 rounded-2xl p-4" aria-labelledby="tituloHoyVivo">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h3 id="tituloHoyVivo" class="text-sm font-black text-white flex items-center gap-2">${PUNTO_VIVO(lista.length)} Entrenando ahora</h3>
            <span class="text-[11px] text-slate-400">se actualiza cada ${SEG_REFRESCO_INICIO} s</span>
          </div>
          ${filas ? `<div class="pt-2">${filas}</div>` : '<p class="text-xs text-slate-400 pt-1">Nadie está entrenando en este momento. Cuando un alumno marque una serie, lo verás aquí.</p>'}
        </section>`;
    }
    function htmlHoyLesToca() {
      const ses = (panelCoach && panelCoach.sesionesHoy) || [];
      const est = {
        COMPLETO: x => `<span class="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-400">${ico('circle-check', 'w-3.5 h-3.5')}Completo${x.minutos ? ' · ' + x.minutos + ' min' : ''}</span>`,
        EN_CURSO: x => `<span class="inline-flex items-center gap-1 text-xs font-extrabold text-amber-300">${ico('timer', 'w-3.5 h-3.5')}En curso · ${x.pct}%</span>`,
        PENDIENTE: () => `<span class="inline-flex items-center gap-1 text-xs font-extrabold text-slate-400">${ico('clock', 'w-3.5 h-3.5')}Pendiente</span>`
      };
      const filas = ses.map((x, i) => `
        <li><button type="button" onclick="abrirFichaAlumno('${escHtml(x.idAlumno)}')" class="w-full flex items-center gap-2.5 py-2 min-h-[44px] text-left ${i ? 'border-t border-slate-800' : ''}">
          ${avatarAlumnoCoach(x.idAlumno, 'w-8 h-8', 'text-[11px]')}
          <span class="flex-1 min-w-0"><span class="block text-sm font-bold text-white truncate">${escHtml(nombreCortoCoach(x.nombre))}</span>${x.grupos && x.grupos.length ? `<span class="block text-[11px] text-slate-400 truncate">${escHtml(tituloEj(x.grupos.join(' · ')))}</span>` : ''}</span>
          ${(est[x.estado] || est.PENDIENTE)(x)}
        </button></li>`).join('');
      return `
        <section id="hoyLesToca" class="order-3 bg-slate-900 border border-slate-800 rounded-2xl p-4" aria-labelledby="tituloHoyLesToca">
          <h3 id="tituloHoyLesToca" class="text-sm font-black text-white flex items-center gap-2 mb-1">${ico('calendar-check', 'w-4 h-4 text-emerald-400')} Hoy les toca</h3>
          ${filas ? `<ul>${filas}</ul>` : '<p class="text-xs text-slate-400">Ningún alumno tiene sesión programada para hoy en su rutina.</p>'}
        </section>`;
    }
    function htmlProximasEvaluaciones() {
      const l = (panelCoach && panelCoach.proximasEvaluaciones) || [];
      const filas = l.slice(0, 6).map((x, i) => `
        <li><button type="button" onclick="abrirEvaluacionPara('${escHtml(x.idAlumno)}')" class="w-full flex items-center gap-2.5 py-2 min-h-[44px] text-left ${i ? 'border-t border-slate-800' : ''}">
          ${avatarAlumnoCoach(x.idAlumno, 'w-8 h-8', 'text-[11px]')}
          <span class="flex-1 min-w-0 text-sm font-bold text-white truncate">${escHtml(nombreCortoCoach(x.nombre))}</span>
          <span class="inline-flex items-center gap-1 text-xs font-extrabold ${x.faltan <= 3 ? 'text-amber-300' : 'text-slate-400'}">${ico('clock', 'w-3.5 h-3.5')}${x.faltan === 1 ? 'mañana' : 'en ' + x.faltan + ' días'}</span>
        </button></li>`).join('');
      return `
        <section class="order-4 bg-slate-900 border border-slate-800 rounded-2xl p-4" aria-labelledby="tituloProxEval">
          <h3 id="tituloProxEval" class="text-sm font-black text-white flex items-center gap-2 mb-1">${ico('clipboard-pen', 'w-4 h-4 text-emerald-400')} Próximas evaluaciones</h3>
          ${filas ? `<ul>${filas}</ul>` : '<p class="text-xs text-slate-400">Ninguna vence en las próximas 2 semanas.</p>'}
        </section>`;
    }
    function htmlAlertasEquipo() {
      const notas = (panelCoach && panelCoach.notas) || {};
      const ids = Object.keys(notas).filter(id => notas[id].alerta && alumnoPorId(id));
      const tags = ids.map(id => `<button type="button" onclick="abrirFichaAlumno('${escHtml(id)}')" class="inline-flex items-center gap-1.5 max-w-full min-h-[32px] bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-extrabold px-2.5 py-1 rounded-full hover:bg-amber-500/20"><span class="shrink-0">${ico('triangle-alert', 'w-3.5 h-3.5')}</span><span class="truncate">${escHtml(primerNombreDe((alumnoPorId(id) || {}).nombre))} · ${escHtml(notas[id].alerta)}</span></button>`).join('');
      return `
        <section class="order-5 bg-slate-900 border border-slate-800 rounded-2xl p-4" aria-labelledby="tituloAlertasEq">
          <h3 id="tituloAlertasEq" class="text-sm font-black text-white flex items-center gap-2 mb-2">${ico('bandage', 'w-4 h-4 text-emerald-400')} Alertas físicas activas</h3>
          ${tags ? `<div class="flex flex-wrap gap-1.5">${tags}</div>` : '<p class="text-xs text-slate-400">Ningún alumno tiene alertas. Se agregan desde el Resumen de su ficha.</p>'}
        </section>`;
    }

    function renderHoyCoach() {
      const cont = document.getElementById('contenedorHoyCoach');
      if (!cont) return;
      if (!panelCoach) { cont.innerHTML = esqueleto('tarjetas', 3, 'Cargando tu panel'); return; }
      const r = panelCoach.resumen, pend = panelCoach.pendientes || [];
      const nombre = (estadoGlobal.user && estadoGlobal.user.nombre) || '';
      const primero = primerNombreDe(nombre);
      let fecha = '';
      try { fecha = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }); fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1); } catch (e) {}
      const kpi = (etiqueta, valor, sub, color, onclick, vivo) => `
        <button type="button" ${onclick ? `onclick="${onclick}"` : 'tabindex="-1"'} class="text-left bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 min-w-0 ${onclick ? 'hover:border-emerald-500/40 active:scale-[0.99] transition' : 'cursor-default'}">
          <span class="flex items-center gap-2 text-xs text-slate-400 font-bold">${vivo !== undefined ? PUNTO_VIVO(vivo) : ''}${etiqueta}</span>
          <span class="block text-2xl sm:text-3xl font-black mt-1 leading-tight ${color}">${valor}</span>
          <span class="block text-xs text-slate-400 mt-0.5">${sub}</span>
        </button>`;
      const chico = t => `<span class="text-base font-bold text-slate-400">${t}</span>`;

      // KPIs
      const ahora = vivosAhora();
      const v0 = ahora[0];
      const subVivo = v0 ? `${escHtml(primerNombreDe(v0.nombre))}${v0.grupos && v0.grupos[0] ? ' · ' + escHtml(tituloEj(v0.grupos[0])) : ''} ${v0.ejHechos} de ${v0.ejTotal}${ahora.length > 1 ? ` · +${ahora.length - 1}` : ''}` : 'Nadie en este momento';
      const nSes = r.sesionesHoy || 0, nSesOk = r.sesionesHoyCompletas || 0;
      const semH = r.semanaHechas || 0, semP = r.semanaProgramadas || 0, semPct = semP ? Math.round(semH / semP * 100) : 0;
      const nCh = pend.filter(p => p.tipo === 'CHECKIN').length, nRec = pend.filter(p => p.tipo === 'RECORD').length, nOtros = pend.length - nCh - nRec;
      const partes = [];
      if (nCh) partes.push(nCh + (nCh === 1 ? ' check-in' : ' check-ins'));
      if (nRec) partes.push(nRec + (nRec === 1 ? ' récord' : ' récords'));
      if (nOtros) partes.push(partes.length ? nOtros + ' más' : nOtros + (nOtros === 1 ? ' alumno por atender' : ' alumnos por atender'));
      const kpis = `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          ${kpi('Entrenando ahora', ahora.length, subVivo, ahora.length ? 'text-emerald-400' : 'text-white', "irASeccionHoy('hoyVivo')", ahora.length)}
          ${kpi('Sesiones de hoy', nSes ? `${nSesOk} ${chico('de ' + nSes)}` : '0', nSes ? 'completas de las programadas' : 'Nadie tiene sesión hoy', 'text-white', "irASeccionHoy('hoyLesToca')")}
          ${kpi('Adherencia del equipo', semP ? `${semH} ${chico('/ ' + semP)}` : '—', semP ? `sesiones esta semana · ${semPct}%` : 'Sin rutinas con días de la semana', semP && semPct >= 80 ? 'text-emerald-400' : 'text-white', '')}
          ${kpi('Pendientes', pend.length, pend.length ? partes.join(' · ') : 'Todo al día', pend.length ? 'text-amber-300' : 'text-white', "irASeccionHoy('hoyAtencion')")}
        </div>`;

      // Qué hacer hoy
      const visibles = hoyVerTodos ? pend : pend.slice(0, 6);
      const filas = visibles.length ? visibles.map((p, i) => {
        const e = ESTILO_PENDIENTE[p.tipo];
        const tono = p.tipo === 'EVALUACION' && p.dias === null ? 'bg-amber-500/15 text-amber-300' : e.tono;
        const colorDet = /^(SIN_ENTRENAR|EVALUACION)$/.test(p.tipo) && p.dias !== null ? 'text-rose-300' : 'text-slate-300';
        return `
          <li class="flex items-start gap-3 py-3 ${i ? 'border-t border-slate-800' : ''}">
            <span class="w-10 h-10 rounded-xl ${tono} flex items-center justify-center shrink-0">${ico(e.ico, 'w-5 h-5')}</span>
            <button type="button" onclick="abrirFichaAlumno('${escHtml(p.idAlumno)}')" class="flex-1 min-w-0 text-left min-h-[44px]">
              <span class="block text-sm font-extrabold text-white truncate">${escHtml(nombreCortoCoach(p.nombre))}</span>
              <span class="block text-xs ${colorDet} truncate">${escHtml(p.detalle)}</span>
              ${etiquetasNotaCoach(p.idAlumno)}
            </button>
            <button type="button" onclick="accionPendiente(${pend.indexOf(p)})" class="shrink-0 min-h-[44px] px-3 rounded-xl text-sm font-extrabold text-emerald-300 hover:bg-emerald-500/10">${e.accion}</button>
          </li>`;
      }).join('') : `<li class="py-6 text-center"><span class="inline-flex w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-300 items-center justify-center mb-2">${ico('circle-check', 'w-6 h-6')}</span><span class="block text-sm font-bold text-white">Todo al día</span><span class="block text-xs text-slate-400">No hay check-ins, récords, evaluaciones ni alumnos inactivos pendientes.</span></li>`;
      const verTodos = pend.length > 6 ? `<button type="button" onclick="hoyVerTodos = !hoyVerTodos; renderHoyCoach()" class="w-full min-h-[44px] mt-1 text-sm font-bold text-emerald-300 rounded-xl hover:bg-slate-800/60">${hoyVerTodos ? 'Ver menos' : `Ver todos (${pend.length})`}</button>` : '';
      const atencion = `
        <section id="hoyAtencion" class="order-2 lg:order-none bg-slate-900 border border-slate-800 rounded-2xl p-4" aria-labelledby="tituloAtencion">
          <div class="flex items-center justify-between gap-2">
            <h3 id="tituloAtencion" class="text-base font-black text-white flex items-center gap-2">${ico('list-checks', 'w-5 h-5 text-emerald-400')} Qué hacer hoy</h3>
            ${pend.length ? `<span class="bg-amber-500/15 text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-full">${pend.length} pendiente${pend.length === 1 ? '' : 's'}</span>` : ''}
          </div>
          <p class="text-xs text-slate-400 mt-0.5 mb-1">Ordenado por urgencia · con la alerta física y tu última nota de cada alumno</p>
          <ul>${filas}</ul>${verTodos}
          <p class="text-[11px] text-slate-500 mt-2">Evaluación vencida: ${panelCoach.reglas.diasEvaluacion} días o más desde la última. Sin entrenar: ${panelCoach.reglas.diasSinEntrenar} días o más sin registrar series.</p>
        </section>`;

      const nAhora = ahora.length;
      cont.innerHTML = `
        <div class="hidden md:flex items-end justify-between gap-3 flex-wrap">
          <div><h2 class="text-2xl font-black text-white">Hola, ${escHtml(primero)}</h2><p class="text-sm text-slate-400">${escHtml(fecha)} · ${r.totalAlumnos} ${r.totalAlumnos === 1 ? 'alumno' : 'alumnos'}${nAhora ? ` · ${nAhora} entrenando ahora` : ''}</p></div>
          <div class="flex gap-2 flex-wrap">
            <button type="button" onclick="abrirEvaluacionPara('')" class="min-h-[44px] px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm font-extrabold inline-flex items-center gap-2">${ico('clipboard-pen', 'w-4 h-4')} Nueva evaluación</button>
            <button type="button" onclick="cambiarTabCoach('tabNuevoAlumno')" class="min-h-[44px] px-4 rounded-xl bg-emerald-500 text-slate-950 text-sm font-extrabold inline-flex items-center gap-2">${ico('user-plus', 'w-4 h-4')} Nuevo alumno</button>
          </div>
        </div>
        <p class="md:hidden text-sm text-slate-400 -mt-1">Hola, <strong class="text-white">${escHtml(primero)}</strong> · ${escHtml(fecha)}</p>
        ${kpis}
        <div class="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-4 lg:items-start">
          ${atencion}
          <div class="contents lg:flex lg:flex-col lg:gap-3">
            ${htmlVivoInicio()}
            ${htmlHoyLesToca()}
            ${htmlProximasEvaluaciones()}
            ${htmlAlertasEquipo()}
            <div class="order-6 grid grid-cols-2 gap-3 md:hidden">
              <button type="button" onclick="cambiarTabCoach('tabNuevoAlumno')" class="min-h-[48px] px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm font-extrabold inline-flex items-center justify-center gap-2">${ico('user-plus', 'w-4 h-4')} Nuevo alumno</button>
              <button type="button" onclick="abrirEvaluacionPara('')" class="min-h-[48px] px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm font-extrabold inline-flex items-center justify-center gap-2">${ico('clipboard-pen', 'w-4 h-4')} Evaluar</button>
            </div>
          </div>
        </div>`;
    }
    function irASeccionHoy(id) {
      const el = document.getElementById(id); if (!el) return;
      el.scrollIntoView({ behavior: modoScroll(), block: 'start' });
    }

    function irAMensajeCoach(idAlumno, semana) {
      mensajesFiltro = 'PEND';
      cambiarTabCoach('tabMensajesCoach');
      setTimeout(() => {
        const inp = document.getElementById('msgResp-' + idAlumno + '-' + semana);
        if (inp) { inp.scrollIntoView({ behavior: modoScroll(), block: 'center' }); inp.focus(); }
      }, 50);
    }

    function renderMensajesCoach() {
      const cont = document.getElementById('contenedorMensajesCoach');
      if (!cont) return;
      if (!panelCoach) { cont.innerHTML = esqueleto('lista', 4, 'Cargando mensajes'); return; }
      const todos = panelCoach.mensajes || [];
      const pend = todos.filter(m => !m.respuesta);
      const lista = mensajesFiltro === 'PEND' ? pend : todos;
      const seg = [['PEND', `Sin responder (${pend.length})`], ['TODOS', 'Todos']].map(([k, t]) =>
        `<button type="button" onclick="mensajesFiltro='${k}'; renderMensajesCoach()" aria-pressed="${mensajesFiltro === k}" class="flex-1 min-h-[40px] rounded-lg text-sm font-extrabold ${mensajesFiltro === k ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}">${t}</button>`).join('');
      const cara = v => CARAS[(parseInt(v, 10) || 3) - 1] || '';
      const tarjetas = lista.length ? lista.map(m => {
        const idInp = `msgResp-${escHtml(m.idAlumno)}-${escHtml(m.semanaISO)}`;
        return `
        <article class="bg-slate-900 border ${m.respuesta ? 'border-slate-800' : 'border-amber-500/40'} rounded-2xl p-4 space-y-3">
          <div class="flex items-center gap-3">
            ${avatarAlumnoCoach(m.idAlumno)}
            <button type="button" onclick="abrirFichaAlumno('${escHtml(m.idAlumno)}')" class="flex-1 min-w-0 text-left min-h-[44px]">
              <span class="block text-sm font-extrabold text-white truncate">${escHtml(nombreCortoCoach(m.nombre))}</span>
              <span class="block text-xs text-slate-400">Semana ${escHtml(String(m.semanaISO).replace(/^\d{4}-W/, ''))} · ${escHtml(fechaCorta(m.fecha))}</span>
            </button>
            <span class="shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-full ${m.respuesta ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}">${m.respuesta ? 'Respondido' : 'Sin responder'}</span>
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
            ${m.peso ? `<span class="inline-flex items-center gap-1">${ico('scale', 'w-3.5 h-3.5')} ${escHtml(m.peso)} kg</span>` : ''}
            <span class="inline-flex items-center gap-1">${ico('zap', 'w-3.5 h-3.5')} Energía ${cara(m.energia)}</span>
            <span class="inline-flex items-center gap-1">${ico('moon', 'w-3.5 h-3.5')} Sueño ${cara(m.sueno)}</span>
            ${m.molestias ? `<span class="inline-flex items-center gap-1 text-rose-300">${ico('triangle-alert', 'w-3.5 h-3.5')} ${escHtml(m.molestias)}</span>` : ''}
          </div>
          ${m.nota ? `<p class="text-sm text-slate-200 italic">“${escHtml(m.nota)}”</p>` : ''}
          ${m.respuesta
            ? `<div class="bg-slate-950 border border-slate-800 rounded-xl p-3"><span class="block text-xs font-bold text-emerald-300 mb-1">Tu respuesta · ${escHtml(fechaCorta(m.fechaRespuesta))}</span><p class="text-sm text-slate-200">${escHtml(m.respuesta)}</p></div>`
            : `<div class="flex gap-2"><label for="${idInp}" class="sr-only">Responder a ${escHtml(nombreCortoCoach(m.nombre))}</label>
                <input id="${idInp}" type="text" maxlength="500" placeholder="Responder a ${escHtml(primerNombreDe(m.nombre))}…" onkeydown="if (event.key === 'Enter') responderMensajeCoach('${escHtml(m.idAlumno)}', '${escHtml(m.semanaISO)}')"
                  class="flex-1 min-w-0 min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-white focus:border-emerald-500">
                <button type="button" id="btn-${idInp}" onclick="responderMensajeCoach('${escHtml(m.idAlumno)}', '${escHtml(m.semanaISO)}')" class="shrink-0 min-h-[44px] px-4 rounded-xl bg-emerald-500 text-slate-950 text-sm font-extrabold inline-flex items-center gap-1.5">${ico('send', 'w-4 h-4')} Enviar</button></div>`}
        </article>`;
      }).join('') : `<div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center"><span class="inline-flex w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-300 items-center justify-center mb-2">${ico('circle-check', 'w-6 h-6')}</span><p class="text-sm font-bold text-white">${mensajesFiltro === 'PEND' ? 'No tienes check-ins sin responder' : 'Aún no hay check-ins'}</p><p class="text-xs text-slate-400 mt-1">Los check-ins semanales de tus alumnos aparecerán aquí.</p></div>`;
      cont.innerHTML = `
        <div class="hidden md:block"><h2 class="text-2xl font-black text-white">Mensajes</h2><p class="text-sm text-slate-400">Check-ins semanales de tus alumnos</p></div>
        <div class="flex p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md">${seg}</div>
        <div class="space-y-3 max-w-3xl">${tarjetas}</div>`;
    }
    const fechaCorta = f => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(f || '')); return m ? m[3] + '/' + m[2] : String(f || ''); };

    function responderMensajeCoach(idAlumno, semana) {
      const idInp = 'msgResp-' + idAlumno + '-' + semana;
      const inp = document.getElementById(idInp), btn = document.getElementById('btn-' + idInp);
      const texto = inp ? inp.value.trim() : '';
      if (!texto) { if (inp) inp.focus(); return mostrarToast('⚠️ Escribe tu respuesta antes de enviar.'); }
      if (btn) { btn.disabled = true; btn.classList.add('opacity-60'); }
      GS().withFailureHandler(() => { if (btn) { btn.disabled = false; btn.classList.remove('opacity-60'); } })
        .withSuccessHandler(res => {
          if (!res || !res.success) { if (btn) { btn.disabled = false; btn.classList.remove('opacity-60'); } return mostrarToast('❌ ' + ((res && res.error) || 'No se pudo responder.')); }
          mostrarToast('✅ ' + res.mensaje);
          const m = (panelCoach.mensajes || []).find(x => x.idAlumno === idAlumno && x.semanaISO === semana);
          if (m) { m.respuesta = texto; m.fechaRespuesta = fechaLocalISO(); }
          panelCoach.pendientes = panelCoach.pendientes.filter(p => !(p.tipo === 'CHECKIN' && p.idAlumno === idAlumno && p.semanaISO === semana));
          panelCoach.resumen.checkinsPendientes = panelCoach.pendientes.filter(p => p.tipo === 'CHECKIN').length;
          if (estadoGlobal.checkinsCoach && estadoGlobal.checkinsCoach.idAlumno === idAlumno) estadoGlobal.checkinsCoach.lista = res.checkins || estadoGlobal.checkinsCoach.lista;
          renderMensajesCoach(); renderHoyCoach(); actualizarBadgesCoach();
        }).responderCheckin(idAlumno, semana, texto);
    }

    function abrirEvaluacionPara(idAlumno) {
      evalPaso = 1;
      cambiarTabCoach('tabMedidasFotos');
      const sel = document.getElementById('selectAlumnoMedidas');
      if (sel && idAlumno) { sel.value = idAlumno; sel.dispatchEvent(new Event('change')); }
    }
    let evalPaso = 1;

    // ==================== v17 · EVALUACIÓN POR PASOS ====================
    // Mismos campos y validaciones de siempre (procesarYGuardarEvaluacion); solo se muestran por partes.
    const TOTAL_PASOS_EVAL = 5;
    function irPasoEvaluacion(n, silencioso) {
      n = Math.max(1, Math.min(TOTAL_PASOS_EVAL, Number(n) || 1));
      evalPaso = n;
      for (let i = 1; i <= TOTAL_PASOS_EVAL; i++) {
        const sec = document.getElementById('evalPaso-' + i);
        if (sec) sec.classList.toggle('hidden', i !== n);
        const b = document.getElementById('evalPasoBtn-' + i);
        if (!b) continue;
        const num = b.querySelector('.eval-num'), txt = b.querySelector('.eval-txt');
        const hecho = i < n, actual = i === n;
        num.className = 'eval-num w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ' +
          (actual ? 'bg-emerald-500 text-slate-950 border-emerald-500' : hecho ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50' : 'bg-slate-950 text-slate-400 border-slate-700');
        num.innerHTML = hecho ? ico('check', 'w-4 h-4') : String(i);
        txt.className = 'eval-txt text-[11px] font-bold ' + (actual ? 'text-emerald-300' : 'text-slate-400');
        if (actual) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      }
      const atras = document.getElementById('evalBtnAtras'), sig = document.getElementById('evalBtnSiguiente');
      if (atras) atras.classList.toggle('invisible', n === 1);
      if (sig) sig.classList.toggle('hidden', n === TOTAL_PASOS_EVAL);
      actualizarSubtituloEvaluacion();
      if (!silencioso) {
        const tab = document.getElementById('tabMedidasFotos');
        if (tab) tab.scrollIntoView({ behavior: modoScroll(), block: 'start' });
        const t = document.getElementById('evalTitulo-' + n); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
      }
    }
    function siguientePasoEvaluacion() {
      if (evalPaso === 1) {
        const alu = document.getElementById('selectAlumnoMedidas').value, fecha = document.getElementById('evFecha').value;
        if (!alu || !fecha) return avisar('Selecciona alumno y fecha.', 'atencion');
      }
      irPasoEvaluacion(evalPaso + 1);
    }
    function actualizarSubtituloEvaluacion() {
      const el = document.getElementById('evalSubtitulo'); if (!el) return;
      const sel = document.getElementById('selectAlumnoMedidas');
      const a = sel && alumnoPorId(sel.value);
      const f = (document.getElementById('evFecha') || {}).value || '';
      el.textContent = (a ? nombreCortoCoach(a.nombre) : 'Elige un alumno') + (f ? ' · ' + f.split('-').reverse().join('/') : '');
    }
    document.addEventListener('change', e => { if (e.target && (e.target.id === 'selectAlumnoMedidas' || e.target.id === 'evFecha')) actualizarSubtituloEvaluacion(); });

    // ==================== v18 · CAMBIAR NIVEL DESDE LA FICHA DEL ALUMNO ====================
    const NIVELES = [
      ['NIVEL I: PRINCIPIANTE', 'Nivel I', 'Principiante', 'Aprende la técnica, cargas moderadas'],
      ['NIVEL II: INTERMEDIO', 'Nivel II', 'Intermedio', 'Progresión de cargas y volumen'],
      ['NIVEL III: AVANZADO', 'Nivel III', 'Avanzado', 'Técnicas de intensidad y mayor volumen']
    ];
    /** Índice del nivel guardado (acepta «NIVEL II: INTERMEDIO», «NIVEL II» o «INTERMEDIO»); -1 si no coincide. */
    function indiceNivel(nivel) {
      const t = String(nivel || '').toUpperCase();
      const m = t.match(/NIVEL\s+(I{1,3})\b/);
      if (m) return m[1].length - 1;
      return NIVELES.findIndex(n => t.includes(n[2].toUpperCase()));
    }
    function textoNivel(nivel) {
      const i = indiceNivel(nivel);
      return i >= 0 ? NIVELES[i][1] + ' · ' + NIVELES[i][2] : (String(nivel || '').trim() || 'Sin nivel');
    }
    /** «Nivel II» en el celular y «Nivel II · Intermedio» en pantallas más anchas. */
    function htmlNivelCorto(nivel) {
      const i = indiceNivel(nivel);
      return i >= 0 ? escHtml(NIVELES[i][1]) + '<span class="hidden sm:inline"> · ' + escHtml(NIVELES[i][2]) + '</span>' : escHtml(textoNivel(nivel));
    }
    let nivelEdicion = { id: '', sel: -1 };
    function abrirCambioNivel(idAlumno) {
      const a = alumnoPorId(idAlumno); if (!a) return;
      nivelEdicion = { id: idAlumno, sel: indiceNivel(a.nivel), actual: indiceNivel(a.nivel) };
      document.getElementById('subHojaNivel').textContent = nombreCortoCoach(a.nombre) + ' · su app lo mostrará la próxima vez que se actualice';
      pintarOpcionesNivel();
      document.getElementById('hojaNivelCoach').classList.remove('hidden');
      const sel = document.querySelector('#opcionesNivel [aria-checked="true"]') || document.querySelector('#opcionesNivel button');
      if (sel) sel.focus();
    }
    function pintarOpcionesNivel() {
      const { sel, actual } = nivelEdicion;
      document.getElementById('opcionesNivel').innerHTML = NIVELES.map((n, i) => `
        <button type="button" role="radio" aria-checked="${i === sel}" onclick="nivelEdicion.sel = ${i}; pintarOpcionesNivel()"
          class="w-full flex items-center gap-3 p-3.5 min-h-[64px] rounded-2xl border-2 text-left transition ${i === sel ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}">
          <span class="w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${i === sel ? 'border-emerald-500' : 'border-slate-600'}">${i === sel ? '<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>' : ''}</span>
          <span class="flex-1 min-w-0"><span class="block text-[15px] font-extrabold text-white">${n[1]} · ${n[2]}</span><span class="block text-xs text-slate-400">${n[3]}</span></span>
          ${i === actual ? '<span class="shrink-0 bg-slate-800 text-slate-300 text-[11px] font-extrabold px-2 py-1 rounded-full">Actual</span>' : ''}
        </button>`).join('');
      const b = document.getElementById('btnGuardarNivel');
      b.disabled = sel < 0 || sel === actual;
      b.textContent = sel >= 0 && sel !== actual ? 'Guardar ' + NIVELES[sel][1] : 'Guardar nivel';
    }
    function cerrarCambioNivel() { document.getElementById('hojaNivelCoach').classList.add('hidden'); }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !document.getElementById('hojaNivelCoach').classList.contains('hidden')) cerrarCambioNivel();
    });
    function guardarCambioNivel() {
      const { id, sel } = nivelEdicion;
      if (!id || sel < 0) return;
      const nivel = NIVELES[sel][0], b = document.getElementById('btnGuardarNivel');
      b.disabled = true; b.textContent = 'Guardando…';
      GS()
        .withFailureHandler(err => { pintarOpcionesNivel(); avisar((err && err.message) || 'No se pudo guardar el nivel.', 'error'); })
        .withSuccessHandler(res => {
          if (!res || !res.success) { pintarOpcionesNivel(); return avisar((res && res.error) || 'No se pudo guardar el nivel.', 'error'); }
          const a = alumnoPorId(id); if (a) a.nivel = nivel;
          // También en la copia guardada en el teléfono, para que al reabrir ya se vea el nivel nuevo
          try { const c = leerCacheSesion(); if (c && Array.isArray(c.alumnos)) { const x = c.alumnos.find(z => z.id === id); if (x) { x.nivel = nivel; LS.set(CLAVE_CACHE_SESION, JSON.stringify(c)); } } } catch (e) {}
          cerrarCambioNivel();
          actualizarSelectoresAlumnos();
          const chip = document.getElementById('chipNivel-' + id);
          if (chip) chip.querySelector('span').innerHTML = htmlNivelCorto(nivel);
          mostrarToast('✅ Nivel actualizado: ' + NIVELES[sel][1] + ' · ' + NIVELES[sel][2]);
        })
        .actualizarNivelAlumno(id, nivel);
    }

    // ==================== v18 · AVANCE DEL ALUMNO EN VIVO (ficha del coach) ====================
    // Mientras la ficha está abierta y visible, pregunta cada 20 s qué series marcó hoy el alumno.
    // No es instantáneo al segundo (Apps Script no permite conexión en tiempo real): el retraso típico es 10–30 s.
    const SEG_VIVO_COACH = 20;
    let vivoCoach = { id: '', rutina: [], reloj: null, datos: null };
    function iniciarVivoCoach(idAlumno, rutina) {
      detenerVivoCoach();
      vivoCoach = { id: idAlumno, rutina: rutina || [], reloj: null, datos: null };
      consultarVivoCoach();
      vivoCoach.reloj = setInterval(consultarVivoCoach, SEG_VIVO_COACH * 1000);
    }
    function detenerVivoCoach() { if (vivoCoach.reloj) clearInterval(vivoCoach.reloj); vivoCoach.reloj = null; }
    function consultarVivoCoach() {
      const id = vivoCoach.id;
      const tab = document.getElementById('tabComparativaCoach');
      if (!id || document.hidden || !tab || tab.classList.contains('hidden') || !document.getElementById('vivoCoach')) return;
      GS().withFailureHandler(() => {})
        .withSuccessHandler(res => {
          if (!res || !res.success || vivoCoach.id !== id) return;
          vivoCoach.datos = res;
          renderVivoCoach();
        })
        .obtenerEnVivoAlumno(id);
    }
    const horaCorta = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleTimeString('es-PE', { hour: 'numeric', minute: '2-digit' }); };
    function renderVivoCoach() {
      const cont = document.getElementById('vivoCoach'); if (!cont) return;
      const r = vivoCoach.datos, v = r && r.vivo;
      if (!v || !Array.isArray(v.e) || !v.e.length) { cont.innerHTML = ''; return; }
      const diaN = normalizarDia(v.d);
      const ejs = vivoCoach.rutina.filter(x => normalizarDia(x.dia) === diaN);
      const bases = basesEjerciciosDia(ejs);
      const porBase = {}; v.e.forEach(x => { porBase[x.b] = x; });
      let hechos = 0, seriesHechas = 0, seriesTotal = 0;
      const filas = ejs.map((ej, i) => {
        const total = Math.max(1, parseInt(ej.serie, 10) || 1);
        const m = porBase[bases[i]] || { s: [], kg: [], ok: false };
        const n = Math.min(total, m.s.length);
        const ok = m.ok || n >= total;
        seriesTotal += total; seriesHechas += ok ? total : n; if (ok) hechos++;
        const kg = m.kg.filter(k => k).slice(-1)[0];
        const estado = ok ? 'ok' : n ? 'ahora' : 'pend';
        const icono = estado === 'ok'
          ? `<span class="w-7 h-7 shrink-0 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">${ico('check', 'w-4 h-4')}</span>`
          : estado === 'ahora'
            ? '<span class="w-7 h-7 shrink-0 rounded-full border-[3px] border-amber-400 flex items-center justify-center"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span></span>'
            : '<span class="w-7 h-7 shrink-0 rounded-full border-2 border-slate-700"></span>';
        const detalle = estado === 'ok' ? `${total}/${total} series${kg ? ' · ' + escHtml(kg) + ' kg' : ''}`
          : estado === 'ahora' ? `En curso · ${n} de ${total} series${kg ? ' · ' + escHtml(kg) + ' kg' : ''}` : `${total} series · pendiente`;
        return `<li class="flex items-center gap-3 py-2.5 border-t border-slate-800">${icono}
          <div class="min-w-0"><p class="text-sm font-extrabold truncate ${estado === 'ahora' ? 'text-amber-300' : estado === 'ok' ? 'text-white' : 'text-slate-400'}">${escHtml(ej.ejercicio)}</p>
          <p class="text-xs text-slate-400">${detalle}</p></div></li>`;
      }).join('');
      const pct = seriesTotal ? Math.round(seriesHechas / seriesTotal * 100) : 0;
      const punto = r.enLinea
        ? '<span class="relative flex w-2.5 h-2.5"><span class="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-60 animate-ping motion-reduce:animate-none"></span><span class="relative inline-flex w-2.5 h-2.5 rounded-full bg-rose-500"></span></span>'
        : '<span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span>';
      cont.innerHTML = `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div class="flex items-center justify-between gap-2">
            <p class="flex items-center gap-2 text-sm font-black text-white">${punto}${r.enLinea ? 'EN VIVO' : 'HOY'} · ${escHtml(v.d || '')}</p>
            <span class="text-[11px] text-slate-400">última marca ${escHtml(horaCorta(v.t))}</span>
          </div>
          <div class="flex items-end justify-between mt-3 mb-2">
            <p><span class="text-3xl font-black text-emerald-400">${hechos}</span><span class="text-sm font-bold text-slate-400"> de ${ejs.length || v.e.length} ejercicios</span></p>
            <p class="text-xs text-slate-400 text-right">${seriesHechas} de ${seriesTotal} series</p>
          </div>
          <div class="h-2 rounded-full bg-slate-800 overflow-hidden" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Avance de hoy"><div class="h-full bg-emerald-500 rounded-full" style="width:${pct}%"></div></div>
          <ul class="mt-2">${filas || '<li class="text-xs text-slate-400 py-2">Marcó series de un ejercicio que ya no está en su rutina.</li>'}</ul>
          <p class="text-[11px] text-slate-500 mt-1">Se actualiza solo cada ${SEG_VIVO_COACH} s mientras tienes abierta esta ficha.</p>
        </div>`;
    }

    // ==================== v19 · RESUMEN DE LA FICHA (propuesta del entrenador) ====================
    // En 5 segundos: si entrenó, si levantó más, cómo salió su última evaluación, cuándo toca la siguiente
    // y qué decirle hoy. Todo se calcula con lo que la app ya guarda; la alerta y la bitácora son del coach.
    const DIAS_ENTRE_EVALUACIONES = 28, DIAS_AVISO_ENTRENO = 4, DIAS_ALERTA_ENTRENO = 7;
    const DIA_MS = 86400000;
    const fechaUTC = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN; };
    const diasDesdeFecha = iso => { const t = fechaUTC(iso); return isNaN(t) ? null : Math.round((fechaUTC(fechaLocalISO()) - t) / DIA_MS); };
    const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const fechaLarga = iso => { const t = fechaUTC(iso); if (isNaN(t)) return ''; const d = new Date(t); return d.getUTCDate() + ' ' + MESES_CORTOS[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); };
    const haceDias = n => n === 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días';
    function lunesSemanaISO(semISO) {
      const m = /^(\d{4})-W(\d{2})$/.exec(String(semISO || '')); if (!m) return NaN;
      const ene4 = Date.UTC(+m[1], 0, 4), dow = (new Date(ene4).getUTCDay() + 6) % 7;
      return ene4 - dow * DIA_MS + (+m[2] - 1) * 7 * DIA_MS;
    }
    const num1 = v => { const n = parseFloat(String(v === undefined || v === null ? '' : v).replace(',', '.')); return isNaN(n) ? null : n; };
    const conSigno = (n, dec = 1) => (n > 0 ? '+' : n < 0 ? '−' : '±') + Math.abs(n).toFixed(dec);
    const PLIEGUES = ['subescapular', 'tricipital', 'bicipital', 'supracrestal', 'suprailiaca', 'abdominal'];

    /** Datos del resumen (separados del dibujo para poder probarlos). */
    function datosResumenFicha(idAlumno) {
      const rutina = estadoGlobal.rutinaActual || [], semanas = (estadoGlobal.semanas || []).slice().sort((a, b) => a.semanaISO < b.semanaISO ? -1 : 1);
      const hoyISO = fechaLocalISO(), semAct = infoSemana(hoyISO).semanaISO;
      const diasProg = DIAS_SEMANA.filter(d => rutina.some(r => normalizarDia(r.dia) === normalizarDia(d)));
      const ejsDia = d => rutina.filter(r => normalizarDia(r.dia) === normalizarDia(d));
      const avanceDia = (g, d) => {      // series hechas / programadas de un día de la rutina en una semana
        const ejs = ejsDia(d), bases = basesEjerciciosDia(ejs);
        let hechas = 0, total = 0, ejHechos = 0;
        ejs.forEach((r, i) => {
          const n = Math.max(1, cuantasSeries(r)), o = g[normalizarDia(d) + '|' + bases[i]];
          total += n;
          if (ejercicioHecho(o)) { hechas += n; ejHechos++; }
          else if (o) hechas += Math.min(n, Object.keys(o.seriesOk || {}).length);
        });
        return { hechas, total, ejHechos, ejTotal: ejs.length, completo: ejs.length > 0 && ejHechos === ejs.length };
      };

      // 1) Adherencia: días de la rutina COMPLETOS esta semana / días programados
      const semActual = semanas.find(x => x.semanaISO === semAct);
      const gAct = agruparSemana(semActual);
      const completas = diasProg.filter(d => avanceDia(gAct, d).completo).length;
      const ordenHoy = (new Date(fechaUTC(hoyISO)).getUTCDay() + 6) % 7;
      const hastaHoy = diasProg.filter(d => DIAS_SEMANA.findIndex(x => normalizarDia(x) === normalizarDia(d)) <= ordenHoy).length;
      const adherencia = { hechas: completas, programadas: diasProg.length, hastaHoy,
        pct: diasProg.length ? Math.round(completas / diasProg.length * 100) : 0 };

      // 2) y 3) Evaluaciones
      const evals = (estadoGlobal.progresoActual || []).filter(e => e && (num1(e.peso) || num1(e.grasaCorporal) || num1(e.cintura)))
        .slice().sort((a, b) => String(a.fecha) < String(b.fecha) ? -1 : 1);
      const ult = evals[evals.length - 1] || null, ant = evals[evals.length - 2] || null;
      const magraDe = e => { if (!e) return null; const m = num1(e.masaCorporal); if (m) return m; const p = num1(e.peso), g = num1(e.grasaCorporal); return p && g !== null ? p * (1 - g / 100) : null; };
      const tienePliegues = e => !!e && PLIEGUES.some(k => (num1(e[k]) || 0) > 0);
      let composicion = null;
      if (ult && tienePliegues(ult) && num1(ult.grasaCorporal) !== null) {
        const previa = evals.slice(0, -1).reverse().find(e => tienePliegues(e) && num1(e.grasaCorporal) !== null);
        composicion = { tipo: 'GRASA', valor: num1(ult.grasaCorporal), delta: previa ? num1(ult.grasaCorporal) - num1(previa.grasaCorporal) : null };
      } else if (ult && num1(ult.cintura)) {
        const previa = evals.slice(0, -1).reverse().find(e => num1(e.cintura));
        composicion = { tipo: 'CINTURA', valor: num1(ult.cintura), delta: previa ? num1(ult.cintura) - num1(previa.cintura) : null };
      }
      const peso = ult && num1(ult.peso) ? { valor: num1(ult.peso), magra: magraDe(ult), deltaMagra: ant && magraDe(ant) !== null && magraDe(ult) !== null ? magraDe(ult) - magraDe(ant) : null } : null;
      const diasEval = ult ? diasDesdeFecha(ult.fecha) : null;
      const evaluacion = ult ? { fecha: ult.fecha, dias: diasEval, faltan: diasEval === null ? null : DIAS_ENTRE_EVALUACIONES - diasEval } : null;

      // 4) Fuerza: mejor peso por ejercicio en las últimas 4 semanas vs. las 4 anteriores, y récords del mes
      const hoyT = fechaUTC(hoyISO), inicioMes = Date.UTC(new Date(hoyT).getUTCFullYear(), new Date(hoyT).getUTCMonth(), 1);
      const porEj = {};
      semanas.forEach(sm => {
        const t = lunesSemanaISO(sm.semanaISO), g = agruparSemana(sm);
        Object.keys(g).forEach(k => {
          const v = valorNumerico(g[k]); if (!v) return;
          const b = g[k].base.replace(/~\d+$/, '');
          (porEj[b] = porEj[b] || []).push({ t, v });
        });
      });
      const cambios = [];
      let prsMes = 0;
      Object.keys(porEj).forEach(b => {
        const l = porEj[b];
        const max = f => l.filter(f).reduce((m, x) => Math.max(m, x.v), 0);
        const reciente = max(x => x.t > hoyT - 28 * DIA_MS), previo = max(x => x.t <= hoyT - 28 * DIA_MS && x.t > hoyT - 56 * DIA_MS);
        if (reciente && previo) cambios.push((reciente / previo - 1) * 100);
        const mes = max(x => x.t + 6 * DIA_MS >= inicioMes), antes = max(x => x.t + 6 * DIA_MS < inicioMes);
        if (mes && antes && mes > antes) prsMes++;
      });
      const fuerza = { pct: cambios.length ? cambios.reduce((a, b) => a + b, 0) / cambios.length : null, ejercicios: cambios.length, prsMes };

      // Último entrenamiento: fecha guardada por la app al marcar (v19) o la última actividad registrada
      let ultima = null;
      semanas.slice(-3).forEach(sm => {
        const g = agruparSemana(sm);
        (sm.registros || []).forEach(r => {
          if (r.clave !== '_SESION::fecha' || !r.valor) return;
          if (!ultima || r.valor > ultima.fecha) {
            const min = (sm.registros || []).find(x => x.clave === '_SESION::min' && normalizarDia(x.dia) === normalizarDia(r.dia));
            ultima = Object.assign({ fecha: r.valor, dia: r.dia, minutos: min ? num1(min.valor) : null }, avanceDia(g, r.dia));
          }
        });
      });
      const act = (panelCoach && panelCoach.estado && panelCoach.estado[idAlumno]) || {};
      if (act.ultimoEntreno && (!ultima || act.ultimoEntreno > ultima.fecha)) ultima = { fecha: act.ultimoEntreno };
      if (ultima) {
        ultima.dias = diasDesdeFecha(ultima.fecha);
        if (ultima.dia) ultima.grupos = Array.from(new Set(ejsDia(ultima.dia).map(r => String(r.musculo || '').trim()).filter(Boolean))).slice(0, 3);
      }

      // Check-in de esta semana
      const checkins = (estadoGlobal.checkinsCoach && estadoGlobal.checkinsCoach.lista) || [];
      const checkin = checkins.find(c => c.semanaISO === semAct) || null;

      // Sugerencias para la alerta física
      const malo = t => !t || /^(no|ninguna?|nada|sin\b.*|-|n\/a)$/i.test(String(t).trim());
      const sugerencias = [];
      if (ult) ['lesion', 'limitacion'].forEach(k => { if (!malo(ult[k])) sugerencias.push(String(ult[k]).trim()); });
      const ultCk = checkins[0];
      if (ultCk && !malo(ultCk.molestias)) sugerencias.push(String(ultCk.molestias).trim());

      return { adherencia, peso, composicion, fuerza, ultima, evaluacion, checkin, ultCheckin: ultCk || null,
        sugerencias: Array.from(new Set(sugerencias)).slice(0, 3), notas: estadoGlobal.notasCoach || {} };
    }

    function htmlResumenFicha(idAlumno) {
      const d = datosResumenFicha(idAlumno), id = escHtml(idAlumno);
      const tarjeta = (etiqueta, valor, sub, tono) => `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 min-w-0">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-tight">${etiqueta}</p>
          <p class="text-xl sm:text-2xl font-black mt-1 ${valor === '—' ? 'text-slate-500' : 'text-white'} truncate">${valor}</p>
          <p class="text-xs mt-0.5 ${tono === 'bien' ? 'text-emerald-300' : tono === 'mal' ? 'text-rose-300' : tono === 'ojo' ? 'text-amber-300' : 'text-slate-400'}">${sub}</p>
        </div>`;
      const a = d.adherencia;
      const kAdh = a.programadas
        ? tarjeta('Adherencia semanal', `${a.hechas} / ${a.programadas} <span class="text-sm font-bold text-slate-400">sesiones</span>`,
            `${a.pct}% esta semana${a.hechas < a.hastaHoy ? ` · le faltan ${a.hastaHoy - a.hechas} hasta hoy` : ''}`, a.hechas >= a.hastaHoy ? 'bien' : 'ojo')
        : tarjeta('Adherencia semanal', '—', 'Sin rutina asignada');
      const p = d.peso;
      const kPeso = p ? tarjeta('Peso y masa magra', `${p.valor.toFixed(1)} kg`,
            p.deltaMagra !== null ? `Magra: ${conSigno(p.deltaMagra)} kg vs. eval. anterior` : (p.magra ? `Magra: ${p.magra.toFixed(1)} kg` : 'Primera evaluación'),
            p.deltaMagra === null ? '' : p.deltaMagra >= 0 ? 'bien' : 'mal')
        : tarjeta('Peso y masa magra', '—', 'Sin evaluaciones');
      const c = d.composicion;
      const kComp = !c ? tarjeta('% Grasa corporal', '—', 'Sin pliegues ni cintura')
        : c.tipo === 'GRASA'
          ? tarjeta('% Grasa corporal', `${c.valor.toFixed(1)}%`, c.delta === null ? 'Primera medición' : `${conSigno(c.delta)}% vs. eval. anterior`, c.delta === null ? '' : c.delta <= 0 ? 'bien' : 'mal')
          : tarjeta('Cintura <span class="normal-case font-semibold">(sin plicómetro)</span>', `${c.valor.toFixed(1)} cm`, c.delta === null ? 'Primera medición' : `${conSigno(c.delta)} cm vs. eval. anterior`, c.delta === null ? '' : c.delta <= 0 ? 'bien' : 'mal');
      const f = d.fuerza;
      const prs = f.prsMes ? `${f.prsMes} ${f.prsMes === 1 ? 'nuevo récord' : 'nuevos récords'} este mes` : '';
      const kFza = f.pct !== null
        ? tarjeta('Progresión de fuerza', `${conSigno(f.pct)}%`, `en cargas (4 sem.)${prs ? ' · ' + prs : ''}`, f.pct >= 0 ? 'bien' : 'mal')
        : f.prsMes ? tarjeta('Progresión de fuerza', `${f.prsMes} PR${f.prsMes === 1 ? '' : 's'}`, 'nuevos este mes', 'bien')
        : tarjeta('Progresión de fuerza', '—', 'Aún no hay semanas para comparar');

      // Último entrenamiento
      const u = d.ultima;
      const tonoU = !u || u.dias === null ? 'ojo' : u.dias >= DIAS_ALERTA_ENTRENO ? 'mal' : u.dias >= DIAS_AVISO_ENTRENO ? 'ojo' : 'bien';
      const bordeU = tonoU === 'mal' ? 'border-rose-500/60' : tonoU === 'ojo' ? 'border-amber-400/60' : 'border-slate-800';
      const bloqueEntreno = `
        <section class="bg-slate-900 border-2 ${bordeU} rounded-2xl p-4" aria-labelledby="tUltEnt-${id}">
          <div class="flex items-center justify-between gap-2">
            <h4 id="tUltEnt-${id}" class="text-sm font-extrabold text-white inline-flex items-center gap-2">${ico('dumbbell', 'w-4 h-4 text-emerald-400')} Último entrenamiento</h4>
            <button type="button" onclick="cambiarSubTabExpediente('expRutina')" class="text-xs font-bold text-emerald-300 min-h-[32px]">Ver rutina</button>
          </div>
          ${!u ? `<p class="mt-3 text-sm text-amber-300 font-bold">Sin entrenamientos registrados</p>` : `
            <p class="mt-3 text-lg font-black text-white">${escHtml(haceDias(u.dias).replace(/^./, x => x.toUpperCase()))}${u.dia ? ` <span class="text-slate-400 font-bold">— ${escHtml(nombreDia(u.dia))}${u.grupos && u.grupos.length ? ': ' + escHtml(u.grupos.join(', ').toLowerCase()) : ''}</span>` : ''}</p>
            <p class="text-xs text-slate-400">${escHtml(fechaLarga(u.fecha))}</p>
            ${u.total ? `<div class="mt-3">
              <div class="flex items-end justify-between text-sm"><span class="font-black text-white">${u.hechas} / ${u.total} <span class="text-slate-400 font-bold">series</span></span><span class="text-xs text-slate-400">${u.ejHechos} de ${u.ejTotal} ejercicios</span></div>
              <div class="h-2 rounded-full bg-slate-800 mt-1.5 overflow-hidden"><div class="h-full rounded-full ${u.completo ? 'bg-emerald-500' : 'bg-amber-400'}" style="width:${Math.round(u.hechas / u.total * 100)}%"></div></div>
            </div>` : ''}
            ${u.minutos ? `<p class="mt-2 text-xs text-slate-300 inline-flex items-center gap-1.5">${ico('timer', 'w-4 h-4')} Duración: ${u.minutos} min (modo guiado)</p>` : ''}`}
          ${tonoU === 'mal' || tonoU === 'ojo' ? `<p class="mt-3 text-xs font-bold ${tonoU === 'mal' ? 'text-rose-300' : 'text-amber-300'} inline-flex items-center gap-1.5">${ico('triangle-alert', 'w-4 h-4')} ${u && u.dias !== null ? `Lleva ${u.dias} días sin entrenar` : 'Aún no entrena con la app'}</p>` : ''}
        </section>`;

      // Evaluación y check-in
      const e = d.evaluacion, ck = d.checkin;
      const tonoE = !e ? 'ojo' : e.faltan < 0 ? 'mal' : e.faltan <= 3 ? 'ojo' : 'bien';
      const textoE = !e ? 'Aún no tiene evaluación' : e.faltan < 0 ? `Vencida hace ${-e.faltan} día${e.faltan === -1 ? '' : 's'}` : e.faltan === 0 ? 'Toca hoy' : `Toca en ${e.faltan} día${e.faltan === 1 ? '' : 's'}`;
      const a2 = alumnoPorId(idAlumno) || {};
      const bloqueEval = `
        <section class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4" aria-labelledby="tEval-${id}">
          <div>
            <h4 id="tEval-${id}" class="text-sm font-extrabold text-white inline-flex items-center gap-2">${ico('clipboard-pen', 'w-4 h-4 text-emerald-400')} Evaluación</h4>
            <div class="mt-2 flex items-end justify-between gap-2">
              <div><p class="text-xs text-slate-400">Última</p><p class="text-sm font-black text-white">${e ? escHtml(fechaLarga(e.fecha)) + ` <span class="text-slate-400 font-bold">· ${escHtml(haceDias(e.dias))}</span>` : '—'}</p></div>
              <span class="shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-full border ${tonoE === 'mal' ? 'bg-rose-500/15 text-rose-300 border-rose-500/40' : tonoE === 'ojo' ? 'bg-amber-500/15 text-amber-300 border-amber-500/40' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'}">${textoE}</span>
            </div>
            ${tonoE !== 'bien' ? `<button type="button" onclick="abrirEvaluacionPara('${id}')" class="mt-3 w-full min-h-[44px] rounded-xl bg-emerald-500 text-slate-950 text-sm font-extrabold">Evaluar ahora</button>` : ''}
          </div>
          <div class="pt-4 border-t border-slate-800">
            <h4 class="text-sm font-extrabold text-white inline-flex items-center gap-2">${ico('calendar-check', 'w-4 h-4 text-emerald-400')} Check-in de la semana</h4>
            ${ck ? `
              <p class="mt-2 text-sm font-bold text-emerald-300 inline-flex items-center gap-1.5">${ico('circle-check', 'w-4 h-4')} Recibido${ck.fecha ? ' · ' + escHtml(fechaLarga(ck.fecha)) : ''}</p>
              <p class="text-xs text-slate-400 mt-1">${[ck.peso ? 'Peso ' + escHtml(ck.peso) + ' kg' : '', ck.energia ? 'Energía ' + escHtml(ck.energia) : '', ck.sueno ? 'Sueño ' + escHtml(ck.sueno) : ''].filter(Boolean).join(' · ')}</p>
              ${!ck.respuesta ? `<button type="button" onclick="cambiarSubTabExpediente('expComunicacion')" class="mt-3 w-full min-h-[44px] rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 text-sm font-extrabold">Responder check-in</button>` : '<p class="text-xs text-slate-500 mt-1">Ya lo respondiste</p>'}`
            : `
              <p class="mt-2 text-sm font-bold text-amber-300 inline-flex items-center gap-1.5">${ico('clock', 'w-4 h-4')} Pendiente esta semana</p>
              <button type="button" onclick="${telWhatsApp(a2.whatsapp) ? `abrirWhatsApp('${escHtml(a2.whatsapp)}', textoRecordatorioCheckin('${id}'))` : `pedirWhatsApp('${id}')`}" class="mt-3 w-full min-h-[44px] rounded-xl bg-emerald-500 text-slate-950 text-sm font-extrabold inline-flex items-center justify-center gap-2">${ico('message-circle', 'w-4 h-4')} ${telWhatsApp(a2.whatsapp) ? 'Recordar por WhatsApp' : 'Agregar WhatsApp para recordarle'}</button>`}
          </div>
        </section>`;

      return `
        <div class="grid grid-cols-2 2xl:grid-cols-4 gap-2.5">${kAdh}${kPeso}${kComp}${kFza}</div>
        <div class="grid md:grid-cols-2 gap-3 mt-3">${bloqueEntreno}${bloqueEval}</div>
        <div class="mt-3" id="bloqueNotasCoach">${htmlNotasCoach(idAlumno, d)}</div>`;
    }

    function textoRecordatorioCheckin(idAlumno) {
      const a = alumnoPorId(idAlumno) || {};
      return `Hola ${primerNombreDe(a.nombre)} 👋 Te recuerdo enviar tu check-in de esta semana desde la app (peso, energía, sueño y molestias). ¡Me ayuda a ajustar tu plan! 💪`;
    }

    // ---- Alerta física y bitácora (solo el coach) ----
    let editandoAlerta = false;
    function htmlNotasCoach(idAlumno, d) {
      d = d || datosResumenFicha(idAlumno);
      const n = d.notas || {}, id = escHtml(idAlumno);
      const etiqueta = n.alerta
        ? `<span class="inline-flex items-center gap-2 max-w-full bg-amber-500/15 text-amber-200 border border-amber-500/50 rounded-full px-3 py-1.5 text-sm font-extrabold">${ico('triangle-alert', 'w-4 h-4 shrink-0')}<span class="truncate">${escHtml(n.alerta)}</span></span>`
        : `<span class="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 rounded-full px-3 py-1.5 text-sm font-extrabold">${ico('shield', 'w-4 h-4')} Sin molestias registradas</span>`;
      const aviso = d.ultCheckin && d.ultCheckin.molestias && d.sugerencias.indexOf(String(d.ultCheckin.molestias).trim()) >= 0 && n.alerta !== String(d.ultCheckin.molestias).trim()
        ? `<p class="mt-2 text-xs text-slate-300">${ico('info', 'w-3.5 h-3.5')} Último check-in: «${escHtml(d.ultCheckin.molestias)}»</p>` : '';
      const editor = editandoAlerta ? `
        <div class="mt-3 space-y-2">
          <label for="inpAlerta-${id}" class="block text-xs font-bold text-slate-400">Alerta física o lesión activa</label>
          <input id="inpAlerta-${id}" type="text" maxlength="120" value="${escHtml(n.alerta || '')}" placeholder="Ej. Cuidado lumbar en peso muerto" class="w-full min-h-[44px] px-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white">
          ${d.sugerencias.length ? `<div class="flex flex-wrap gap-2">${d.sugerencias.map(t => `<button type="button" onclick="document.getElementById('inpAlerta-${id}').value = this.dataset.t" data-t="${escHtml(t)}" class="min-h-[36px] px-3 rounded-full bg-slate-800 text-slate-200 text-xs font-bold max-w-full truncate">Usar: ${escHtml(t)}</button>`).join('')}</div>` : ''}
          <div class="flex flex-wrap gap-2">
            <button type="button" onclick="guardarAlertaCoach('${id}')" class="min-h-[44px] px-4 rounded-xl bg-emerald-500 text-slate-950 text-sm font-extrabold">Guardar alerta</button>
            ${n.alerta ? `<button type="button" onclick="guardarAlertaCoach('${id}', '')" class="min-h-[44px] px-4 rounded-xl bg-slate-800 text-slate-200 text-sm font-bold">Quitar (sin molestias)</button>` : ''}
            <button type="button" onclick="editandoAlerta = false; refrescarNotasCoach('${id}')" class="min-h-[44px] px-4 rounded-xl text-slate-400 text-sm font-bold">Cancelar</button>
          </div>
        </div>` : '';
      return `
        <div class="grid md:grid-cols-2 gap-3">
          <section class="bg-slate-900 border border-slate-800 rounded-2xl p-4" aria-labelledby="tAlerta-${id}">
            <div class="flex items-center justify-between gap-2">
              <h4 id="tAlerta-${id}" class="text-sm font-extrabold text-white inline-flex items-center gap-2">${ico('bandage', 'w-4 h-4 text-emerald-400')} Alertas físicas</h4>
              ${editandoAlerta ? '' : `<button type="button" onclick="editandoAlerta = true; refrescarNotasCoach('${id}')" class="text-xs font-bold text-emerald-300 min-h-[32px] inline-flex items-center gap-1">${ico('pencil', 'w-3.5 h-3.5')} Editar</button>`}
            </div>
            <div class="mt-3">${etiqueta}</div>
            ${n.alerta && n.fechaAlerta ? `<p class="mt-1.5 text-[11px] text-slate-500">Desde el ${escHtml(fechaLarga(n.fechaAlerta))}</p>` : ''}
            ${aviso}${editor}
          </section>
          <section class="bg-slate-900 border border-slate-800 rounded-2xl p-4" aria-labelledby="tBitacora-${id}">
            <h4 id="tBitacora-${id}" class="text-sm font-extrabold text-white inline-flex items-center gap-2">${ico('notebook-pen', 'w-4 h-4 text-emerald-400')} Bitácora del coach</h4>
            <label for="txtNota-${id}" class="sr-only">Próximo ajuste para el alumno</label>
            <textarea id="txtNota-${id}" rows="3" maxlength="600" placeholder="Próximo ajuste: subir 2,5 kg en press inclinado, revisar técnica de sentadilla hack…" class="mt-3 w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white resize-y">${escHtml(n.nota || '')}</textarea>
            <div class="flex items-center justify-between gap-2 mt-2">
              <span class="text-[11px] text-slate-500">${n.fechaNota ? 'Guardada el ' + escHtml(fechaLarga(n.fechaNota)) : 'Solo la ves tú'}</span>
              <button type="button" id="btnNota-${id}" onclick="guardarNotaCoach('${id}')" class="min-h-[44px] px-4 rounded-xl bg-emerald-500 text-slate-950 text-sm font-extrabold">Guardar nota</button>
            </div>
          </section>
        </div>`;
    }
    function refrescarNotasCoach(idAlumno) {
      const c = document.getElementById('bloqueNotasCoach'); if (c) c.innerHTML = htmlNotasCoach(idAlumno);
      const inp = document.getElementById('inpAlerta-' + idAlumno); if (inp) inp.focus();
    }
    function enviarNotasCoach(idAlumno, cambios, alTerminar) {
      GS().withFailureHandler(err => { alTerminar(false); avisar((err && err.message) || 'No se pudo guardar.', 'error'); })
        .withSuccessHandler(res => {
          if (!res || !res.success) { alTerminar(false); return avisar((res && res.error) || 'No se pudo guardar.', 'error'); }
          if (estadoGlobal.notasCoach && estadoGlobal.notasCoach.idAlumno === idAlumno) Object.assign(estadoGlobal.notasCoach, res.notas);
          alTerminar(true);
        })
        .guardarNotasCoach(Object.assign({ idAlumno }, cambios));
    }
    function guardarAlertaCoach(idAlumno, valor) {
      const inp = document.getElementById('inpAlerta-' + idAlumno);
      const alerta = valor !== undefined ? valor : (inp ? inp.value.trim() : '');
      enviarNotasCoach(idAlumno, { alerta }, ok => {
        if (!ok) return;
        editandoAlerta = false; refrescarNotasCoach(idAlumno);
        mostrarToast(alerta ? '✅ Alerta guardada' : '✅ Marcado sin molestias');
      });
    }
    function guardarNotaCoach(idAlumno) {
      const t = document.getElementById('txtNota-' + idAlumno), b = document.getElementById('btnNota-' + idAlumno);
      if (!t) return;
      if (b) { b.disabled = true; b.textContent = 'Guardando…'; }
      enviarNotasCoach(idAlumno, { nota: t.value.trim() }, ok => {
        if (b) { b.disabled = false; b.textContent = 'Guardar nota'; }
        if (!ok) return;
        refrescarNotasCoach(idAlumno);
        mostrarToast('✅ Nota guardada');
      });
    }
