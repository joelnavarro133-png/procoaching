    // coach.js · Panel del coach: alumnos, evaluaciones, constructor de rutinas, editar/duplicar, PDF y WhatsApp.
    // ==================== COACH ====================
    function inicializarPanelCoach() {
      document.getElementById('coachView').classList.remove('hidden');
      actualizarAvataresUI();
      actualizarSelectoresAlumnos();
      actualizarSelectorPlantillas();
      renumerarConstructor();
      document.getElementById('evFecha').value = fechaLocalISO();
      cambiarTabCoach('tabNuevoAlumno');
      iniciarActividadCoach();
    }

    function cambiarTabCoach(tabId) {
      document.querySelectorAll('.tab-coach').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById(tabId);
      if (target) target.classList.remove('hidden');

      document.querySelectorAll('.btn-tab-coach').forEach(btn => {
        btn.className = 'btn-tab-coach whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800';
      });
      if (tabId === 'tabRecordsCoach') cargarRecords('contenedorRecordsCoach');
      document.querySelectorAll('.btn-tab-coach').forEach(b => b.removeAttribute('aria-current'));
      const btnActivo = document.getElementById('btnTab-' + tabId);
      if (btnActivo) btnActivo.setAttribute('aria-current', 'page');
      if (btnActivo) {
        btnActivo.className = 'btn-tab-coach whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-extrabold transition bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20';
      }
    }

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
      if (!nombre || !usuario || !pass) return alert('Completa todos los campos.');

      btn.innerText = 'Creando carpeta en Drive...';
      btn.disabled = true;
      const passwordHash = await sha256(pass);

      GS()
        .withSuccessHandler(res => {
          btn.innerText = 'Crear Alumno';
          btn.disabled = false;
          alert(res.mensaje || res.error);
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
      if (!idAlumno || !fecha) return alert('Selecciona alumno y fecha.');
      const alertaMedidas = document.getElementById('alertaMedidasAtipicas');
      if (alertaMedidas && !alertaMedidas.classList.contains('hidden')) {
        alertaMedidas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return alert('Hay medidas que no cuadran (revisa el aviso rojo). Corrígelas antes de guardar la evaluación.');
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
          alert(res.mensaje || res.error);
          if (res.success) {
            document.getElementById('fotoFrente').value = '';
            document.getElementById('fotoPerfil').value = '';
            document.getElementById('fotoEspalda').value = '';
          }
        })
        .guardarEvaluacionCompleta(payload);
    }

    function cambiarNivel() {
      const idAlumno = document.getElementById('selectAlumnoMedidas').value;
      const nuevoNivel = document.getElementById('updateNivelSelect').value;
      GS()
        .withSuccessHandler(res => alert(res.mensaje || res.error))
        .actualizarNivelAlumno(idAlumno, nuevoNivel);
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
          <button type="button" onclick="quitarTarjetaConstructor(this)" class="shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold" title="Quitar ejercicio">🗑️</button>
        </div>
        <div class="flex gap-3 items-start">
          <div class="r-media shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center text-3xl">🏋️</div>
          <div class="flex-1 min-w-0 space-y-2">
            <textarea rows="2" placeholder="NOMBRE DEL EJERCICIO" class="r-ejer w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-extrabold text-white uppercase resize-none leading-snug"></textarea>
            <p class="r-en hidden text-xs text-sky-300/90 italic font-semibold leading-tight"></p>
            <input type="text" placeholder="MÚSCULO (ej. PECHO)" class="r-musc w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-emerald-300 uppercase">
          </div>
        </div>
        <button type="button" onclick="abrirCatalogoParaFila(this)" class="mt-2 w-full py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold">📚 Elegir / cambiar ejercicio de la biblioteca</button>
        <div class="grid grid-cols-3 gap-2 mt-3">
          <div><label class="${lbl}">Series</label><input type="number" inputmode="numeric" min="1" placeholder="4" value="${escHtml(v('.r-ser', ''))}" class="r-ser ${inp}"></div>
          <div><label class="${lbl}">Reps</label><input type="text" placeholder="10 / 8-10-12" value="${escHtml(v('.r-rep', ''))}" class="r-rep ${inp}"></div>
          <div><label class="${lbl} text-emerald-400">Descanso (s)</label><input type="number" inputmode="numeric" min="0" placeholder="90" value="${escHtml(v('.r-desc', ''))}" class="r-desc ${inp} text-emerald-400 border-emerald-800"></div>
        </div>
        <div class="mt-3">
          <label class="${lbl}">⚡ Tempo (segundos): bajar · pausa · subir · pausa</label>
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
      en.textContent = '🇬🇧 ' + e.nombre;
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
      u.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      if (!idPlantilla) return alert('Primero debes crear al menos una plantilla en el constructor.');
      if (!idAlumno) return alert('Selecciona un alumno destino.');

      const btn = document.getElementById('btnAsignarPlantilla');
      btn.innerText = 'Asignando...';
      btn.disabled = true;

      GS()
        .withSuccessHandler(res => {
          btn.innerText = '🔗 Designar Rutina al Alumno';
          btn.disabled = false;
          alert(res.mensaje || res.error);
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
          <button onclick="editarRutinaAsignada()" class="flex-1 min-w-0 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-extrabold text-xs px-3 py-3 rounded-xl active:scale-[0.98] transition whitespace-nowrap">✏️ Editar</button>
          <button onclick="abrirDuplicarRutina()" class="flex-1 min-w-0 bg-sky-500/15 border border-sky-500/40 text-sky-300 font-extrabold text-xs px-3 py-3 rounded-xl active:scale-[0.98] transition whitespace-nowrap">📑 Duplicar</button>
          <button onclick="borrarRutinaAsignada()" class="shrink-0 bg-slate-950 border border-rose-500/30 text-rose-400 font-bold text-xs px-4 py-3 rounded-xl" title="Eliminar la rutina «${escHtml(nom)}»">🗑️</button>
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
        if (r.nombreEn) { const en = card.querySelector('.r-en'); en.textContent = '🇬🇧 ' + r.nombreEn; en.classList.remove('hidden'); }
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
      if (!rutina.length || !rutina[0].idRutina) return alert('Este alumno no tiene una rutina guardada todavía.');
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
      document.getElementById('btnGuardarRutina').innerText = '💾 Guardar cambios';
      cambiarTabCoach('tabCrearRutina');
      document.getElementById('avisoEdicionRutina').scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      if (lista.length === 0) return alert('Agrega al menos un ejercicio.');
      const btn = document.getElementById('btnGuardarRutina');
      const textoBoton = ed ? '💾 Guardar cambios' : 'Guardar Rutina';
      btn.innerText = 'Guardando...';
      btn.disabled = true;

      const alTerminar = res => {
        btn.innerText = textoBoton;
        btn.disabled = false;
        if (res && res.plantillas) {
          estadoGlobal.plantillas = res.plantillas;
          actualizarSelectorPlantillas();
        }
        alert((res && (res.mensaje || res.error)) || 'No se pudo guardar.');
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
      if (!rutina.length || !rutina[0].idRutina) return alert('Este alumno no tiene una rutina guardada todavía.');
      const idAlumno = (estadoGlobal.checkinsCoach || {}).idAlumno || '';
      const nom = rutina[0].nombreRutina || 'Rutina';
      estadoGlobal.duplicando = { idRutina: rutina[0].idRutina, desde: 'ALUMNO', origen: idAlumno };

      const otros = (estadoGlobal.alumnos || []).filter(a => a.id !== idAlumno);
      document.getElementById('dupDestino').innerHTML =
        '<option value="PLANTILLA">📋 Mi catálogo de plantillas</option>' +
        otros.map(a => `<option value="${escHtml(a.id)}">👤 ${escHtml(a.nombre)}</option>`).join('');
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
      if (!hacia) return alert('Selecciona el destino.');
      const btn = document.getElementById('btnDuplicar');
      btn.disabled = true; btn.innerText = 'Duplicando...';
      GS().withSuccessHandler(res => {
        btn.disabled = false; btn.innerText = 'Duplicar';
        if (res && res.success) {
          if (res.plantillas) { estadoGlobal.plantillas = res.plantillas; actualizarSelectorPlantillas(); }
          cerrarDuplicar();
          mostrarToast('✅ Rutina duplicada');
        }
        alert((res && (res.mensaje || res.error)) || 'No se pudo duplicar.');
      }).duplicarRutina({ idRutina: d.idRutina, desde: d.desde, hacia, nombreNuevo, idCoach: estadoGlobal.user.id });
    }

    function borrarRutinaAsignada() {
      const rutina = estadoGlobal.rutinaActual || [];
      if (!rutina.length || !rutina[0].idRutina) return;
      if (!confirm(`¿Eliminar la rutina "${rutina[0].nombreRutina || ''}" (${rutina.length} ejercicios)?\n\nEl progreso ya registrado por el alumno NO se borra.`)) return;
      GS().withSuccessHandler(res => {
        alert((res && (res.mensaje || res.error)) || 'No se pudo eliminar.');
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
        try { window.open(r.url, '_blank'); } catch (e2) { alert('No se pudo descargar el PDF en este navegador.'); }
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
            <button onclick="descargarReporte('${escHtml(idAlumno)}')" class="flex-1 min-w-[130px] text-center bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl">📥 Descargar PDF</button>
            ${telDestino ? `<button onclick="enviarReportePorWhatsApp('${escHtml(idAlumno)}', ${paraCoach ? 'true' : 'false'})" class="flex-1 min-w-[130px] bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl active:scale-[0.98] transition">💬 Enviar ${escHtml(destino)}</button>` : ''}
          </div>
          <p class="text-[11px] text-slate-400 mt-2">🔒 El reporte es privado: no se comparte por enlace. Se envía como archivo adjunto.</p>
        </div>` : '';
      return `
        <div id="bloqueReportePDF-${escHtml(idAlumno)}" class="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <h3 class="text-sm font-extrabold text-white mb-1">📄 Reporte PDF de progreso</h3>
          <p class="text-xs text-slate-400 mb-3">Incluye medidas y composición corporal, progreso de cargas, adherencia, check-ins y las fotos de antes y después.</p>
          <button id="btnReporte-${escHtml(idAlumno)}" onclick="generarReportePDFCliente('${escHtml(idAlumno)}', ${paraCoach ? 'true' : 'false'})"
            class="w-full sm:w-auto bg-emerald-500 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl active:scale-[0.98] transition">
            ${hecho ? '🔄 Volver a generar' : '📄 Generar reporte PDF'}
          </button>
          ${enlace}
        </div>`;
    }

    function generarReportePDFCliente(idAlumno, paraCoach) {
      const btn = document.getElementById('btnReporte-' + idAlumno);
      const txtPrev = btn ? btn.innerText : '📄 Generar reporte PDF';
      if (btn) { btn.disabled = true; btn.innerText = '⏳ Generando PDF...'; btn.classList.add('opacity-60'); }
      GS().withSuccessHandler(res => {
        if (!res || !res.success) {
          if (btn) { btn.disabled = false; btn.innerText = txtPrev; btn.classList.remove('opacity-60'); }
          return alert((res && res.error) || 'No se pudo generar el reporte.');
        }
        const previo = reportesGenerados[idAlumno];
        if (previo && previo.url) { try { URL.revokeObjectURL(previo.url); } catch (e) {} }
        const blob = blobDesdeBase64(res.pdfBase64 || '', 'application/pdf');
        reportesGenerados[idAlumno] = { nombre: res.nombre, blob: blob, url: URL.createObjectURL(blob) };

        const contClasico = document.getElementById('bloqueReportePDF-' + idAlumno);
        if (contClasico) contClasico.outerHTML = bloqueReportePDF(idAlumno, paraCoach);

        const contCoach = document.getElementById('estadoReporteCoach-' + idAlumno);
        if (contCoach) {
          if (btn) { btn.disabled = false; btn.innerText = '🔄 Volver a generar PDF'; btn.classList.remove('opacity-60'); }
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
            <p class="text-xs font-extrabold text-emerald-400 truncate">📄 ${escHtml(hecho.nombre)}</p>
            <p class="text-[11px] text-slate-400">🔒 Privado en Drive · Se comparte como archivo adjunto</p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button onclick="descargarReporte('${escHtml(idAlumno)}')" class="flex-1 sm:flex-none bg-slate-950 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl">📥 Descargar</button>
            ${a.whatsapp ? `<button onclick="enviarReportePorWhatsApp('${escHtml(idAlumno)}', true)" class="flex-1 sm:flex-none bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl">💬 Enviar WhatsApp</button>` : ''}
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
             <button onclick="enviarWhatsApp('${escHtml(idAlumno)}','resumen')" class="flex-1 min-w-[150px] bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl active:scale-[0.98] transition">📊 Resumen semanal</button>
             <button onclick="enviarWhatsApp('${escHtml(idAlumno)}','recordatorio')" class="flex-1 min-w-[150px] bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-4 py-3 rounded-xl active:scale-[0.98] transition">⏰ Recordar entrenamiento</button>
             <button onclick="abrirWhatsApp('${escHtml(a.whatsapp)}','')" class="shrink-0 bg-slate-950 border border-slate-700 text-slate-300 font-bold text-xs px-4 py-3 rounded-xl">💬 Escribir</button>
           </div>
           <p class="text-[11px] text-slate-400 mt-2">Número: +${escHtml(tel)} · <button onclick="pedirWhatsApp('${escHtml(idAlumno)}')" class="underline text-slate-400">cambiar</button></p>`
        : `<div class="flex flex-wrap items-center gap-2">
             <input type="tel" inputmode="tel" id="inpWa-${escHtml(idAlumno)}" placeholder="987654321" class="flex-1 min-w-[160px] p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white">
             <button onclick="guardarWhatsApp('${escHtml(idAlumno)}')" class="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl">Guardar</button>
           </div>
           <p class="text-[11px] text-slate-400 mt-2">Este alumno aún no tiene WhatsApp registrado.</p>`;
      return `
        <div id="bloqueWhatsAppCoach" class="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <h3 class="text-sm font-extrabold text-white mb-3">💬 Enviar por WhatsApp</h3>
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
      const nuevo = prompt('Número de WhatsApp del alumno (sin código de país si es de Perú):', a.whatsapp || '');
      if (nuevo === null) return;
      guardarWhatsApp(idAlumno, nuevo);
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
    function htmlTarjetaAlumnoCoach(a, { activo = false, onclick = '' }) {
      const avatar = a.foto
        ? `<img src="${escHtml(urlFotoConCache(a.foto))}" data-mini="1" referrerpolicy="no-referrer" onerror="cargarFotoSegura(this, false)" alt="" loading="lazy" class="w-10 h-10 rounded-full object-cover border-2 ${activo ? 'border-emerald-400' : 'border-slate-700'} shrink-0">`
        : `<span class="w-10 h-10 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${activo ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'}">${escHtml(inicialesDe(a.nombre).toUpperCase())}</span>`;

      return `
        <button type="button" onclick="${onclick}"
          class="w-full text-left p-3 rounded-2xl border transition flex items-center gap-3 active:scale-[0.99] ${activo ? 'bg-emerald-500/10 border-emerald-500/60 shadow-md shadow-emerald-500/10' : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700'}">
          ${avatar}
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-extrabold text-white truncate">${escHtml(a.nombre)}</span>
            <span class="block text-xs font-semibold truncate mt-0.5 ${activo ? 'text-emerald-300' : 'text-slate-400'}">${escHtml(a.nivel || 'Sin nivel')}</span>
            ${textoActividad(a.id) ? `<span class="block text-[11px] font-semibold truncate mt-0.5 ${(actividadCoach[a.id] || {}).enLinea ? 'text-emerald-400' : 'text-slate-400'}">${escHtml(textoActividad(a.id))}${(actividadCoach[a.id] || {}).entrenoHoy ? ' · ✅ entrenó hoy' : ''}</span>` : ''}
          </span>
          <span class="${activo ? 'text-emerald-400' : 'text-slate-400'} font-bold text-sm shrink-0">›</span>
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderTarjetasAlumnos() {
      const cont = document.getElementById('tarjetasAlumnosCoach');
      if (!cont) return;
      const lista = estadoGlobal.alumnos || [];
      if (!lista.length) {
        cont.innerHTML = '<div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">Aún no tienes alumnos registrados.</div>';
        return;
      }
      cont.innerHTML = lista.map(a => htmlTarjetaAlumnoCoach(a, {
        activo: a.id === alumnoCoachActivo,
        onclick: `cargarProgresoParaCoach('${escHtml(a.id)}')`
      })).join('');
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
            ${c.peso ? `<span>⚖️ <strong>${escHtml(c.peso)} kg</strong></span>` : ''}
            <span>⚡ Energía ${CARAS[(parseInt(c.energia) || 3) - 1]}</span>
            <span>😴 Sueño ${CARAS[(parseInt(c.sueno) || 3) - 1]}</span>
            <span>${c.molestias ? `<span class="text-rose-300">⚠️ ${escHtml(c.molestias)}</span>` : '🩹 Sin molestias'}</span>
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
        btn.className = 'btn-subtab-exp whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition bg-slate-900 text-slate-400 border border-slate-800 hover:text-white';
      });
      const act = document.getElementById('btnSub-' + subId);
      if (act) {
        act.className = 'btn-subtab-exp whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-extrabold transition bg-emerald-500/15 text-emerald-300 border border-emerald-500/50';
      }
      if (subId === 'expProgreso') {
        setTimeout(() => inicializarGraficosSeparados(), 60);
      }
    }

    function cargarProgresoParaCoach(idDirecto) {
      const idAlumno = idDirecto || document.getElementById('selectAlumnoAnalizar').value;
      if (!idAlumno) return;
      alumnoCoachActivo = idAlumno;
      const selHidden = document.getElementById('selectAlumnoAnalizar');
      if (selHidden) selHidden.value = idAlumno;
      renderTarjetasAlumnos();
      
      mostrarVistaAnalizarMovil(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const cont = document.getElementById('contenedorComparativaCoach');
      cont.innerHTML = '<div class="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm">⏳ Cargando expediente del alumno...</div>';

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

          cont.innerHTML = `
            <div class="space-y-4">
              <!-- CABECERA DEL ALUMNO + 4 KPIs -->
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div class="flex items-center gap-3 min-w-0">
                    ${avatarHtml}
                    <div class="min-w-0">
                      <h3 class="text-base sm:text-lg font-extrabold text-white truncate">${escHtml(alu.nombre)}</h3>
                      <p class="text-xs text-slate-400 truncate">${escHtml(alu.nivel || 'Sin nivel asignado')}</p>
                    </div>
                  </div>
                  <span class="shrink-0 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-extrabold px-3 py-1 rounded-full">
                    🔥 ${racha} ${racha === 1 ? 'semana' : 'semanas'}
                  </span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  ${kpiCard('Adherencia', kpi.adherencia, true)}
                  ${kpiCard('Masa magra', kpi.masaTxt, kpi.masaPos)}
                  ${kpiCard('% Grasa', kpi.grasaTxt, kpi.grasaPos)}
                  ${kpiCard('Carga total', kpi.cargaTxt, kpi.cargaPos)}
                </div>
              </div>

              <!-- ÚLTIMO CHECK-IN -->
              ${construirTarjetaCheckinReciente(res.checkins || [])}

              <!-- 2 ACCIONES PRINCIPALES -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button id="btnReporte-${escHtml(idAlumno)}" onclick="generarReportePDFCliente('${escHtml(idAlumno)}', true)"
                  class="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15">
                  📄 Generar reporte PDF
                </button>
                <button onclick="enviarWhatsApp('${escHtml(idAlumno)}','resumen')"
                  class="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15">
                  📊 Resumen semanal
                </button>
              </div>
              <div id="estadoReporteCoach-${escHtml(idAlumno)}">${barraDescargaReporteCoach(idAlumno)}</div>

              <!-- PESTAÑAS INTERNAS DEL EXPEDIENTE -->
              <div class="flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/80">
                <button id="btnSub-expRutina" onclick="cambiarSubTabExpediente('expRutina')"
                  class="btn-subtab-exp whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-extrabold transition bg-emerald-500/15 text-emerald-300 border border-emerald-500/50">
                  🏋️ Rutina e Historial
                </button>
                <button id="btnSub-expProgreso" onclick="cambiarSubTabExpediente('expProgreso')"
                  class="btn-subtab-exp whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition bg-slate-900 text-slate-400 border border-slate-800 hover:text-white">
                  📊 Medidas, Gráficos y Fotos
                </button>
                <button id="btnSub-expComunicacion" onclick="cambiarSubTabExpediente('expComunicacion')"
                  class="btn-subtab-exp whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition bg-slate-900 text-slate-400 border border-slate-800 hover:text-white">
                  💬 WhatsApp y Check-ins
                </button>
              </div>

              <!-- CONTENIDO DE CADA PESTAÑA INTERNA -->
              <div id="expRutina" class="subtab-exp">
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
        })
        .obtenerDetallesAlumnoParaCoach(idAlumno);
    }

    function construirBloqueCheckinsCoach(lista) {
      const tarjetas = lista.length ? lista.map(c => `
        <div class="bg-slate-950 border ${c.respuesta ? 'border-slate-800' : 'border-amber-500/40'} rounded-xl p-3">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="text-xs font-extrabold text-white">${escHtml(c.semanaISO)} <span class="text-slate-400 font-semibold">· ${escHtml(c.fecha)}</span></span>
            <span class="text-xs text-slate-300">${c.peso ? '⚖️ ' + escHtml(c.peso) + ' kg · ' : ''}Energía ${CARAS[(parseInt(c.energia) || 3) - 1]} · Sueño ${CARAS[(parseInt(c.sueno) || 3) - 1]}</span>
          </div>
          ${c.molestias ? `<p class="text-xs text-rose-300 mt-2">⚠️ ${escHtml(c.molestias)}</p>` : ''}
          ${c.nota ? `<p class="text-sm text-slate-200 mt-2 italic">“${escHtml(c.nota)}”</p>` : '<p class="text-xs text-slate-400 mt-2">Sin nota.</p>'}
          ${c.respuesta
            ? `<div class="mt-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5"><p class="text-[11px] font-bold text-emerald-300 uppercase">Tu respuesta · ${escHtml(c.fechaRespuesta)}</p><p class="text-sm text-white mt-0.5">${escHtml(c.respuesta)}</p></div>`
            : `<div class="mt-2 flex gap-2"><input type="text" maxlength="500" placeholder="Responder al alumno..." class="flex-1 min-w-0 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white" id="resp-${escHtml(c.semanaISO)}">
               <button onclick="responderCheckinCoach('${escHtml(c.semanaISO)}')" class="shrink-0 px-3 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">Enviar</button></div>`}
        </div>`).join('') : '<p class="text-sm text-slate-400">Este alumno aún no ha enviado check-ins.</p>';
      const pendientes = lista.filter(c => !c.respuesta).length;
      return `
        <div id="bloqueCheckinsCoach" class="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
          <h3 class="text-sm font-extrabold text-white mb-3">📋 Historial de Check-ins ${pendientes ? `<span class="ml-2 text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">${pendientes} sin responder</span>` : ''}</h3>
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
      }).responderCheckin(ctx.idAlumno, semanaISO, inp.value.trim());
    }
 

    // ==================== ACTIVIDAD DE LOS ALUMNOS (v11) ====================
    let actividadCoach = {}, actividadHoy = '', actividadTimer = null;

    function iniciarActividadCoach() {
      cargarActividadCoach();
      clearInterval(actividadTimer);
      actividadTimer = setInterval(() => { if (!document.hidden && esCoach()) cargarActividadCoach(); }, 60000);
    }
    function detenerActividadCoach() { clearInterval(actividadTimer); actividadTimer = null; actividadCoach = {}; }
    function cargarActividadCoach() {
      GS().withSuccessHandler(res => {
        if (!res || !res.success) return;
        actividadCoach = {}; actividadHoy = res.hoy;
        (res.actividad || []).forEach(a => { actividadCoach[a.id] = a; });
        renderResumenActividadCoach();
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
      if (a.enLinea) return '🟢 En línea · ' + (a.origen === 'app' ? 'app' : 'web');
      return haceCuanto(a.ultimaConexion) + (a.ultimaConexion && a.origen ? ' · ' + a.origen : '');
    }

    function renderResumenActividadCoach() {
      const cont = document.getElementById('resumenActividadCoach');
      if (!cont) return;
      const lista = Object.values(actividadCoach);
      if (!lista.length) { cont.innerHTML = ''; return; }
      const entrenaron = lista.filter(a => a.entrenoHoy).length;
      const enLinea = lista.filter(a => a.enLinea).length;
      cont.innerHTML = `
        <button type="button" onclick="abrirActividadHoy()" class="w-full text-left bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.99] transition">
          <span class="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xl flex items-center justify-center shrink-0">🏋️</span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-extrabold text-white">Hoy entrenaron ${entrenaron} de ${lista.length}</span>
            <span class="block text-xs text-slate-400 mt-0.5">${enLinea ? `🟢 ${enLinea} en línea ahora` : 'Nadie en línea ahora'} · toca para ver el detalle</span>
          </span>
          <span class="text-emerald-400 text-lg font-black">›</span>
        </button>`;
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
          <span class="shrink-0 text-xs font-bold ${a.entrenoHoy ? 'text-emerald-300' : 'text-slate-400'}">${a.entrenoHoy ? `✅ ${a.ejerciciosHoy} ej. · ${a.seriesHoy} series` : 'No entrenó hoy'}</span>
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
            <button onclick="revisarRecordCoach('${escHtml(r.id)}', true, ${i})" class="ko-btn flex-1 text-xs py-2.5">✅ Aprobar</button>
            <button onclick="revisarRecordCoach('${escHtml(r.id)}', false, ${i})" class="ko-btn2 flex-1 text-xs py-2.5 t-err">✖ Rechazar</button>
          </div>
        </div>`).join('')}</div>` : '<p class="text-xs t-mu">No hay récords esperando tu aprobación.</p>';
      return `<div class="ko-card" style="${p.length ? 'box-shadow:inset 0 0 0 1px rgba(249,115,22,.45)' : ''}">${tituloRec('inbox', 'Récords por aprobar', p.length ? `<span class="ko-pill b-nar-s">${p.length}</span>` : '')}${cuerpo}</div>`;
    }
    function revisarRecordCoach(id, aprobar, i) {
      let nota = '';
      if (!aprobar) { nota = prompt('Motivo del rechazo (opcional, el alumno lo verá):', ''); if (nota === null) return; }
      const campo = document.getElementById('comRec-' + i);
      const arg = aprobar ? { nota: '', comentario: campo ? campo.value.trim() : '' } : nota;
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
          <button onclick="agregarEjercicioRanking()" ${lista.length >= 12 ? 'disabled' : ''} class="ko-btn2 flex-1 min-w-[150px] text-xs py-3 disabled:opacity-40">📚 Añadir de la biblioteca</button>
          <button onclick="guardarEjerciciosRankingCoach()" id="btnGuardarRanking" ${cambiado ? '' : 'disabled'} class="ko-btn flex-1 min-w-[150px] text-xs py-3">💾 Guardar</button>
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
        <button onclick="guardarClubesCoach()" id="btnGuardarClubes" ${cambiado ? '' : 'disabled'} class="ko-btn w-full text-xs py-3 mt-3">💾 Guardar clubes</button>
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
