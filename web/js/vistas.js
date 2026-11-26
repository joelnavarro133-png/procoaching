    // vistas.js · Vista del alumno, resumen de rutina del coach, tarjetas de rutina, cronómetro, gráficos,
    // historial, perfil, métricas y diccionario gym.
    // ==================== INICIALIZACIÓN VISTA ALUMNO ====================
    // opciones.refresco = true: llegan datos nuevos del servidor con la app ya abierta;
    // se redibuja todo SIN cambiar de pantalla ni de día seleccionado.
    function inicializarPanelAlumno(user, progreso, rutina, coach, opciones) {
      const refresco = !!(opciones && opciones.refresco);
      const vistaVisible = document.querySelector('.vista-alumno-sec:not(.hidden)');
      const vistaActual = vistaVisible ? vistaVisible.id.replace('vista-alumno-', '') : 'INICIO';
      document.getElementById('alumnoView').classList.remove('hidden');
      if (!refresco || !senalIntervalo) iniciarSenalActividad();
      if (!refresco) {
        precargarMediosRutina(rutina); precargarRecords();
        // v19: recordatorio de «3 días sin entrenar» (solo app Android; no vuelve a pedir permiso al abrir)
        const ultEnt = LS.get('proc_ultimo_entreno_' + estadoGlobal.user.id) || fechaLocalISO();
        if (typeof window.programarRecordatorioEntreno === 'function') window.programarRecordatorioEntreno(ultEnt, true);
      }
      
      const nombreLimpio = (user.nombre || '').toUpperCase();
      const primerNombre = (user.nombre || '').trim().split(/\s+/)[0] || '';
      document.getElementById('saludoAlumno').textContent = 'Hola, ' + primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
      estadoGlobal.coachInfo = coach;
      if (!refresco) {
        estadoGlobal.checkins = estadoGlobal.checkins && estadoGlobal.checkins.length ? estadoGlobal.checkins : [];
        setTimeout(cargarCheckinsAlumno, 300);
      }
      document.getElementById('badgeNivelAlumno').innerText = user.nivel || 'NIVEL ASIGNADO';
      document.getElementById('infoCoachAlumno').innerText = `— Tu coach: ${coach.nombre}`;
      
      actualizarAvataresUI();

      const frasesUnicas = Array.from(new Set(FRASES_MOTIVADORAS));
      const fraseAleatoria = frasesUnicas[Math.floor(Math.random() * frasesUnicas.length)];
      if (!refresco || !document.getElementById('fraseMotivadora').innerText) document.getElementById('fraseMotivadora').innerText = fraseAleatoria;

      const ultimaEval = progreso.length > 0 ? progreso[progreso.length - 1] : null;
      const diaHoy = obtenerDiaActualSemana();
      const ejerciciosHoy = rutina.filter(r => normalizarDia(r.dia) === normalizarDia(diaHoy)).length;

      const contenedorCards = document.getElementById('resumenInicioCards');
    contenedorCards.className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3";

    const imcData = ultimaEval ? evaluarIMC(ultimaEval.imc, ultimaEval.sexo) : {val: '-', class: '-', desc: '-'};
    const vTaperRatio = ultimaEval && ultimaEval.cintura > 0 ? (ultimaEval.hombros / ultimaEval.cintura).toFixed(2) : '-';
    const vTaperData = ultimaEval ? evaluarVTaper(ultimaEval.hombros, ultimaEval.cintura, ultimaEval.sexo) : {val: '-', class: '-', desc: '-'};
      const imcNum = ultimaEval ? parseFloat(ultimaEval.imc) : NaN;
      const imcPct = isNaN(imcNum) ? 0 : Math.max(4, Math.min(100, Math.round(((imcNum - 15) / 25) * 100)));   // escala visual IMC 15–40
    const grasaData = ultimaEval ? evaluarGrasa(ultimaEval.grasaCorporal, ultimaEval.sexo, ultimaEval.edad) : {val: '-', class: '-', desc: '-'};
    
    const listadoFechas = progreso.map(p => 
      `<li class="text-xs border-b border-slate-700 py-1.5 last:border-0 flex justify-between">
        <span class="text-emerald-400 font-bold">${p.fecha}</span> 
        <span class="text-slate-400">${p.peso}kg</span>
      </li>`
    ).reverse().join('');

    contenedorCards.innerHTML = `
  <!-- Tarjeta Peso (Cyan) -->
  <div onclick="abrirModalComposicion('${ultimaEval ? ultimaEval.peso : '-'}', '${ultimaEval ? ultimaEval.grasaCorporal : '-'}', '${ultimaEval ? (ultimaEval.sexo || '') : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-neon-cyan/30 flex flex-col justify-center cursor-pointer transition-all relative overflow-hidden group">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <span class="text-[11px] uppercase text-neon-cyan/80 font-bold tracking-widest block mb-1">Masa Total</span>
    <span class="text-3xl font-black text-white">${ultimaEval && ultimaEval.peso ? ultimaEval.peso + '<span class="text-sm text-neon-cyan">KG</span>' : '-'}</span>
    <span class="text-[11px] text-neon-cyan font-bold uppercase mt-2 tracking-[0.2em]">Escaneo HUD ▾</span>
  </div>
  
  <!-- Tarjeta Grasa (Orange Neon) -->
  <div onclick="abrirModalMetrica('GRASA', '${ultimaEval ? ultimaEval.grasaCorporal : '-'}', '${ultimaEval ? ultimaEval.sexo : ''}', '${ultimaEval ? ultimaEval.edad : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-neon-orange/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <div class="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-neon-orange to-transparent opacity-50"></div>
    <span class="text-[11px] uppercase text-neon-orange/80 font-bold tracking-widest block mb-1">Tejido Adiposo</span>
    <span class="text-3xl font-black text-white">${grasaData.val}</span>
    <span class="text-[11px] text-neon-orange font-black mt-2 tracking-wider bg-neon-orange/10 px-2 py-0.5 rounded inline-block max-w-full leading-tight border border-neon-orange/30">${grasaData.class}</span>
  </div>

  <!-- Tarjeta IMC (Green Neon) -->
  <div onclick="abrirModalMetrica('IMC', '${ultimaEval ? ultimaEval.imc : '-'}', '${ultimaEval ? ultimaEval.sexo : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-[#34d399]/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <span class="text-[11px] uppercase text-[#34d399]/80 font-bold tracking-widest block mb-1">Índice IMC</span>
    <span class="text-3xl font-black text-white">${imcData.val}</span>
    <div class="mt-2 w-full bg-[#020617] h-1.5 rounded-full overflow-hidden border border-[#34d399]/20">
        <div class="bg-[#34d399] h-full" style="width: ${imcPct}%;"></div>
    </div>
    <span class="text-[11px] text-[#34d399] mt-1.5 tracking-widest uppercase">Rango: ${imcData.class}</span>
  </div>

  <!-- Tarjeta V-Taper (Purple Neon) -->
  <div onclick="abrirModalMetrica('VTAPER', '${vTaperRatio}', '${ultimaEval ? ultimaEval.sexo : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-purple-500/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <span class="text-[11px] uppercase text-purple-400/80 font-bold tracking-widest block mb-1">Ratio V-Taper</span>
    <span class="text-3xl font-black text-white">${vTaperRatio}</span>
    <span class="text-[11px] text-purple-400 font-black mt-2 tracking-wider bg-purple-500/10 px-2 py-0.5 rounded inline-block max-w-full leading-tight border border-purple-500/30">${vTaperData.class}</span>
  </div>

  <!-- Tarjeta Día Actual (Tech Estándar) -->
  <div class="bg-panel p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center shadow-lg relative overflow-hidden">
    <span class="text-[11px] uppercase text-slate-400 font-bold tracking-widest block mb-1">Día Actual (${diaHoy})</span>
    <span class="text-3xl font-black text-white leading-none">${ejerciciosHoy} <span class="text-[11px] text-slate-400 tracking-wider">EJERC.</span></span>
  </div>

  <!-- Tarjeta Controles (Emerald HUD) -->
  <div onclick="document.getElementById('modalFechasControles').classList.toggle('hidden')" class="bg-panel p-4 rounded-2xl border border-emerald-500/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <div class="flex justify-between items-center mb-1">
      <span class="text-[11px] uppercase text-emerald-500/80 font-bold tracking-widest block">Controles</span>
      <span class="text-[11px] bg-[#020617] border border-emerald-500/50 px-1.5 py-0.5 rounded text-emerald-400">VER ▾</span>
    </div>
    <span class="text-3xl font-black text-emerald-400">${progreso.length}</span>
    
    <div id="modalFechasControles" class="hidden absolute top-[105%] right-0 w-48 bg-[#0f172a]/95 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 max-h-48 overflow-y-auto cursor-default">
      <p class="text-[11px] text-emerald-400 font-black mb-2 uppercase tracking-widest border-b border-emerald-500/30 pb-1.5">Historial Médico</p>
      <ul class="text-slate-300">
        ${listadoFechas || '<li class="text-[11px] text-slate-400 py-2 uppercase tracking-wider font-bold">Sin registros de red</li>'}
      </ul>
    </div>
  </div>
`;

      inicializarProgresoLocal();
      if (!refresco || !estadoGlobal.diaSeleccionado) estadoGlobal.diaSeleccionado = diaHoy;
      document.getElementById('contenedorRutinaAlumno').innerHTML = construirBloqueRutinaHTML(rutina);
      document.getElementById('contenedorHistorialAlumno').innerHTML = construirBloqueHistorialHTML(progreso);

      seleccionarDiaRutina(estadoGlobal.diaSeleccionado);
      inicializarSelectoresFotos();
      renderComparadorSemanas();
      navegarAlumno(refresco ? vistaActual : 'INICIO');
    }

    // ==================== RESUMEN DE RUTINA (EXPEDIENTE DEL COACH) ====================
    // Vista compacta: una fila por ejercicio con miniatura, datos clave, último peso y estado de la semana.
    const DIAS_ABREV_RESUMEN = { LUNES: 'LUN', MARTES: 'MAR', MIERCOLES: 'MIÉ', JUEVES: 'JUE', VIERNES: 'VIE', SABADO: 'SÁB', DOMINGO: 'DOM' };
    const ETIQUETA_TIPO = { BISERIE: 'Bi-serie', TRISERIE: 'Tri-serie', DROPSET: 'Drop set', ASCENDING: 'Ascendente', PIRAMIDE: 'Pirámide' };
    const fmtKg = n => (Math.round(n * 10) / 10).toString();

    /** Peso más alto que registró el alumno en ese ejercicio dentro de una semana (o null). */
    function pesoMaxSemana(semana, diaNorm, base) {
      let max = null;
      ((semana && semana.registros) || []).forEach(r => {
        if (normalizarDia(r.dia) !== diaNorm) return;
        const c = txtClave(r.clave), i = c.indexOf('::');
        if (i < 0 || c.slice(0, i) !== base) return;
        const campo = c.slice(i + 2);
        if (!(campo === 'carga' || /^carga_d\d+$/.test(campo) || /^s\d+_peso$/.test(campo))) return;
        const n = parseFloat(String(r.valor).replace(',', '.'));
        if (!isNaN(n) && (max === null || n > max)) max = n;
      });
      return max;
    }

    /** Último peso registrado y el anterior (para la flecha ▲▼). */
    function historialPesoEjercicio(diaNorm, base) {
      const sems = estadoGlobal.semanas || [];
      let ultimo = null, previo = null;
      for (let i = sems.length - 1; i >= 0; i--) {
        const kg = pesoMaxSemana(sems[i], diaNorm, base);
        if (kg === null) continue;
        if (!ultimo) ultimo = { kg, numero: sems[i].numero };
        else { previo = { kg, numero: sems[i].numero }; break; }
      }
      return { ultimo, previo };
    }

    /** Series marcadas por el alumno en la semana actual. */
    function estadoEjercicioSemana(diaNorm, base, r) {
      const k = campo => diaNorm + '|' + base + '::' + campo;
      const total = cuantasSeries(r);
      if (leerProg(k('ok')) === 'true') return { hechas: total, total, completo: true };
      let hechas = 0;
      for (let n = 1; n <= total; n++) if (leerProg(k('s' + n + '_ok')) === 'true') hechas++;
      return { hechas, total, completo: hechas >= total };
    }

    /** Agrupa bi-series (de 2) y tri-series (de 3) igual que la vista del alumno. */
    function agruparEjerciciosResumen(ejs) {
      const bloques = [];
      let i = 0;
      while (i < ejs.length) {
        const t = clasificarTipoSerie(ejs[i].tipoEjercicio);
        if (t === 'BISERIE' || t === 'TRISERIE') {
          const max = t === 'BISERIE' ? 2 : 3, idxs = [i];
          while (idxs.length < max && i + idxs.length < ejs.length && clasificarTipoSerie(ejs[i + idxs.length].tipoEjercicio) === t) idxs.push(i + idxs.length);
          bloques.push({ tipo: t, idxs });
          i += idxs.length;
        } else {
          bloques.push({ tipo: t, idxs: [i] });
          i++;
        }
      }
      return bloques;
    }

    function resumenDia(dia) {
      const diaNorm = normalizarDia(dia);
      const ejs = (estadoGlobal.rutinaActual || []).filter(r => normalizarDia(r.dia) === diaNorm);
      const bases = basesEjerciciosDia(ejs);
      const hechos = ejs.filter((r, i) => estadoEjercicioSemana(diaNorm, bases[i], r).completo).length;
      return { ejs, bases, hechos, diaNorm };
    }

    function construirHistorialRutinas(historial) {
      if (!historial || !historial.length) return '';
      const filas = historial.map(h => `
        <div class="flex items-center gap-3 py-2.5 border-b border-slate-800 last:border-0">
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold ${h.activa ? 'text-white' : 'text-slate-300'} truncate">${escHtml(h.nombreRutina)}</p>
            <p class="text-[11px] text-slate-400">${h.total} ejercicio${h.total === 1 ? '' : 's'}</p>
          </div>
          ${h.activa
            ? '<span class="shrink-0 text-[11px] font-black uppercase text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 px-2 py-1 rounded-full">● Activa</span>'
            : `<button onclick="activarRutinaHistorial('${escHtml(h.idRutina)}')" class="shrink-0 text-xs font-bold text-sky-300 bg-sky-500/10 border border-sky-500/40 px-3 py-1.5 rounded-lg active:scale-95 transition">Activar</button>`}
        </div>`).join('');
      return `
        <details class="mt-4 bg-slate-950 border border-slate-800 rounded-xl">
          <summary class="cursor-pointer select-none flex items-center justify-between gap-2 px-4 py-3 text-xs font-bold text-slate-300">
            <span>${ico('folder-open', 'w-4 h-4')} Historial de rutinas <span class="text-slate-400 font-semibold">(${historial.length})</span></span>
            <span class="text-[11px] text-slate-400 font-semibold">Toca para ver</span>
          </summary>
          <div class="px-4 pb-2">${filas}</div>
        </details>`;
    }

    function construirResumenRutinaCoach(rutina, historial) {
      rutina = Array.isArray(rutina) ? rutina : [];
      const nombre = rutina.length ? (rutina[0].nombreRutina || 'Rutina') : '';
      const chips = DIAS_SEMANA.map(dia => {
        const r = resumenDia(dia), n = r.ejs.length;
        const completo = n > 0 && r.hechos >= n;
        return `
          <button type="button" onclick="seleccionarDiaResumen('${dia}')" data-dia="${r.diaNorm}" data-n="${n}"
            class="chip-dia-resumen rounded-xl border py-2 text-center transition active:scale-95">
            <span class="block text-[11px] font-black tracking-wider">${DIAS_ABREV_RESUMEN[r.diaNorm] || dia.slice(0, 3)}</span>
            <span class="block text-xs font-bold mt-0.5">${n ? (completo ? '✓ ' : '') + n : '—'}</span>
          </button>`;
      }).join('');
      const cuerpo = rutina.length ? `
          ${accionesRutinaCoach(rutina)}
          <div class="grid grid-cols-7 gap-1.5 mb-3">${chips}</div>
          <div id="barraSemanal" class="mb-3"></div>
          <div id="detalleResumenDia"></div>`
        : `
          <div class="py-8 text-center bg-slate-950 rounded-xl border border-dashed border-slate-700">
            <p class="text-3xl mb-2">${ico('inbox', 'w-8 h-8')}</p>
            <p class="text-sm font-bold text-slate-200">Este alumno no tiene una rutina activa</p>
            <p class="text-xs text-slate-400 mt-1 px-4">Asígnale una desde «Crear rutina» o activa una del historial.</p>
          </div>`;
      return `
        <div id="bloqueRutinaCoach" class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-lg">
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="min-w-0">
              <p class="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">Rutina asignada</p>
              <h3 class="text-base sm:text-lg font-extrabold text-white leading-tight">${escHtml(nombre || 'Sin rutina activa')}</h3>
              ${rutina.length ? `<p class="text-xs text-slate-400 mt-0.5">${rutina.length} ejercicios · ${DIAS_SEMANA.filter(d => resumenDia(d).ejs.length).length} días de entrenamiento</p>` : ''}
            </div>
            ${rutina.length ? '<span class="shrink-0 text-[11px] font-black uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded-full">● Activa</span>' : ''}
          </div>
          ${cuerpo}
          ${construirHistorialRutinas(historial)}
        </div>`;
    }

    function filaResumenEjercicio(r, numero, diaNorm, base, enGrupo) {
      const est = estadoEjercicioSemana(diaNorm, base, r);
      const tipo = clasificarTipoSerie(r.tipoEjercicio);
      const tempo = `${r.excentrica || 0}-${r.pausaExcentrica || 0}-${r.concentrica || 0}-${r.pausaConcentrica || 0}`;
      const hp = historialPesoEjercicio(diaNorm, base);
      let peso = '<span class="text-slate-400">Sin pesos registrados aún</span>';
      if (hp.ultimo) {
        const d = hp.previo ? Math.round((hp.ultimo.kg - hp.previo.kg) * 10) / 10 : null;
        const tendencia = d === null ? ''
          : d > 0 ? `<span class="text-emerald-400 font-bold">▲ +${fmtKg(d)}</span>`
          : d < 0 ? `<span class="text-rose-400 font-bold">▼ ${fmtKg(d)}</span>`
          : '<span class="text-slate-400 font-bold">= igual</span>';
        peso = `<span class="text-slate-400">Sem. ${hp.ultimo.numero}:</span> <span class="font-extrabold text-white">${fmtKg(hp.ultimo.kg)} kg</span> ${tendencia}`;
      }
      const chip = (t, cls) => `<span class="text-[11px] font-bold px-1.5 py-0.5 rounded-md border ${cls}">${t}</span>`;
      const chips = [
        r.musculo ? chip(escHtml(String(r.musculo).toUpperCase()), 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30') : '',
        chip(`${escHtml(r.serie || '—')} × ${escHtml(r.repeticiones || '—')}`, 'bg-slate-800 text-white border-slate-700'),
        chip('' + ico('timer', 'w-4 h-4') + ' ' + escHtml(tempo), 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-mono'),
        chip('' + ico('pause', 'w-4 h-4') + ' ' + escHtml(r.descanso || 0) + 's', 'bg-slate-800 text-slate-300 border-slate-700'),
        (!enGrupo && ETIQUETA_TIPO[tipo]) ? chip(ETIQUETA_TIPO[tipo], 'bg-sky-500/10 text-sky-300 border-sky-500/30') : ''
      ].join('');
      const datos = `data-id="${escHtml(r.idEjercicio)}" data-nombre="${escHtml(r.ejercicio)}" data-media="${escHtml(r.media)}"
        onclick="abrirModalEjercicio(this.dataset.id, this.dataset.nombre, this.dataset.media)"`;
      const mini = r.media
        ? `<button type="button" ${datos} title="Ver GIF y técnica" class="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-slate-700 overflow-hidden p-0.5 active:scale-95 transition">
             <img src="${urlMini(r.media)}" alt="" loading="lazy" decoding="async" class="w-full h-full object-contain"></button>`
        : '<span class="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">' + ico('dumbbell', 'w-7 h-7') + '</span>';
      const estado = est.completo
        ? '<span class="shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm" title="Completado esta semana">✓</span>'
        : est.hechas > 0
          ? `<span class="shrink-0 w-8 h-8 rounded-full border-2 border-amber-500/60 text-amber-300 flex items-center justify-center font-black text-[11px]" title="Series hechas esta semana">${est.hechas}/${est.total}</span>`
          : '<span class="shrink-0 w-8 h-8 rounded-full border-2 border-slate-700" title="Pendiente esta semana"></span>';
      return `
        <div class="flex items-center gap-3 ${enGrupo ? 'bg-slate-950/80 rounded-xl p-2.5' : ''}">
          ${mini}
          <div class="min-w-0 flex-1">
            <p class="text-[13px] font-extrabold text-white uppercase leading-tight line-clamp-2"><span class="text-slate-400">${numero}.</span> ${escHtml(r.ejercicio || 'Ejercicio')}</p>
            <div class="flex flex-wrap gap-1 mt-1.5">${chips}</div>
            <p class="text-xs mt-1.5">${peso}</p>
          </div>
          ${estado}
        </div>`;
    }

    function seleccionarDiaResumen(dia) {
      estadoGlobal.diaSeleccionado = dia;
      const diaNorm = normalizarDia(dia);
      document.querySelectorAll('.chip-dia-resumen').forEach(b => {
        const activo = b.dataset.dia === diaNorm, tiene = b.dataset.n !== '0';
        b.className = 'chip-dia-resumen rounded-xl border py-2 text-center transition active:scale-95 ' +
          (activo ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : tiene ? 'bg-slate-950 text-slate-200 border-slate-700 hover:border-slate-500'
                          : 'bg-slate-950/40 text-slate-400 border-slate-800');
      });
      actualizarEstadoSubida();
      const cont = document.getElementById('detalleResumenDia');
      if (!cont) return;
      const { ejs, bases, hechos } = resumenDia(dia);
      if (!ejs.length) {
        cont.innerHTML = `
          <div class="py-6 text-center bg-slate-950 rounded-xl border border-slate-800">
            <p class="text-sm font-bold text-emerald-400">${ico('bed', 'w-4 h-4')} ${escHtml(nombreDia(dia))}: descanso</p>
            <p class="text-xs text-slate-400 mt-1">No hay ejercicios programados este día.</p>
          </div>`;
        return;
      }
      const musculos = [...new Set(ejs.map(r => String(r.musculo || '').trim().toUpperCase()).filter(Boolean))];
      const series = ejs.reduce((a, r) => a + cuantasSeries(r), 0);
      const pct = Math.round(hechos / ejs.length * 100);
      const bloques = agruparEjerciciosResumen(ejs).map(b => {
        if (b.idxs.length > 1 || b.tipo === 'BISERIE' || b.tipo === 'TRISERIE') {
          const filas = b.idxs.map(i => filaResumenEjercicio(ejs[i], i + 1, diaNorm, bases[i], true)).join('');
          return `
            <div class="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-2 space-y-2">
              <p class="text-[11px] font-black text-sky-300 uppercase tracking-wider px-1 pt-0.5">${ico('zap', 'w-4 h-4')} ${ETIQUETA_TIPO[b.tipo] || 'Grupo'} · sin descanso entre ejercicios</p>
              ${filas}
            </div>`;
        }
        const i = b.idxs[0];
        return `<div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">${filaResumenEjercicio(ejs[i], i + 1, diaNorm, bases[i], false)}</div>`;
      }).join('');
      cont.innerHTML = `
        <div class="flex items-end justify-between gap-3 mb-2">
          <div class="min-w-0">
            <p class="text-sm font-extrabold text-white">${escHtml(nombreDia(dia))} <span class="text-slate-400 font-semibold">· ${ejs.length} ejercicios · ${series} series</span></p>
            <p class="text-xs text-emerald-300/90 font-semibold mt-0.5 truncate">${escHtml(musculos.join(' · '))}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-lg font-black leading-none ${pct === 100 ? 'text-emerald-400' : 'text-white'}">${hechos}/${ejs.length}</p>
            <p class="text-[11px] text-slate-400 uppercase font-bold mt-1">esta semana</p>
          </div>
        </div>
        <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4"><div class="h-full bg-emerald-500 rounded-full transition-all" style="width:${pct}%"></div></div>
        <div class="space-y-2">${bloques}</div>
        <p class="text-[11px] text-slate-400 mt-3 text-center">Toca la miniatura para ver el GIF y la técnica · ✓ completado · n/n series hechas esta semana</p>`;
    }

    function pintarResumenRutinaCoach() {
      const b = document.getElementById('bloqueRutinaCoach');
      if (b) b.outerHTML = construirResumenRutinaCoach(estadoGlobal.rutinaActual, estadoGlobal.historialRutinas);
      seleccionarDiaResumen(estadoGlobal.diaSeleccionado);
    }

    /** Reactiva una rutina anterior del historial (el alumno pasa a verla). */
    function activarRutinaHistorial(idRutina) {
      const idAlumno = (estadoGlobal.checkinsCoach || {}).idAlumno;
      if (!idAlumno || !idRutina) return;
      const h = (estadoGlobal.historialRutinas || []).find(x => x.idRutina === idRutina);
      confirmar(`¿Activar «${h ? h.nombreRutina : 'esta rutina'}»?\n\nEl alumno dejará de ver su rutina actual y verá esta. Su progreso no se borra.`,
        { titulo: 'Activar rutina', textoSi: 'Activar' }).then(ok => { if (ok) activarRutinaHistorialConfirmado(idRutina, idAlumno); });
    }
    function activarRutinaHistorialConfirmado(idRutina, idAlumno) {
      GS().withSuccessHandler(res => {
        if (!res || !res.success) return avisar((res && res.error) || 'No se pudo activar la rutina.', 'error');
        estadoGlobal.rutinaActual = res.rutina || [];
        estadoGlobal.historialRutinas = res.historialRutinas || [];
        pintarResumenRutinaCoach();
        mostrarToast('✅ ' + res.mensaje);
      }).activarRutina(idRutina, idAlumno);
    }

    // ==================== CONSTRUCTORES HTML DE RUTINA E HISTORIAL ====================
    function construirBloqueRutinaHTML(rutina) {
      rutina = Array.isArray(rutina) ? rutina : [];
      const botonesDiasHTML = DIAS_SEMANA.map(dia => {
        const tieneEjercicios = rutina.some(r => normalizarDia(r.dia) === normalizarDia(dia));
        const indicador = tieneEjercicios ? `<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-1.5 shrink-0"></span>` : `<span class="w-2 h-2 rounded-full bg-slate-700 inline-block ml-1.5 shrink-0"></span>`;
        return `<button onclick="seleccionarDiaRutina('${dia}')" id="btn-dia-${normalizarDia(dia)}" class="btn-dia-semana shrink-0 flex items-center justify-center px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all">${dia} ${indicador}</button>`;
      }).join('');

      return `
        <div class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-lg">
          <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div>
              <h3 class="text-base sm:text-lg font-extrabold text-emerald-400 uppercase tracking-wider">Rutina de Entrenamiento Asignada</h3>
              <p class="text-xs text-slate-400">Selecciona el día, toca tu descanso para activar el cronómetro y registra tus cargas</p>
            </div>
            <div id="contadorProgresoRutina" class="text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400"></div>
          </div>
          ${accionesRutinaCoach(rutina)}

          <div class="flex md:grid md:grid-cols-7 gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
            ${botonesDiasHTML}
          </div>

          <div id="barraSemanal" class="mb-3"></div>
          <div id="detalleRutinaDia" class="bg-slate-950 rounded-xl border border-slate-800 p-3 sm:p-4"></div>
        </div>
      `;
    }

    function generarTarjetasDelta(progreso) {
      if (progreso.length < 2) {
        return '<div class="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">Se requieren al menos 2 controles para calcular tus variaciones (Delta).</div>';
      }
      
      const inicial = progreso[0];
      const actual = progreso[progreso.length - 1];
      
      const calcDelta = (key, label, unidad, invertido = false) => {
        const valIni = parseFloat(inicial[key]) || 0;
        const valAct = parseFloat(actual[key]) || 0;
        if (!valIni || !valAct) return '';
        
        const diff = (valAct - valIni).toFixed(1);
        const diffNum = parseFloat(diff);
        if (diffNum === 0) return ''; 
        
        let colorClase = 'text-slate-400';
        let icono = '' + ico('minus', 'w-4 h-4') + '';
        let bgClase = 'bg-slate-950 border-slate-800';
        
        if (diffNum > 0) {
          colorClase = invertido ? 'text-rose-400' : 'text-emerald-400';
          icono = invertido ? '' + ico('trending-up', 'w-4 h-4') + '' : '' + ico('flame', 'w-4 h-4') + '';
          bgClase = invertido ? 'bg-rose-950/20 border-rose-500/20' : 'bg-emerald-950/20 border-emerald-500/20';
        } else if (diffNum < 0) {
          colorClase = invertido ? 'text-emerald-400' : 'text-rose-400';
          icono = invertido ? '' + ico('flame', 'w-4 h-4') + '' : '' + ico('trending-down', 'w-4 h-4') + '';
          bgClase = invertido ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-rose-950/20 border-rose-500/20';
        }
        
        return `
          <div onclick="abrirGraficoDelta('${key}', '${label}', '${unidad}')" class="p-4 rounded-xl border flex flex-col justify-between shadow-lg transition-all cursor-pointer hover:scale-[1.03] ${bgClase}">
            <span class="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">${label}</span>
            <div class="flex items-end justify-between">
              <div>
                <span class="text-2xl font-black text-white leading-none block">${valAct}<span class="text-xs text-slate-400">${unidad}</span></span>
                <span class="text-[11px] text-slate-400 line-through mt-1 block">Antes: ${valIni}${unidad}</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-xl mb-0.5">${icono}</span>
                <span class="text-sm font-black ${colorClase}">${diffNum > 0 ? '+' : ''}${diff}${unidad}</span>
              </div>
            </div>
          </div>
        `;
      };

      const tarjetas = [
        calcDelta('peso', 'Peso Total', 'kg', true),
        calcDelta('grasaCorporal', '% Grasa', '%', true),
        calcDelta('cintura', 'Cintura', 'cm', true), 
        calcDelta('pecho', 'Pecho', 'cm', false),
        calcDelta('hombros', 'Hombros', 'cm', false),
        calcDelta('brazoFlexionado', 'Brazo (Flex)', 'cm', false),
        calcDelta('gluteos', 'Glúteos', 'cm', false),
        calcDelta('muslo', 'Muslos', 'cm', false)
      ].filter(t => t !== '').join('');

      return tarjetas 
        ? `<div class="grid grid-cols-2 md:grid-cols-4 gap-3">${tarjetas}</div>` 
        : '<p class="text-slate-400 text-xs">Sin variaciones registradas aún.</p>';
    }
    
    function construirBloqueHistorialHTML(progreso) {
      progreso = Array.isArray(progreso) ? progreso : [];
      const tienePliegues = progreso.some(p => parseFloat(p.tricipital) > 0 || parseFloat(p.subescapular) > 0);
      
      const opcionesFecha = progreso.map((p, idx) => `<option value="${idx}">${p.fecha} (Peso: ${p.peso || '-'} kg | Grasa: ${p.grasaCorporal || '-'}%)</option>`).join('');
      
      const htmlComparador = progreso.length > 0 ? `
        <div class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800">
          <div class="flex flex-wrap justify-between items-center mb-4 gap-3">
            <h4 class="text-sm sm:text-base font-bold text-emerald-400 uppercase tracking-wider">Comparativa Visual (Antes vs. Después)</h4>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <label class="text-xs text-slate-400 shrink-0">Ángulo:</label>
              <select id="selAnguloFoto" onchange="actualizarComparacionFotos()" class="w-full sm:w-auto p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-emerald-400">
                <option value="urlFrente">Frente</option><option value="urlPerfil">Perfil</option><option value="urlEspalda">Espalda</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label class="block text-xs text-slate-400 mb-1">Inicial (Antes)</label><select id="selFotoAntes" onchange="actualizarComparacionFotos()" class="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl mb-3 text-sm">${opcionesFecha}</select><div id="cardFotoAntes" class="bg-slate-950 p-3 sm:p-4 rounded-xl text-center min-h-[280px] flex flex-col items-center justify-center border border-slate-800 cursor-pointer" onclick="abrirModalFotoCompleta(this)"></div></div>
            <div><label class="block text-xs text-slate-400 mb-1">Reciente (Después)</label><select id="selFotoDespues" onchange="actualizarComparacionFotos()" class="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl mb-3 text-sm">${opcionesFecha}</select><div id="cardFotoDespues" class="bg-slate-950 p-3 sm:p-4 rounded-xl text-center min-h-[280px] flex flex-col items-center justify-center border border-slate-800 cursor-pointer" onclick="abrirModalFotoCompleta(this)"></div></div>
          </div>
        </div>
      ` : '<div class="p-6 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-sm">Sin fotos registradas.</div>';

      const filasPerimetros = progreso.map(p => `
        <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 whitespace-nowrap">
          <td class="p-3 font-bold text-emerald-400">${p.fecha}</td><td class="p-3 font-semibold">${p.peso} kg</td><td class="p-3">${p.imc}</td><td class="p-3 font-semibold text-amber-400">${p.grasaCorporal}%</td><td class="p-3">${p.pecho}</td><td class="p-3">${p.hombros}</td><td class="p-3">${p.brazoRelajado} / ${p.brazoFlexionado}</td><td class="p-3 font-semibold text-emerald-300">${p.cintura}</td><td class="p-3">${p.cadera}</td><td class="p-3">${p.gluteos}</td><td class="p-3">${p.muslo}</td><td class="p-3">${p.pantorrilla}</td>
        </tr>
      `).join('');
      const tarjetasPerimetros = progreso.slice().reverse().map(p => {
        const m = (et, v, u) => `<div class="bg-slate-950 rounded-lg px-2 py-1.5"><p class="text-[11px] text-slate-400 font-bold uppercase">${et}</p><p class="text-sm font-extrabold text-white">${(v === '' || v === undefined || v === null) ? '—' : v}<span class="text-[11px] text-slate-400 font-semibold"> ${u}</span></p></div>`;
        return `<div class="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div class="flex items-center justify-between mb-2"><span class="text-xs font-extrabold text-emerald-400">${p.fecha}</span><span class="text-xs font-bold text-amber-400">${p.grasaCorporal}% grasa</span></div>
          <div class="grid grid-cols-3 gap-1.5">${m('Peso', p.peso, 'kg')}${m('IMC', p.imc, '')}${m('Pecho', p.pecho, 'cm')}${m('Hombros', p.hombros, 'cm')}${m('Brazo', (p.brazoRelajado || '') + ' / ' + (p.brazoFlexionado || ''), 'cm')}${m('Cintura', p.cintura, 'cm')}${m('Cadera', p.cadera, 'cm')}${m('Glúteos', p.gluteos, 'cm')}${m('Muslo', p.muslo, 'cm')}${m('Pantorrilla', p.pantorrilla, 'cm')}</div>
        </div>`;
      }).join('');
      return `
      <div class="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
          <h3 class="text-base sm:text-lg font-extrabold text-emerald-400 uppercase tracking-wider mb-1">Análisis de Progreso y Evolución</h3>
          <p class="text-xs text-slate-400 mb-4">Selecciona el módulo que deseas inspeccionar en detalle:</p>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
            <button onclick="cambiarSeccionProgreso('secPerimetros')" id="btn-secPerimetros" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-lg">
              <div class="text-xs sm:text-sm">${ico('ruler', 'w-4 h-4')} Progreso General y Medidas</div>
            </button>
            
            ${tienePliegues ? `
              <button onclick="cambiarSeccionProgreso('secPliegues')" id="btn-secPliegues" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 font-semibold">
                <div class="text-xs sm:text-sm">${ico('ruler', 'w-4 h-4')} Pliegues Cutáneos (mm)</div>
              </button>
            ` : ''}
            
            <button onclick="cambiarSeccionProgreso('secComparativa')" id="btn-secComparativa" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 font-semibold">
              <div class="text-xs sm:text-sm">${ico('images', 'w-4 h-4')} Comparativa Visual (Antes vs. Después)</div>
            </button>
            
            <button onclick="cambiarSeccionProgreso('secSemanal')" id="btn-secSemanal" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 font-semibold">
              <span class="block text-xs uppercase tracking-wider">${ico('calendar', 'w-4 h-4')} Progreso Semanal</span><span class="block text-xs font-normal text-slate-400 mt-0.5">Cargas en el Gym</span>
            </button>
          </div>

          <div id="secPerimetros" class="seccion-progreso-detalle space-y-6">
            <!-- B2: gráficos de línea del historial (antes los canvas no existían y nunca se dibujaban) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div class="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
                <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3">${ico('trending-up', 'w-4 h-4')} Evolución del Peso Corporal</h4>
                <div class="relative h-60 sm:h-64"><canvas id="chartPeso"></canvas></div>
              </div>
              <div class="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
                <h4 class="text-xs font-extrabold uppercase tracking-wider text-sky-400 mb-3">${ico('chart-column', 'w-4 h-4')} Composición Corporal (grasa, IMC y masa)</h4>
                <div class="relative h-60 sm:h-64"><canvas id="chartComposicion"></canvas></div>
              </div>
            </div>
            <div class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-lg">
              <div class="mb-4">
                <h4 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-400">${ico('flame', 'w-4 h-4')} Tarjetas Delta de Progreso</h4>
                <p class="text-xs text-slate-400">Toca cualquier tarjeta para visualizar su gráfico de evolución.</p>
              </div>
              ${generarTarjetasDelta(progreso)}
            </div>
            
            <div class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 mt-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Historial Detallado de Perímetros</h4>
              <div class="md:hidden space-y-3">${tarjetasPerimetros}</div>
              <div class="hidden md:block overflow-x-auto"><table class="w-full text-left text-xs"><thead><tr class="border-b border-slate-800 text-slate-300 bg-slate-950"><th class="p-3">Fecha</th><th class="p-3">Peso</th><th class="p-3">IMC</th><th class="p-3">% Grasa</th><th class="p-3">Pecho</th><th class="p-3">Hombros</th><th class="p-3">Brazo</th><th class="p-3">Cintura</th><th class="p-3">Cadera</th><th class="p-3">Glúteos</th><th class="p-3">Muslo</th><th class="p-3">Pantorrilla</th></tr></thead><tbody>${filasPerimetros}</tbody></table></div>
            </div>
          </div>

          <div id="secPliegues" class="seccion-progreso-detalle hidden space-y-6">
             <div class="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
               <h4 class="text-xs font-extrabold uppercase tracking-wider text-purple-400 mb-1">${ico('ruler', 'w-4 h-4')} Evolución de Pliegues Cutáneos</h4>
               <p class="text-xs text-slate-400 mb-3">Mediciones con plicómetro (mm) por fecha de evaluación.</p>
               <div class="relative h-64 sm:h-72"><canvas id="chartPliegues"></canvas></div>
             </div>
          </div>

          <div id="secSemanal" class="seccion-progreso-detalle hidden"><div id="contSemanal"></div></div>

          <div id="secComparativa" class="seccion-progreso-detalle hidden">
            ${htmlComparador}
          </div>
        </div>
      `;
    }

    // ==================== CRONÓMETRO (5s a 120s) Y 1RM ====================
    let cronometroSegundos = 0;
    let cronometroFin = 0;            // hora exacta (ms) en que termina: no se atrasa aunque el teléfono pause la página
    function iniciarCronometro(segundos) {
      if (!segundos || segundos <= 0) return;
      detenerCronometro();
      prepararAudio();                // se hace con el toque del usuario para que luego pueda sonar
      estadoGlobal.avisoDescansoPendiente = false;
      cronometroFin = Date.now() + segundos * 1000;
      cronometroSegundos = segundos;
      actualizarDisplayCronometro();
      cerrarHojaCronometro();
      estadoGlobal.timerInterval = setInterval(tickCronometro, 250);
    }
    function tickCronometro() {
      if (!cronometroFin) return;
      const resta = Math.max(0, Math.ceil((cronometroFin - Date.now()) / 1000));
      if (resta !== cronometroSegundos) { cronometroSegundos = resta; actualizarDisplayCronometro(); }
      if (resta <= 0) {
        detenerCronometro(true);
        // Con la app en segundo plano el aviso se da al volver (en Android, además, suena la notificación)
        if (document.hidden) estadoGlobal.avisoDescansoPendiente = true;
        else avisarFinDescanso();
      }
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      if (cronometroFin) tickCronometro();   // al volver, ponerse al día con la hora real
      if (estadoGlobal.avisoDescansoPendiente) { estadoGlobal.avisoDescansoPendiente = false; avisarFinDescanso(); }
    });
    function abrirHojaCronometro() { document.getElementById('hojaCronometro').classList.remove('hidden'); }
    function cerrarHojaCronometro() { document.getElementById('hojaCronometro').classList.add('hidden'); }
    function detenerCronometro(terminado) {
      if (estadoGlobal.timerInterval) clearInterval(estadoGlobal.timerInterval);
      estadoGlobal.timerInterval = null;
      cronometroFin = 0;
      cronometroSegundos = 0;
      actualizarDisplayCronometro();
      const sel = document.getElementById('selectSegundosTimer');
      if (sel) sel.value = "0";
    }
    function actualizarDisplayCronometro() {
      const min = String(Math.floor(cronometroSegundos / 60)).padStart(2, '0');
      const sec = String(cronometroSegundos % 60).padStart(2, '0');
      const el = document.getElementById('cronometroDisplay');
      if (el) el.innerText = `${min}:${sec}`;
      const fab = document.getElementById('cronometroFab');
      if (fab) { fab.textContent = `${min}:${sec}`; fab.classList.toggle('hidden', cronometroSegundos <= 0); }
    }

    function abrirModal1RM() { document.getElementById('modal1RM').classList.remove('hidden'); }
    function cerrarModal1RM() { document.getElementById('modal1RM').classList.add('hidden'); document.getElementById('rmResultadoCont').classList.add('hidden'); }
    function calcular1RM() {
      const p = parseFloat(document.getElementById('rmPeso').value);
      const r = parseFloat(document.getElementById('rmReps').value);
      if (!p || !r || p <= 0 || r <= 0) return avisar('Ingresa valores válidos.', 'atencion');
      const rm = p * (1 + r / 30);
      document.getElementById('rmValorFinal').innerText = `${rm.toFixed(1)} kg`;
      document.getElementById('rmResultadoCont').classList.remove('hidden');
    }

    // ==================== GRÁFICOS SEPARADOS CON EJES Y AJUSTADOS ====================
    function inicializarGraficosSeparados() {
      const progreso = estadoGlobal.progresoActual;
      if (!progreso || progreso.length === 0) return;
      const labels = progreso.map(p => p.fecha);

      Object.values(estadoGlobal.charts).forEach(c => { if (c) c.destroy(); });

      const crearCtx = (id, datasetConfig, unidadLabel, opcionesEjeY = {}) => {
        const ctx = document.getElementById(id);
        if (!ctx) return null;
        return new Chart(ctx, {
          type: 'line',
          data: { labels, datasets: datasetConfig },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                display: datasetConfig.length > 1,
                position: 'bottom',
                labels: { color: '#cbd5e1', font: { size: 11, weight: 'bold' }, boxWidth: 12, padding: 14 }
              },
              tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#10b981',
                bodyColor: '#f1f5f9',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 10
              }
            },
            scales: {
              x: {
                grid: { color: '#1e293b' },
                ticks: { color: '#cbd5e1', font: { size: 10 } }
              },
              y: {
                beginAtZero: false,
                grace: '8%',
                grid: { color: '#1e293b' },
                ticks: { color: '#94a3b8', font: { size: 10 } },
                title: { display: true, text: unidadLabel, color: '#64748b', font: { size: 10 } },
                ...opcionesEjeY
              }
            }
          }
        });
      };

      const mapearSeries = (indicadores, grosor = 2.5, rellenar = false) => indicadores.map(ind => ({
        label: ind.label,
        data: progreso.map(p => {
          const v = parseFloat(p[ind.key]);
          return isNaN(v) || v === 0 ? null : v;
        }),
        borderColor: ind.color,
        backgroundColor: ind.color + '20',
        borderWidth: grosor,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: rellenar,
        tension: 0.3,
        spanGaps: true
      }));

      // Gráfico de Peso y Composición
      estadoGlobal.charts.peso = crearCtx('chartPeso', mapearSeries(INDICADORES_PESO, 3, true), 'Kilogramos (kg)');
      estadoGlobal.charts.composicion = crearCtx('chartComposicion', mapearSeries(INDICADORES_COMPOSICION, 2.5), 'Porcentaje (%) / Unidades');

      // Gráfico de Pliegues (Se renderiza solo si el elemento existe en el DOM)
      if (document.getElementById('chartPliegues')) {
        estadoGlobal.charts.pliegues = crearCtx('chartPliegues', mapearSeries(INDICADORES_PLIEGUES, 2.5), 'Milímetros (mm)');
      }
    }

    // ==================== TARJETAS DE RUTINA (AGRUPACIÓN DE BI-SERIE, TRI-SERIE Y DROP SET) ====================
    function clasificarTipoSerie(tipoRaw) {
      const t = normalizarDia(tipoRaw || 'NORMAL');
      if (t.includes('TRI')) return 'TRISERIE';
      if (t.includes('BI') || t.includes('SUPER')) return 'BISERIE';
      if (t.includes('DROP') || t.includes('DROT')) return 'DROPSET';
      if (t.includes('ASCENDING')) return 'ASCENDING';
      if (t.includes('PIRAMIDE')) return 'PIRAMIDE';
      return 'NORMAL';
    }

    /** Agrupa los ejercicios del día: bi-series de 2, tri-series de 3 y fichas especiales (drop set, ascendente, pirámide). */
    function agruparBloquesDia(ejerciciosDia) {
      const bloques = [];
      let i = 0;
      while (i < ejerciciosDia.length) {
        const actual = ejerciciosDia[i];
        const tipoClasificado = clasificarTipoSerie(actual.tipoEjercicio);

        if (tipoClasificado === 'BISERIE') {
          const itemsGrupo = [{ data: actual, idx: i }];
          if (i + 1 < ejerciciosDia.length && clasificarTipoSerie(ejerciciosDia[i + 1].tipoEjercicio) === 'BISERIE') {
            itemsGrupo.push({ data: ejerciciosDia[i + 1], idx: i + 1 });
            i += 2;
          } else {
            i += 1;
          }
          bloques.push({ tipo: 'GRUPO', subtipo: 'BISERIE', items: itemsGrupo });
        } else if (tipoClasificado === 'TRISERIE') {
          const itemsGrupo = [{ data: actual, idx: i }];
          let k = 1;
          while (k < 3 && (i + k) < ejerciciosDia.length && clasificarTipoSerie(ejerciciosDia[i + k].tipoEjercicio) === 'TRISERIE') {
            itemsGrupo.push({ data: ejerciciosDia[i + k], idx: i + k });
            k++;
          }
          i += k;
          bloques.push({ tipo: 'GRUPO', subtipo: 'TRISERIE', items: itemsGrupo });
        } else if (tipoClasificado === 'DROPSET' || tipoClasificado === 'ASCENDING' || tipoClasificado === 'PIRAMIDE') {
          bloques.push({ tipo: tipoClasificado, item: { data: actual, idx: i } });
          i++;
        } else {
          bloques.push({ tipo: 'NORMAL', item: { data: actual, idx: i } });
          i++;
        }
      }
      return bloques;
    }

    function seleccionarDiaRutina(dia) {
      estadoGlobal.diaSeleccionado = dia;
      const diaNorm = normalizarDia(dia);

      document.querySelectorAll('.btn-dia-semana').forEach(btn => {
        btn.className = 'btn-dia-semana shrink-0 flex items-center justify-center px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800';
      });
      const btnActivo = document.getElementById(`btn-dia-${diaNorm}`);
      if (btnActivo) {
        btnActivo.className = 'btn-dia-semana shrink-0 flex items-center justify-center px-4 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider border transition-all bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20';
      }

      const ejerciciosDia = estadoGlobal.rutinaActual.filter(r => normalizarDia(r.dia) === diaNorm);
      actualizarEstadoSubida();
      const contenedor = document.getElementById('detalleRutinaDia');
      const contador = document.getElementById('contadorProgresoRutina');
      if (!contenedor || !contador) return;

      if (ejerciciosDia.length === 0) {
        contador.innerText = `${dia}: Descanso`;
        contenedor.innerHTML = `
          <div class="py-8 px-4 text-center">
            <p class="text-emerald-400 font-bold text-sm sm:text-base mb-1">${ico('bed', 'w-4 h-4')} Día de Descanso / Recuperación Activa</p>
            <p class="text-slate-400 text-xs">No tienes ejercicios programados para el día ${dia}. Mantén tu hidratación y nutrición al día.</p>
          </div>
        `;
        return;
      }

      const hoyKey = fechaLocalISO();
      const userId = estadoGlobal.user ? estadoGlobal.user.id : 'COACH';
      const basesDia = basesEjerciciosDia(ejerciciosDia);
      const kp = (idx, campo) => diaNorm + '|' + basesDia[idx] + '::' + campo;
      let completados = 0;

      // 1. Contar ejercicios completados del día
      ejerciciosDia.forEach((r, idx) => {
        if (leerProg(kp(idx, 'ok')) === 'true') { completados++; return; }
        const nS = cuantasSeries(r);
        let hechas = 0;
        for (let n = 1; n <= nS; n++) if (leerProg(kp(idx, 's' + n + '_ok')) === 'true') hechas++;
        if (nS > 0 && hechas >= nS) completados++;
      });

      // 2. Agrupar automáticamente Bi-Series (de 2 en 2) y Tri-Series (de 3 en 3)
      const bloques = agruparBloquesDia(ejerciciosDia);

      // 3. Renderizar cada bloque según su diseño visual
      const tarjetasHTML = bloques.map(bloque => {
        
        // ==================== CASO A: CONTENEDOR DE BI-SERIE O TRI-SERIE ====================
        if (bloque.tipo === 'GRUPO') {
          const esTri = bloque.subtipo === 'TRISERIE';
          const tituloGrupo = esTri ? 'TRI-SERIE (3 EJERCICIOS SEGUIDOS)' : 'SÚPER SERIE / BI-SERIE (2 EJERCICIOS)';
          const badgeGrupo = esTri ? '' + ico('flame', 'w-4 h-4') + ' TRI-SERIE' : '' + ico('zap', 'w-4 h-4') + ' SÚPER SERIE';
          const colorBorde = esTri ? 'border-purple-500/70 shadow-purple-500/10' : 'border-emerald-500/80 shadow-emerald-500/10';
          const colorBadge = esTri ? 'bg-purple-500 text-slate-950' : 'bg-emerald-400 text-slate-950';

          const musculosUnicos = [...new Set(bloque.items.map(it => it.data.musculo))].join(' + ');
          const seriesGrupo = bloque.items[0].data.serie || 3;
          
          const ultimoItem = bloque.items[bloque.items.length - 1].data;
          const descansoFinal = parseInt(ultimoItem.descanso) || 90;

          const subTarjetasHTML = bloque.items.map((it, pos) => {
            const r = it.data;
            const idx = it.idx;
            const storageKey = kp(idx, 'ok');
            const loadStorageKey = kp(idx, 'carga');
            const estaMarcado = leerProg(storageKey) === 'true';
            const pesoAnterior = leerProg(loadStorageKey) || '';
            const esUltimo = pos === bloque.items.length - 1;

            return `
              <div class="border ${estaMarcado ? 'border-emerald-500/50 bg-emerald-950/10 opacity-75' : 'bg-slate-900/95 border-slate-800'} rounded-xl p-3.5 transition-all">
                <div class="flex justify-between items-start gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-xs flex items-center justify-center">${pos + 1}.</span>
                      <h5 class="text-sm sm:text-base font-black text-white tracking-wide uppercase ${estaMarcado ? 'line-through text-slate-400' : ''}">${escHtml(r.ejercicio)}</h5>
                    </div>
                    <div class="pl-8">${chipTecnica(r)}</div>
                  </div>
                  <button aria-label="Marcar ejercicio como completado" onclick="alternarCheckEjercicio('${storageKey}', ${idx})" 
                    class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all shrink-0 ${estaMarcado ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-emerald-500'}">
                    ✓
                  </button>
                </div>

                ${gifEj(r)}

                ${filaEspecs(r, parseInt(r.descanso) || 0)}
                ${tablaSeries(r, idx, kp, diaNorm)}
              </div>

              ${!esUltimo ? `
                <div class="flex items-center gap-3 py-1.5 pl-6">
                  <div class="flex flex-col items-center text-emerald-400 font-black text-sm leading-none">
                    <span>│</span>
                    <span>▼</span>
                  </div>
                  <span class="text-[11px] uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full">
                    SEGUIDO DE (0s descanso - Pasar de inmediato)
                  </span>
                </div>
              ` : ''}
            `;
          }).join('');

          return `
            <div class="relative bg-slate-950/90 border-2 ${colorBorde} rounded-2xl p-4 sm:p-5 mb-5 shadow-xl">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="${colorBadge} text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1">
                    ${badgeGrupo} 
                    <button aria-label="Ver explicación" onclick="mostrarAyudaGym('${esTri ? 'TRISERIE' : 'BISERIE'}')" class="bg-black/20 text-current rounded-full px-1.5 py-0.5 text-[11px] transition hover:bg-black/40">?</button>
                </span>
                  <h4 class="text-xs sm:text-sm font-black text-white uppercase tracking-wider">${tituloGrupo} - <span class="text-emerald-400">${escHtml(musculosUnicos)}</span></h4>
                </div>
                <span class="bg-slate-900 text-slate-300 border border-slate-700 px-3 py-1 rounded-lg text-xs font-extrabold">${ico('hash', 'w-4 h-4')} ${escHtml(seriesGrupo)} Series Totales</span>
              </div>

              <div>${subTarjetasHTML}</div>

              <div class="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                <div class="text-xs font-extrabold text-white uppercase tracking-wider">
                  ${ico('timer', 'w-4 h-4')} DESCANSAR TRAS ${esTri ? 'TRI-SERIE' : 'SÚPER SERIE'}: <span class="text-emerald-400 text-sm">${descansoFinal}s</span>
                </div>
                <button onclick="iniciarCronometro(${descansoFinal})" 
                  class="w-full sm:w-auto bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/50 font-extrabold text-xs px-4 py-2 rounded-xl transition">
                  Iniciar Cronómetro (${descansoFinal}s)
                </button>
              </div>
            </div>
          `;
        }

        // ==================== CASO B: TARJETAS ESPECIALES (DROP SET, ASCENDING, PIRAMIDE) ====================
        if (bloque.tipo === 'DROPSET' || bloque.tipo === 'ASCENDING' || bloque.tipo === 'PIRAMIDE') {
          const r = bloque.item.data;
          const idx = bloque.item.idx;
          const storageKey = kp(idx, 'ok');
          const estaMarcado = leerProg(storageKey) === 'true';
          const segDescanso = parseInt(r.descanso) || 90;

          // Si es Pirámide, forzamos 5 fases por defecto si el coach no ingresó las reps separadas por guiones
          const repsPartes = String(r.repeticiones || '').split(/[-/,]+/).map(s => s.trim()).filter(Boolean);
          const caidasReps = repsPartes.length >= 2 ? repsPartes : (bloque.tipo === 'PIRAMIDE' ? ['12', '10', '8', '10', '12'] : ['8', '10', '12']);

          // Configurador Dinámico de Estilos y Textos según el Tipo
          let config = { colorBorde: 'border-rose-500/50', badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40', titulo: '' + ico('trending-down', 'w-4 h-4') + ' DROP SET (BAJANDO PESO)', etiquetaPaso: 'Caída', colorTextoPaso: 'text-rose-400', txtSecundario: 'Bajar Peso' };
          
          if (bloque.tipo === 'ASCENDING') {
            config = { colorBorde: 'border-amber-500/50', badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', titulo: '' + ico('trending-up', 'w-4 h-4') + ' ASCENDING SERIES (SUBIENDO PESO)', etiquetaPaso: 'Serie', colorTextoPaso: 'text-amber-400', txtSecundario: 'Subir Peso' };
          } else if (bloque.tipo === 'PIRAMIDE') {
            config = { colorBorde: 'border-blue-500/50', badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40', titulo: '' + ico('arrow-up-down', 'w-4 h-4') + ' PIRÁMIDE COMPLETA (5 SERIES SEGUIDAS)', etiquetaPaso: 'Fase', colorTextoPaso: 'text-blue-400', txtSecundario: 'Ajustar Peso' };
          }

          const filasDropHTML = caidasReps.map((repNum, dropIdx) => {
            const dropLoadKey = kp(idx, 'carga_d' + (dropIdx + 1));
            const dropCheckKey = kp(idx, 'ok_d' + (dropIdx + 1));
            const pesoDrop = leerProg(dropLoadKey) || '';
            const checkDrop = leerProg(dropCheckKey) === 'true';
            
            // Lógica de etiquetas: Las primeras 3 suben (idx 0,1,2), las últimas 2 bajan (idx 3,4) para Pirámide
            let etiquetaBajada = dropIdx === 0 ? 'Peso Inicial' : `${ico('flame', 'w-4 h-4')} ${config.txtSecundario}`;
            if (bloque.tipo === 'PIRAMIDE' && dropIdx > 0) {
              etiquetaBajada = dropIdx < 3 ? '' + ico('trending-up', 'w-4 h-4') + ' Subir Peso' : '' + ico('trending-down', 'w-4 h-4') + ' Bajar Peso';
            }

            return `
              <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border ${checkDrop ? 'border-emerald-500/50' : 'border-slate-800'} px-3 py-2.5 rounded-xl text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold ${config.colorTextoPaso}">${config.etiquetaPaso} ${dropIdx + 1}:</span>
                  <span class="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">${escHtml(repNum)} Reps</span>
                  <span class="text-[11px] font-semibold ${dropIdx === 0 ? 'text-slate-400' : (etiquetaBajada.includes('Bajar') ? 'text-rose-300' : 'text-emerald-300')}">${etiquetaBajada}</span>
                </div>
                <div class="flex items-center gap-2">
                  <input type="text" value="${escHtml(pesoDrop)}" placeholder="Ej. 20kg"
                    onchange="guardarCargaEjercicio('${dropLoadKey}', this.value)"
                    class="w-20 p-1 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold text-center text-xs">
                  <button aria-label="Marcar serie del drop set" onclick="alternarCheckSubDrop('${dropCheckKey}', '${storageKey}', ${caidasReps.length}, '${userId}', '${hoyKey}', '${diaNorm}', ${idx})"
                    class="px-2.5 py-1 rounded-lg font-bold border transition ${checkDrop ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-700'}">
                    [✓]
                  </button>
                </div>
              </div>
            `;
          }).join('');

          return `
            <div class="bg-slate-900 border-2 ${estaMarcado ? 'border-emerald-500/60 opacity-75' : config.colorBorde} rounded-2xl p-4 sm:p-5 mb-5 shadow-lg">
              <div class="flex justify-between items-start gap-3 mb-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-[11px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">${escHtml(r.musculo)}</span>
                    <span class="text-[11px] uppercase font-black px-2.5 py-0.5 ${config.badgeBg} rounded-md flex items-center gap-1">
                      ${config.titulo} 
                      <button aria-label="Ver explicación" onclick="mostrarAyudaGym('${bloque.tipo}')" class="bg-black/20 text-current rounded-full px-1.5 py-0.5 text-[11px] transition hover:bg-black/40">?</button>
                    </span>
                  </div>
                  <h4 class="text-base sm:text-lg font-black text-white mt-1.5 tracking-wide uppercase ${estaMarcado ? 'line-through text-slate-400' : ''}">${escHtml(r.ejercicio)}</h4>
                  ${chipTecnica(r)}
                </div>
                <button aria-label="Marcar ejercicio como completado" onclick="alternarCheckEjercicio('${storageKey}', ${idx})" 
                  class="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shrink-0 ${estaMarcado ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-emerald-500'}">
                  ✓
                </button>
              </div>

              ${gifEj(r)}

              ${filaEspecs(r, segDescanso, 'Fases')}

              <div class="space-y-2 mt-2 pt-3 border-t border-slate-800">
                <p class="text-xs text-slate-400 font-semibold">${ico('arrow-down', 'w-4 h-4')} Registra el peso en cada paso de la secuencia:</p>
                ${filasDropHTML}
              </div>
            </div>
          `;
        }

        // ==================== CASO C: EJERCICIO NORMAL INDIVIDUAL ====================
        const r = bloque.item.data;
        const idx = bloque.item.idx;
        const storageKey = kp(idx, 'ok');
        const loadStorageKey = kp(idx, 'carga');
        const estaMarcado = leerProg(storageKey) === 'true';
        const pesoAnterior = leerProg(loadStorageKey) || '';
        const segDescanso = parseInt(r.descanso) || 0;

        return `
          <div class="border ${estaMarcado ? 'border-emerald-500/50 bg-emerald-950/10 opacity-75' : 'bg-slate-900 border-slate-800'} rounded-2xl p-4 mb-4 transition-all shadow-md">
            <div class="flex justify-between items-start gap-3 mb-2">
              <div class="flex items-start gap-3 min-w-0">
                <div class="min-w-0">
                  <span class="text-[11px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">${escHtml(r.musculo)}</span>
                  <h4 class="text-base sm:text-lg font-black text-white mt-1 tracking-wide uppercase ${estaMarcado ? 'line-through text-slate-400' : ''}">${escHtml(r.ejercicio)}</h4>
                  ${chipTecnica(r)}
                </div>
              </div>
              <button aria-label="Marcar ejercicio como completado" onclick="alternarCheckEjercicio('${storageKey}', ${idx})" 
                class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shrink-0 ${estaMarcado ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-95' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-emerald-500'}">
                ✓
              </button>
            </div>

            ${gifEj(r)}

            ${filaEspecs(r, segDescanso)}

            ${tablaSeries(r, idx, kp, diaNorm)}
          </div>
        `;
      });

      const porcentaje = Math.round((completados / ejerciciosDia.length) * 100);
      contador.innerText = `${dia}: ${completados}/${ejerciciosDia.length} (${porcentaje}%)`;

      contenedor.innerHTML = lineaDeTiempoRutina(bloques, tarjetasHTML, ejerciciosDia, kp, diaNorm, dia);
      activarGifsEnPantalla();
      precargarDetallesDia();
    }

    // ==================== v18 · RUTINA EN LÍNEA DE TIEMPO ====================
    // Lo hecho queda arriba (resumido y tachado), el ejercicio actual abierto y lo que falta abajo (resumido).
    // Al tocar un resumen se abre la tarjeta completa de siempre (mismas casillas y registros).
    const rutinaAbierta = {};   // 'DIA|n' → true/false si el alumno abrió o cerró ese bloque a mano
    function alternarBloqueRutina(diaNorm, bi, abierto) {
      rutinaAbierta[diaNorm + '|' + bi] = !abierto;
      seleccionarDiaRutina(estadoGlobal.diaSeleccionado);
    }
    /** Avance de un ejercicio: series hechas / total (drop set y pirámide cuentan sus fases). */
    function avanceItemRutina(it, kp, tipo) {
      const r = it.data, idx = it.idx;
      if (tipo === 'DROPSET' || tipo === 'ASCENDING' || tipo === 'PIRAMIDE') {
        const fases = fasesEspeciales(r, tipo).length;
        let h = 0; for (let d = 1; d <= fases; d++) if (leerProg(kp(idx, 'ok_d' + d)) === 'true') h++;
        const ok = leerProg(kp(idx, 'ok')) === 'true';
        return { hechas: ok ? fases : h, total: fases, ok: ok || h >= fases };
      }
      const total = cuantasSeries(r);
      let h = 0; for (let n = 1; n <= total; n++) if (leerProg(kp(idx, 's' + n + '_ok')) === 'true') h++;
      const ok = leerProg(kp(idx, 'ok')) === 'true';
      return { hechas: ok ? total : h, total: total, ok: ok || h >= total };
    }
    function fasesEspeciales(r, tipo) {
      const partes = String(r.repeticiones || '').split(/[-/,]+/).map(x => x.trim()).filter(Boolean);
      return partes.length >= 2 ? partes : (tipo === 'PIRAMIDE' ? ['12', '10', '8', '10', '12'] : ['8', '10', '12']);
    }
    /** Último kg anotado en un ejercicio (esta semana) o el de la semana pasada. */
    function kgReferencia(it, kp, diaNorm) {
      const idx = it.idx, total = cuantasSeries(it.data);
      for (let n = total; n >= 1; n--) { const v = leerProg(kp(idx, 's' + n + '_peso')); if (v) return { kg: v, pasada: false }; }
      const c = leerProg(kp(idx, 'carga')) || leerProg(kp(idx, 'carga_d1'));
      if (c) return { kg: c, pasada: false };
      const ant = valorSemanaPasada(diaNorm, txtClave(kp(idx, 's1_peso'))) || valorSemanaPasada(diaNorm, txtClave(kp(idx, 'carga')));
      return ant ? { kg: ant, pasada: true } : null;
    }
    const kgTxt = v => /kg/i.test(String(v)) ? String(v) : String(v) + ' kg';

    function lineaDeTiempoRutina(bloques, tarjetas, ejerciciosDia, kp, diaNorm, dia) {
      let seriesHechas = 0, seriesTotal = 0, segundos = 0, ejHechos = 0;
      const info = bloques.map(b => {
        const items = b.tipo === 'GRUPO' ? b.items : [b.item];
        const tipoItem = b.tipo === 'GRUPO' ? 'NORMAL' : b.tipo;
        const av = items.map(it => avanceItemRutina(it, kp, tipoItem));
        av.forEach((a, i) => {
          seriesHechas += a.hechas; seriesTotal += a.total; if (a.ok) ejHechos++;
          if (!a.ok) segundos += (a.total - a.hechas) * (40 + (b.tipo === 'GRUPO' ? 0 : (parseInt(items[i].data.descanso) || 60)));
        });
        if (b.tipo === 'GRUPO') segundos += Math.max(0, ...av.map(a => a.total - a.hechas)) * (parseInt(items[items.length - 1].data.descanso) || 90);
        return { items, av, hecho: av.every(a => a.ok), enCurso: av.some(a => a.hechas > 0) };
      });
      const actual = info.findIndex(x => !x.hecho);
      const pct = seriesTotal ? Math.round(seriesHechas / seriesTotal * 100) : 0;
      const minutos = Math.max(1, Math.round(segundos / 60));
      const c = 2 * Math.PI * 27;
      const soloLectura = !!(estadoGlobal.progLocal && estadoGlobal.progLocal.soloLectura) || esCoach();
      const resumen = `
        <div class="flex items-center gap-4 mb-4">
          <div class="relative w-16 h-16 shrink-0" role="img" aria-label="${pct}% de las series hechas">
            <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" stroke="#1e293b" stroke-width="7" fill="none"/>
              <circle cx="32" cy="32" r="27" stroke="#10b981" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}" transform="rotate(-90 32 32)"/></svg>
            <span class="absolute inset-0 flex items-center justify-center text-sm font-black text-white">${pct}%</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">${escHtml(dia)}</p>
            <p class="text-lg font-black text-white leading-tight">${ejHechos} de ${ejerciciosDia.length} ejercicios</p>
            <p class="text-xs text-slate-400">${seriesHechas} de ${seriesTotal} series${actual >= 0 ? ' · quedan ~' + minutos + ' min' : ' · ¡día completo!'}</p>
          </div>
        </div>
        ${!soloLectura && actual >= 0 ? `<button type="button" onclick="abrirModoGuiado()" class="w-full mb-5 min-h-[52px] rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>${seriesHechas ? 'Continuar en modo guiado' : 'Empezar en modo guiado'}</button>` : ''}`;

      const filas = bloques.map((b, bi) => {
        const x = info[bi];
        const clave = diaNorm + '|' + bi;
        const abierto = clave in rutinaAbierta ? rutinaAbierta[clave] : bi === actual;
        const estado = x.hecho ? 'ok' : bi === actual ? 'ahora' : 'pend';
        const nodo = estado === 'ok'
          ? `<span class="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">${ico('check', 'w-4 h-4')}</span>`
          : estado === 'ahora'
            ? '<span class="w-8 h-8 rounded-full bg-slate-950 border-[3px] border-amber-400 flex items-center justify-center"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span></span>'
            : '<span class="block w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-700"></span>';
        const linea = bi < bloques.length - 1 ? '<span class="absolute left-[15px] top-9 -bottom-3 w-0.5 bg-slate-800" aria-hidden="true"></span>' : '';
        let cuerpo;
        if (abierto) {
          // Abierto: la tarjeta usa todo el ancho (en el celular no se aprieta); el punto queda en la fila de arriba
          const cab = estado !== 'ahora'
            ? `<button type="button" onclick="alternarBloqueRutina('${diaNorm}', ${bi}, true)" aria-expanded="true" class="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1 min-h-[36px]">${ico('chevrons-down', 'w-4 h-4')} Resumir</button>`
            : `<span class="text-[11px] font-black text-amber-300 tracking-wider">AHORA</span>`;
          return `<li class="relative"><div class="flex items-center gap-3 mb-2">${nodo}${cab}</div>${tarjetas[bi]}</li>`;
        } else {
          const nombres = x.items.map(it => it.data.ejercicio).join(' + ');
          const etiqueta = b.tipo === 'GRUPO' ? (b.subtipo === 'TRISERIE' ? 'Tri-serie · ' : 'Súper serie · ') : b.tipo === 'DROPSET' ? 'Drop set · ' : b.tipo === 'PIRAMIDE' ? 'Pirámide · ' : b.tipo === 'ASCENDING' ? 'Ascendente · ' : '';
          const r0 = x.items[0].data;
          const ref = kgReferencia(x.items[0], kp, diaNorm);
          const hechas = x.av.reduce((t, a) => t + a.hechas, 0), total = x.av.reduce((t, a) => t + a.total, 0);
          const sub = estado === 'ok'
            ? `${escHtml(String(r0.serie || ''))} × ${escHtml(String(r0.repeticiones || ''))}${ref && !ref.pasada ? ' · ' + escHtml(kgTxt(ref.kg)) : ''} · hecho`
            : x.enCurso ? `En curso · ${hechas} de ${total} series`
              : `${escHtml(String(r0.serie || ''))} × ${escHtml(String(r0.repeticiones || ''))}${ref ? (ref.pasada ? ' · semana pasada ' : ' · ') + escHtml(kgTxt(ref.kg)) : ''}`;
          const mini = r0.media ? `<img src="${urlMini(r0.media)}" alt="" loading="lazy" decoding="async" class="w-11 h-11 rounded-xl bg-white object-contain shrink-0">` : `<span class="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">${ico('dumbbell', 'w-5 h-5')}</span>`;
          cuerpo = `<button type="button" onclick="alternarBloqueRutina('${diaNorm}', ${bi}, false)" aria-expanded="false"
            class="w-full flex items-center gap-3 p-2.5 min-h-[64px] rounded-2xl text-left border transition ${estado === 'ok' ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}">
            ${mini}
            <span class="flex-1 min-w-0">
              <span class="block text-sm font-extrabold leading-snug line-clamp-2 ${estado === 'ok' ? 'text-slate-300 line-through decoration-slate-600' : 'text-white'}">${escHtml(etiqueta)}${escHtml(nombres)}</span>
              <span class="block text-xs ${estado === 'ok' ? 'text-emerald-300' : x.enCurso ? 'text-amber-300' : 'text-slate-400'}">${sub}</span>
            </span>
            ${ico('chevron-right', 'w-5 h-5 text-slate-500 shrink-0')}
          </button>`;
        }
        return `<li class="relative pl-11">${linea}<span class="absolute left-0 top-3">${nodo}</span>${cuerpo}</li>`;
      }).join('');
      return resumen + `<ol class="space-y-3" aria-label="Ejercicios de ${escHtml(dia)}">${filas}</ol>`;
    }

    function alternarCheckEjercicio(storageKey, idx) {
      const actual = leerProg(storageKey) === 'true';
      escribirProg(storageKey, actual ? 'false' : 'true');
      seleccionarDiaRutina(estadoGlobal.diaSeleccionado);
    }
    function alternarCheckSubDrop(dropCheckKey, mainStorageKey, totalDrops) {
      const actual = leerProg(dropCheckKey) === 'true';
      escribirProg(dropCheckKey, actual ? 'false' : 'true');
      const base = dropCheckKey.replace(/_d\d+$/, '');
      let todas = true;
      for (let d = 1; d <= totalDrops; d++) { if (leerProg(base + '_d' + d) !== 'true') todas = false; }
      escribirProg(mainStorageKey, todas ? 'true' : 'false');
      seleccionarDiaRutina(estadoGlobal.diaSeleccionado);
    }
        // ==================== FILA DE ESPECIFICACIONES ====================
    // Reemplaza los chips sueltos por una tabla compacta de 4 columnas.
    function filaEspecs(r, segDescanso, etiquetaSeries) {
      const tempo = `${r.excentrica || 0}-${r.pausaExcentrica || 0}-${r.concentrica || 0}-${r.pausaConcentrica || 0}`;
      const desc = (r.descanso !== undefined && r.descanso !== '') ? r.descanso : 0;
      const cel = (et, val) => `
        <div class="px-0.5 sm:px-1 py-2 text-center min-w-0">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-tight sm:tracking-wider leading-tight">${et}</p>
          <div class="mt-0.5 leading-none">${val}</div>
        </div>`;
      return `
        <div class="grid grid-cols-4 divide-x divide-slate-800 bg-slate-950 border border-slate-800 rounded-xl mb-3 overflow-hidden">
          ${cel(etiquetaSeries || 'Series', `<span class="text-sm font-black text-white">${escHtml(String(r.serie || '-'))}</span>`)}
          ${cel('Reps', `<span class="text-sm font-black text-white">${escHtml(String(r.repeticiones || '-'))}</span>`)}
          ${cel('Tempo', `<span class="text-xs font-mono font-black text-amber-300">${tempo}</span><button aria-label="Ver explicación" onclick="mostrarAyudaGym('TEMPO')" class="ml-1 bg-amber-500/20 text-amber-400 rounded-full px-1 text-[11px] font-black border border-amber-500/30 align-middle">?</button>`)}
          ${cel('Descanso', `<button onclick="iniciarCronometro(${segDescanso > 0 ? segDescanso : 60})" title="Iniciar este descanso" class="text-sm font-black text-emerald-400 underline decoration-emerald-500/40 underline-offset-2">${escHtml(String(desc))}s</button>`)}
        </div>`;
    }

    // ==================== REGISTRO POR SERIE ====================
    // Claves: DIA|EJERCICIO::s1_peso y DIA|EJERCICIO::s1_ok (una pareja por serie)
    const NUM_SERIES_MAX = 12;
    function cuantasSeries(r) {
      const n = parseInt(r && r.serie);
      return Math.max(1, Math.min(NUM_SERIES_MAX, isNaN(n) ? 1 : n));
    }

    /** Qué registró el alumno la semana anterior en esa misma casilla. */
    function valorSemanaPasada(diaNorm, clave) {
      const sems = estadoGlobal.semanas || [];
      const actual = infoSemana(fechaLocalISO()).semanaISO;
      for (let i = sems.length - 1; i >= 0; i--) {
        const s = sems[i];
        if (!s || !s.semanaISO || s.semanaISO >= actual) continue;
        const reg = (s.registros || []).find(x => normalizarDia(x.dia) === diaNorm && txtClave(x.clave) === clave);
        if (reg && reg.valor && reg.valor !== 'true') return String(reg.valor);
      }
      return '';
    }
    const txtClave = c => String(c || '').split('|').pop();

    /** Tabla de series: solo el peso de cada serie y la referencia de la semana pasada. */
    function tablaSeries(r, idx, kp, diaNorm) {
      const total = cuantasSeries(r);
      const base = kp(idx, 'carga');
      const viejoHoy = leerProg(base);                                   // registro de esta semana en formato antiguo
      const viejoAntes = valorSemanaPasada(diaNorm, txtClave(base));     // registro general de la semana pasada
      let filas = '', hayRefSerie = false;
      for (let n = 1; n <= total; n++) {
        const kPeso = kp(idx, 's' + n + '_peso'), kOk = kp(idx, 's' + n + '_ok');
        const peso = leerProg(kPeso), hecha = leerProg(kOk) === 'true';
        const antP = valorSemanaPasada(diaNorm, txtClave(kPeso));
        if (antP) hayRefSerie = true;
        filas += `
          <div class="rounded-xl border p-2 ${hecha ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'}">
            <div class="grid grid-cols-[1.6rem_1fr_2.25rem] items-center gap-1.5">
              <span class="text-xs font-black ${hecha ? 'text-emerald-400' : 'text-slate-400'}">S${n}</span>
              <div class="relative">
                <input type="number" inputmode="decimal" step="0.5" value="${escHtml(peso)}" placeholder="${antP ? escHtml(antP) : ''}"
                  onchange="guardarCargaEjercicio('${kPeso}', this.value)"
                  class="w-full p-2 pr-8 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold text-center text-sm">
                <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none">kg</span>
              </div>
              <button type="button" onclick="alternarSerie('${kOk}', ${idx}, ${total})" title="Serie hecha"
                class="w-9 h-9 rounded-lg flex items-center justify-center font-bold transition ${hecha ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border border-slate-700 text-slate-400'}">✓</button>
            </div>
            ${antP ? `<p class="text-[11px] text-slate-400 mt-1 pl-[1.9rem]">Semana pasada: <span class="text-slate-400 font-semibold">${escHtml(antP)} kg</span></p>` : ''}
          </div>`;
      }
      const refGeneral = (!hayRefSerie && viejoAntes)
        ? `<p class="text-xs text-amber-300/90 mb-2">${ico('pin', 'w-4 h-4')} La semana pasada registraste <span class="font-bold">${escHtml(viejoAntes)}</span> en este ejercicio.</p>` : '';
      return `
        <div class="pt-3 border-t border-slate-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wide">${ico('scale', 'w-4 h-4')} Registra cada serie</span>
            <span class="text-[11px] text-slate-400">peso en kg</span>
          </div>
          ${refGeneral}
          <div class="space-y-1.5 pr-14 sm:pr-16">${filas}</div>
          ${viejoHoy ? `<p class="text-[11px] text-amber-400/80 mt-2">Registro anterior de este ejercicio: ${escHtml(viejoHoy)}</p>` : ''}
        </div>`;
    }

    /** Marca una serie y actualiza el ✓ del ejercicio (hecho = todas las series marcadas). */
    function alternarSerie(kOk, idx, total) {
      escribirProg(kOk, leerProg(kOk) === 'true' ? 'false' : 'true');
      const partes = kOk.split('::');
      const prefijo = partes[0] + '::s';
      let hechas = 0;
      for (let n = 1; n <= total; n++) if (leerProg(prefijo + n + '_ok') === 'true') hechas++;
      escribirProg(partes[0] + '::ok', hechas >= total ? 'true' : 'false');
      seleccionarDiaRutina(estadoGlobal.diaSeleccionado);
    }
    
    function guardarCargaEjercicio(loadStorageKey, valor) {
      // Ya no se vuelve a pintar el día completo: así el input no pierde el foco mientras escribes
      escribirProg(loadStorageKey, String(valor || '').trim());
    }

    // ==================== NAVEGACIÓN DE PESTAÑAS EN HISTORIAL ====================
    function cambiarSeccionProgreso(seccionId) {
      if (seccionId === 'secSemanal') renderComparadorSemanas();
      document.querySelectorAll('.seccion-progreso-detalle').forEach(el => el.classList.add('hidden'));
      document.getElementById(seccionId).classList.remove('hidden');

      document.querySelectorAll('.btn-seccion-prog').forEach(btn => {
        btn.className = 'btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 font-semibold';
      });
      const btnActivo = document.getElementById(`btn-${seccionId}`);
      if (btnActivo) {
        btnActivo.className = 'btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-lg';
      }

      if (seccionId === 'secPerimetros' || seccionId === 'secPliegues') {
        setTimeout(() => inicializarGraficosSeparados(), 50);
      }
    }

    function inicializarSelectoresFotos() {
      const selA = document.getElementById('selFotoAntes');
      const selD = document.getElementById('selFotoDespues');
      if (!selA || !selD) return;
      selA.selectedIndex = 0;
      selD.selectedIndex = selD.options.length - 1;
      actualizarComparacionFotos();
    }

    function actualizarComparacionFotos() {
      if (estadoGlobal.progresoActual.length === 0) return;
      const angulo = document.getElementById('selAnguloFoto').value;
      const regA = estadoGlobal.progresoActual[document.getElementById('selFotoAntes').value];
      const regD = estadoGlobal.progresoActual[document.getElementById('selFotoDespues').value];

      const renderCard = (reg) => {
        const url = urlFotoConCache(reg[angulo]);
        const imgHtml = url
          ? `<img src="${escHtml(url)}" referrerpolicy="no-referrer" onerror="cargarFotoSegura(this, false)" class="max-h-80 sm:max-h-96 w-full rounded-lg object-contain mb-3 border border-slate-700 transition-transform hover:scale-[1.02]" title="Clic para ampliar">`
          : `<div class="h-56 flex items-center justify-center text-slate-400 text-xs">Sin foto en ${escHtml(angulo)}</div>`;
        return `${imgHtml}
          <div class="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 w-full text-left">
            <div class="border-b border-slate-700 pb-1.5 mb-1.5"><span class="font-bold text-emerald-400">${escHtml(reg.fecha)}</span> | Peso: ${escHtml(reg.peso || '-')}kg | Cintura: ${escHtml(reg.cintura || '-')}cm</div>
            <span class="text-sky-400 font-bold block">Observación Coach:</span>
            <span class="text-slate-400 italic">${escHtml(reg.observacion || 'Sin observaciones en esta fecha.')}</span>
          </div>`;
      };
      document.getElementById('cardFotoAntes').innerHTML = renderCard(regA);
      document.getElementById('cardFotoDespues').innerHTML = renderCard(regD);
    }

    function abrirModalFotoCompleta(elementoContenedor) {
      const img = elementoContenedor.querySelector('img');
      if (!img) return;
      const angulo = (document.getElementById('selAnguloFoto') || {}).value || 'urlFrente';
      const esAntes = elementoContenedor.id === 'cardFotoAntes';
      const selId = esAntes ? 'selFotoAntes' : 'selFotoDespues';
      const idxReg = parseInt((document.getElementById(selId) || {}).value);
      const lista = (estadoGlobal.progresoActual || []).map((reg, i) => ({ i, reg })).filter(x => x.reg[angulo]);
      galeria.items = lista.length ? lista : [{ i: -1, reg: { [angulo]: img.src } }];
      galeria.angulo = angulo;
      galeria.pos = Math.max(0, galeria.items.findIndex(x => x.i === idxReg));
      const ayuda = document.getElementById('galAyuda'); if (ayuda) ayuda.classList.toggle('hidden', galeria.items.length < 2);
      document.getElementById('modalFotoCompleta').classList.remove('hidden');
      pintarGaleria();
    }
    const galeria = { items: [], pos: 0, angulo: 'urlFrente', x0: null };
    const NOMBRE_ANGULO = { urlFrente: 'Frente', urlPerfil: 'Perfil', urlEspalda: 'Espalda' };
    function pintarGaleria() {
      const it = galeria.items[galeria.pos]; if (!it) return;
      const r = it.reg;
      const imgGal = document.getElementById('imgFotoCompleta');
      imgGal.style.width = '';
      imgGal.referrerPolicy = 'no-referrer';
      imgGal.dataset.b64Try = '';
      imgGal.onerror = () => cargarFotoSegura(imgGal, false);
      imgGal.src = urlFotoConCache(r[galeria.angulo] || '');
      document.getElementById('galContador').innerText = `${NOMBRE_ANGULO[galeria.angulo] || ''} · ${galeria.pos + 1} / ${galeria.items.length}`;
      document.getElementById('galPuntos').innerHTML = galeria.items.map((_, k) => `<span class="w-2 h-2 rounded-full ${k === galeria.pos ? 'bg-emerald-400' : 'bg-slate-700'}"></span>`).join('');
      document.getElementById('txtFotoCompletaInfo').innerHTML = r.fecha ? `
        <div class="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div class="border-b border-slate-700 pb-1.5 mb-1.5"><span class="font-bold text-emerald-400">${escHtml(r.fecha)}</span> | Peso: ${escHtml(r.peso || '-')} kg | Cintura: ${escHtml(r.cintura || '-')} cm</div>
          <span class="text-emerald-400 font-bold block">Observación del coach:</span>
          <span class="text-slate-400 italic">${escHtml(r.observacion || 'Sin observaciones en esta fecha.')}</span>
        </div>` : '';
      document.getElementById('galPrev').style.visibility = galeria.pos > 0 ? 'visible' : 'hidden';
      document.getElementById('galNext').style.visibility = galeria.pos < galeria.items.length - 1 ? 'visible' : 'hidden';
    }
    function moverGaleria(paso) {
      const n = galeria.pos + paso;
      if (n < 0 || n >= galeria.items.length) return;
      galeria.pos = n;
      const img = document.getElementById('imgFotoCompleta');
      img.style.transform = `translateX(${paso > 0 ? '-' : ''}12px)`; img.style.opacity = '0.4';
      setTimeout(() => { pintarGaleria(); img.style.transform = ''; img.style.opacity = '1'; }, 120);
    }
    document.addEventListener('DOMContentLoaded', () => {
      const zona = document.getElementById('galZona');
      if (!zona) return;
      zona.addEventListener('touchstart', e => { galeria.x0 = e.touches[0].clientX; }, { passive: true });
      zona.addEventListener('touchend', e => {
        if (galeria.x0 === null) return;
        const dx = e.changedTouches[0].clientX - galeria.x0; galeria.x0 = null;
        if (Math.abs(dx) > 45) moverGaleria(dx < 0 ? 1 : -1);
      }, { passive: true });
      document.addEventListener('keydown', e => {
        if (document.getElementById('modalFotoCompleta').classList.contains('hidden')) return;
        if (e.key === 'ArrowRight') moverGaleria(1);
        if (e.key === 'ArrowLeft') moverGaleria(-1);
        if (e.key === 'Escape') cerrarModalFotoCompleta();
      });
    });

    /** v12.1: en «Configurar mi perfil», tocar la foto la muestra en grande (reusa el visor de fotos). */
    function ampliarFotoPerfil() {
      const prev = document.getElementById('previewFotoPerfil');
      if (!prev || !prev.getAttribute('src') || !prev.complete || !prev.naturalWidth) return;
      galeria.items = []; galeria.pos = 0;
      const img = document.getElementById('imgFotoCompleta');
      img.onerror = null;
      img.src = prev.src;                                   // al instante, la que ya está cargada
      img.style.width = 'min(88vw, 480px)';
      // luego la versión completa (la miniatura de Drive es pequeña y se vería borrosa)
      const id = extraerIdDriveCliente(estadoGlobal.user && estadoGlobal.user.urlFotoPerfil);
      if (id && cacheFotosDrive[id]) img.src = cacheFotosDrive[id];
      else if (id) GS().withFailureHandler(() => {}).withSuccessHandler(res => {
        if (!res || !res.success || !res.dataUri) return;
        cacheFotosDrive[id] = res.dataUri;
        if (!document.getElementById('modalFotoCompleta').classList.contains('hidden') && document.getElementById('galContador').innerText === 'Foto de perfil') img.src = res.dataUri;
      }).obtenerFotoBase64(id);
      document.getElementById('galContador').innerText = 'Foto de perfil';
      document.getElementById('galPuntos').innerHTML = '';
      document.getElementById('txtFotoCompletaInfo').innerHTML = '';
      document.getElementById('galPrev').style.visibility = 'hidden';
      document.getElementById('galNext').style.visibility = 'hidden';
      const ayuda = document.getElementById('galAyuda'); if (ayuda) ayuda.classList.add('hidden');
      document.getElementById('modalFotoCompleta').classList.remove('hidden');
    }

    function cerrarModalFotoCompleta() {
      document.getElementById('modalFotoCompleta').classList.add('hidden');
      document.getElementById('imgFotoCompleta').src = ''; // Limpiar memoria
      document.getElementById('imgFotoCompleta').style.width = '';
    }

    // ==================== GESTIÓN DE PERFIL, AVATAR Y CONTRASEÑA ====================
    // Avatar de respaldo con las iniciales, dibujado dentro de la app (mismo estilo: fondo verde, letras oscuras).
    // Antes se pedía a ui-avatars.com: sin internet esa imagen fallaba y se volvía a pedir en un bucle sin fin.
    function obtenerAvatarFallback(nombre) {
      const p = String(nombre || 'Usuario').trim().split(/\s+/);
      const ini = ((p[0] || '')[0] || '') + ((p[1] || '')[0] || '');
      const letras = (ini || 'U').toUpperCase().replace(/[<>&"']/g, '');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#10b981"/>` +
        `<text x="32" y="41" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="700" fill="#020617">${letras}</text></svg>`;
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    const cacheFotosDrive = {};

    function extraerIdDriveCliente(url) {
      const m = /(?:[?&]id=|\/d\/|fotoid=)([a-zA-Z0-9_-]{20,})/.exec(String(url || ''));
      return m ? m[1] : '';
    }

    // Las fotos son PRIVADAS en Drive: en vez de la URL pública se pone una marca que el navegador
    // no puede cargar (sin tráfico de red); el onerror llama a cargarFotoSegura y la pide al servidor.
    const cacheMiniaturas = {};
    function urlFotoConCache(url) {
      const id = extraerIdDriveCliente(url);
      if (!id) return url || '';
      return cacheFotosDrive[id] || cacheMiniaturas[id] || ('data:image/x-drive;fotoid=' + id + ',');
    }

    function cargarFotoSegura(img, esAvatar) {
      if (!img || img.dataset.b64Try === '1') {
        if (esAvatar && estadoGlobal.user) img.src = obtenerAvatarFallback(estadoGlobal.user.nombre);
        return;
      }
      img.dataset.b64Try = '1';
      const id = extraerIdDriveCliente(img.getAttribute('src'));
      if (!id) {
        if (esAvatar && estadoGlobal.user) img.src = obtenerAvatarFallback(estadoGlobal.user.nombre);
        return;
      }
      const mini = esAvatar || img.dataset.mini === '1';
      if (mini) {
        // v18: fotos de PERFIL → memoria, luego teléfono, luego servidor (en lote)
        pedirMiniaturaPerfil(id).then(uri => {
          if (uri) img.src = uri;
          else if (esAvatar && estadoGlobal.user) img.src = obtenerAvatarFallback(estadoGlobal.user.nombre);
        });
        return;
      }
      // Fotos de evaluación: solo en memoria mientras la app está abierta (datos sensibles, no se guardan en el teléfono)
      if (cacheFotosDrive[id]) { img.src = cacheFotosDrive[id]; return; }
      GS()
        .withFailureHandler(() => {})
        .withSuccessHandler(res => { if (res && res.success && res.dataUri) { cacheFotosDrive[id] = res.dataUri; img.src = res.dataUri; } })
        .obtenerFotoBase64(id);
    }

    // ==================== v18 · FOTOS DE PERFIL GUARDADAS EN EL TELÉFONO ====================
    // Una foto nueva siempre es otro archivo en Drive (otro ID): por eso no hace falta «revisar cambios»;
    // el ID nuevo no está guardado y se descarga solo esa. Las viejas se van borrando (máx. 300).
    const MAX_FOTOS_GUARDADAS = 300;
    const pendMini = {};
    let colaMini = [], relojMini = null;
    function pedirMiniaturaPerfil(id) {
      if (!id) return Promise.resolve(null);
      if (cacheMiniaturas[id]) return Promise.resolve(cacheMiniaturas[id]);
      if (pendMini[id]) return pendMini[id];
      const p = (async () => {
        const g = await CajaLocal.leer(CAJA_FOTOS, 'foto/' + id);
        if (g) { cacheMiniaturas[id] = g; return g; }
        return new Promise(res => {
          colaMini.push([id, res]);
          if (!relojMini) relojMini = setTimeout(vaciarColaMini, 60);   // junta los pedidos de toda la lista
        });
      })();
      pendMini[id] = p;
      p.then(() => { delete pendMini[id]; });
      return p;
    }
    function vaciarColaMini() {
      relojMini = null;
      const lote = colaMini.splice(0, 30);
      if (colaMini.length) relojMini = setTimeout(vaciarColaMini, 0);
      if (!lote.length) return;
      const ids = lote.map(x => x[0]);
      let guardadas = 0;
      const entregar = (id, uri) => {
        if (uri && estadoGlobal.user) { cacheMiniaturas[id] = uri; CajaLocal.guardar(CAJA_FOTOS, 'foto/' + id, uri); guardadas++; }
        lote.filter(x => x[0] === id).forEach(x => x[1](uri || null));
      };
      const alFinal = () => { if (guardadas) CajaLocal.podar(CAJA_FOTOS, MAX_FOTOS_GUARDADAS); };
      const unoPorUno = () => {
        let quedan = ids.length;
        ids.forEach(id => GS()
          .withFailureHandler(() => { entregar(id, null); if (!--quedan) alFinal(); })
          .withSuccessHandler(r => { entregar(id, r && r.success ? r.dataUri : null); if (!--quedan) alFinal(); })
          .obtenerMiniaturaBase64(id));
      };
      if (ids.length === 1) return unoPorUno();
      GS()
        .withFailureHandler(unoPorUno)
        .withSuccessHandler(r => {
          if (!r || !r.success || !r.fotos) return unoPorUno();   // Apps Script anterior a la v18
          ids.forEach(id => entregar(id, r.fotos[id] || null));
          alFinal();
        })
        .obtenerMiniaturasLote(ids);
    }
    /** Al abrir la app: las fotos guardadas pasan a memoria para pintarse sin esperar. */
    function precargarFotosGuardadas() {
      return CajaLocal.todas(CAJA_FOTOS).then(t => {
        Object.keys(t).forEach(k => { const id = k.replace(/^foto\//, ''); if (id && t[k]) cacheMiniaturas[id] = t[k]; });
      });
    }
    if (LS.get(CLAVE_TOKEN)) precargarFotosGuardadas();


    function actualizarAvataresUI() {
      if (!estadoGlobal.user) return;
      const url = urlFotoConCache(estadoGlobal.user.urlFotoPerfil) || obtenerAvatarFallback(estadoGlobal.user.nombre);
      const ids = ['avatarAlumnoBanner', 'avatarAlumnoSidebar', 'avatarCoachHeader', 'avatarCoachMovil', 'avatarAlumnoTop', 'avatarAlumnoPerfil'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.referrerPolicy = 'no-referrer';
        el.dataset.b64Try = '';
        el.onerror = () => cargarFotoSegura(el, true);
        el.src = url;
      });
    }

    function abrirModalPerfil() {
      if (!estadoGlobal.user) return;
      document.getElementById('perfNombre').value = estadoGlobal.user.nombre || '';
      document.getElementById('perfUsuario').value = estadoGlobal.user.usuario || '';
      document.getElementById('inputFotoPerfil').value = '';
      
      const url = urlFotoConCache(estadoGlobal.user.urlFotoPerfil) || obtenerAvatarFallback(estadoGlobal.user.nombre);
      const prev = document.getElementById('previewFotoPerfil');
      prev.referrerPolicy = 'no-referrer';
      prev.dataset.b64Try = '';
      prev.onerror = () => cargarFotoSegura(prev, true);
      prev.src = url;

      document.getElementById('passActual').value = '';
      document.getElementById('passNueva').value = '';
      document.getElementById('passConfirmar').value = '';

      cambiarTabPerfil('datos');
      document.getElementById('modalPerfil').classList.remove('hidden');
    }

    function cerrarModalPerfil() {
      document.getElementById('modalPerfil').classList.add('hidden');
    }

    function cambiarTabPerfil(tab) {
      const formDatos = document.getElementById('formPerfilDatos');
      const formPass = document.getElementById('formPerfilPass');
      const btnDatos = document.getElementById('tabBtnPerfilDatos');
      const btnPass = document.getElementById('tabBtnPerfilPass');

      if (tab === 'datos') {
        formDatos.classList.remove('hidden');
        formPass.classList.add('hidden');
        btnDatos.className = 'py-2 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950 transition';
        btnPass.className = 'py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition';
      } else {
        formDatos.classList.add('hidden');
        formPass.classList.remove('hidden');
        btnPass.className = 'py-2 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950 transition';
        btnDatos.className = 'py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition';
      }
    }

    async function previsualizarAvatar(input) {
      if (input.files && input.files[0]) {
        const base64 = await comprimirImagen(input.files[0], 500, 0.85);
        document.getElementById('previewFotoPerfil').src = base64;
      }
    }

    async function guardarCambiosPerfil() {
      const nuevoNombre = document.getElementById('perfNombre').value.trim();
      const nuevoUsuario = document.getElementById('perfUsuario').value.trim();
      const fileInput = document.getElementById('inputFotoPerfil');
      const btn = document.getElementById('btnGuardarPerfil');

      if (!nuevoNombre || !nuevoUsuario) {
        return avisar('El nombre y el usuario no pueden quedar vacíos.', 'atencion');
      }

      btn.innerText = 'Guardando en Drive y Sheets...';
      btn.disabled = true;

      let fotoBase64 = null;
      if (fileInput.files.length > 0) {
        fotoBase64 = await comprimirImagen(fileInput.files[0], 500, 0.85);
      }

      const payload = {
        idUsuario: estadoGlobal.user.id,
        nuevoNombre,
        nuevoUsuario,
        fotoBase64
      };

      GS()
        .withSuccessHandler(res => {
          btn.innerText = 'Guardar Cambios de Perfil';
          btn.disabled = false;
          if (!res.success) return avisar(res.error, 'error');

          estadoGlobal.user.nombre = res.userActualizado.nombre;
          estadoGlobal.user.usuario = res.userActualizado.usuario;
          estadoGlobal.user.folderId = res.userActualizado.folderId;
          if (res.userActualizado.urlFotoPerfil) {
            estadoGlobal.user.urlFotoPerfil = res.userActualizado.urlFotoPerfil;
          }

          const saludoEl = document.getElementById('saludoAlumno');
          if (saludoEl) {
            const primero = (estadoGlobal.user.nombre || '').trim().split(/\s+/)[0] || '';
            saludoEl.textContent = 'Hola, ' + primero.charAt(0).toUpperCase() + primero.slice(1).toLowerCase();
          }
          
          const coachWel = document.getElementById('coachWelcome');
          if (coachWel) coachWel.innerText = estadoGlobal.user.nombre;

          actualizarAvataresUI();
          avisar(res.mensaje, 'exito');
          cerrarModalPerfil();
        })
        .actualizarPerfilUsuario(payload);
    }

    async function ejecutarCambioPassword() {
      const actual = document.getElementById('passActual').value;
      const nueva = document.getElementById('passNueva').value;
      const confirmar = document.getElementById('passConfirmar').value;
      const btn = document.getElementById('btnGuardarPass');

      if (!actual || !nueva || !confirmar) return avisar('Completa los tres campos de contraseña.', 'atencion');
      if (nueva.length < 4) return avisar('La nueva contraseña debe tener al menos 4 caracteres.', 'atencion');
      if (nueva !== confirmar) return avisar('La nueva contraseña y su confirmación no coinciden.', 'atencion');

      btn.innerText = 'Cifrando y actualizando...';
      btn.disabled = true;

      const hashActual = await sha256(actual);
      const hashNuevo = await sha256(nueva);

      GS()
        .withSuccessHandler(res => {
          btn.innerText = 'Actualizar Contraseña';
          btn.disabled = false;
          avisar(res.mensaje || res.error, res.success ? 'exito' : 'error');
          if (res.success) cerrarModalPerfil();
        })
        .cambiarPasswordUsuario(estadoGlobal.user.id, hashActual, hashNuevo);
    }

    function cerrarSesion(sinAvisarServidor) {
      const tokenActual = estadoGlobal.user && estadoGlobal.user.token;
      if (tokenActual && sinAvisarServidor !== true) {
        try { google.script.run.withFailureHandler(() => {}).cerrarSesionServidor(tokenActual); } catch (e) {}
      }
      LS.del(CLAVE_TOKEN);
      LS.del(CLAVE_CACHE_SESION);          // los datos guardados en el teléfono se borran al salir
      CajaLocal.borrarDatosUsuario();       // v18: fotos de perfil y vistas guardadas
      if (typeof window.cancelarRecordatorioEntreno === 'function') window.cancelarRecordatorioEntreno();   // v19
      Object.keys(cacheMiniaturas).forEach(k => delete cacheMiniaturas[k]);
      Object.keys(cacheFotosDrive).forEach(k => delete cacheFotosDrive[k]);
      if (typeof panelCoach !== 'undefined') panelCoach = null;
      detenerCronometro();
      detenerSenalActividad();
      if (typeof detenerActividadCoach === 'function') detenerActividadCoach();
      if (typeof detenerVivoCoach === 'function') detenerVivoCoach();
      recordsData = null; recordsEdicion = null; clubesEdicion = null; precargaRecordsEn = '';
      LS.del(CLAVE_MARCAS_HOY);
      Object.values(estadoGlobal.charts || {}).forEach(c => { if (c) c.destroy(); });
      estadoGlobal = {
        user: null, alumnos: [], plantillas: [], semanas: [], progLocal: null, progresoActual: [], rutinaActual: [], catalogo: [],
        historialRutinas: [], edicionRutina: null, duplicando: null, diaSeleccionado: 'LUNES',
        charts: { peso: null, composicion: null, perimetrosCore: null, perimetrosBrazos: null, perimetrosPiernas: null, pliegues: null, diametros: null },
        timerInterval: null
      };
      bloquearSelectoresEdicion(false);
      ['coachView', 'alumnoView', 'modalPerfil', 'modal1RM', 'modalTablasMetricas', 'modalComposicion',
       'modalGraficoDelta', 'modalAyudaGym', 'modalFotoCompleta', 'modalCatalogo', 'modalEjercicio',
       'hojaCronometro', 'hojaCheckin', 'hojaDuplicar', 'avisoEdicionRutina', 'hojaMasCoach', 'hojaNivelCoach'].forEach(id => {
        const el = document.getElementById(id); if (el) el.classList.add('hidden');
      });
      ['contenedorComparativaCoach', 'contenedorRutinaAlumno', 'contenedorHistorialAlumno',
       'resumenInicioCards', 'listaConstructorRutina', 'contenedorHoyCoach', 'contenedorMensajesCoach', 'tarjetasAlumnosCoach'].forEach(id => {
        const el = document.getElementById(id); if (el) el.innerHTML = '';
      });
      const btnGuardar = document.getElementById('btnGuardarRutina');
      if (btnGuardar) { btnGuardar.disabled = false; btnGuardar.innerText = 'Guardar Rutina'; }
      document.getElementById('loginView').classList.remove('hidden');
      document.getElementById('loginPass').value = '';
      const btn = document.getElementById('btnLogin'); if (btn) btn.disabled = false;
    }

    function togglePlicometro() {
  const estado = document.getElementById('evTienePlicometro').value;
  const panel = document.getElementById('seccionPliegues');
  if (estado === 'SI') {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
    // Limpiar campos para evitar conflictos de cálculo
    ['evSubescapular', 'evTricipital', 'evBicipital', 'evSupracrestal', 'evSuprailiaca', 'evAbdominal'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }
}

function actualizarLabelCintura() {
  const sexo = document.getElementById('evSexo').value;
  const label = document.getElementById('labelCintura');
  if (sexo === 'M') {
    label.innerHTML = 'Cintura <span class="text-amber-400 font-black">(Medir en Ombligo)</span>';
  } else {
    label.innerText = 'Cintura (CM)';
  }
}

function calcularComposicionAutomatica() {
  const peso = parseFloat(document.getElementById('evPeso').value) || 0;
  const talla = parseFloat(document.getElementById('evTalla').value) || 0;
  const edad = parseFloat(document.getElementById('evEdad').value) || 0;
  const sexo = document.getElementById('evSexo').value;
  const cuello = parseFloat(document.getElementById('evCuello').value) || 0;
  const cintura = parseFloat(document.getElementById('evCintura').value) || 0;
  const cadera = parseFloat(document.getElementById('evCadera').value) || 0;
  const tienePlico = document.getElementById('evTienePlicometro').value === 'SI';
  
  // 1. Cálculo de IMC
  if (peso > 0 && talla > 0) {
    const tallaM = talla / 100;
    document.getElementById('evImc').value = (peso / (tallaM * tallaM)).toFixed(2);
  } else {
    document.getElementById('evImc').value = '';
  }

  // Inicializar en null para detectar si se intentó hacer el cálculo
  let porcentajeGrasa = null; 

  // 2. Cálculo de % Grasa
  if (!tienePlico) {
    // FÓRMULA MARINA EEUU
    if (peso > 0 && talla > 0 && cuello > 0 && cintura > 0) {
      if (sexo === 'M') {
        const val = cintura - cuello;
        if (val > 0) {
          const d = 1.0324 - 0.19077 * Math.log10(val) + 0.15456 * Math.log10(talla);
          porcentajeGrasa = (495 / d) - 450;
        } else {
          porcentajeGrasa = -1; // Forzar error matemático para activar alerta
        }
      } else if (sexo === 'F' && cadera > 0) {
        const val = cintura + cadera - cuello;
        if (val > 0) {
          const d = 1.29579 - 0.35004 * Math.log10(val) + 0.22100 * Math.log10(talla);
          porcentajeGrasa = (495 / d) - 450;
        } else {
          porcentajeGrasa = -1; // Forzar error matemático para activar alerta
        }
      }
    }
  } else {
    // FÓRMULA PLICOMETRÍA
    const tricipital = parseFloat(document.getElementById('evTricipital').value) || 0;
    const bicipital = parseFloat(document.getElementById('evBicipital').value) || 0;
    const subescapular = parseFloat(document.getElementById('evSubescapular').value) || 0;
    const suprailiaca = parseFloat(document.getElementById('evSuprailiaca').value) || 0;
    
    if (tricipital > 0 && bicipital > 0 && subescapular > 0 && suprailiaca > 0 && edad > 0) {
      const sumFolds = tricipital + bicipital + subescapular + suprailiaca;
      const logSum = Math.log10(sumFolds);
      let d = 0;
      if (sexo === 'M') {
        if(edad < 17) d = 1.1533 - 0.0643 * logSum;
        else if(edad <= 29) d = 1.1631 - 0.0632 * logSum;
        else if(edad <= 39) d = 1.1422 - 0.0544 * logSum;
        else if(edad <= 49) d = 1.1620 - 0.0700 * logSum;
        else d = 1.1715 - 0.0779 * logSum;
      } else {
        if(edad < 17) d = 1.1369 - 0.0598 * logSum;
        else if(edad <= 29) d = 1.1599 - 0.0717 * logSum;
        else if(edad <= 39) d = 1.1423 - 0.0632 * logSum;
        else if(edad <= 49) d = 1.1333 - 0.0612 * logSum;
        else d = 1.1339 - 0.0645 * logSum;
      }
      porcentajeGrasa = ((4.95 / d) - 4.5) * 100; 
    }
  }

  // 3. Mostrar Resultados en Pantalla y Controlar Alerta
  const alerta = document.getElementById('alertaMedidasAtipicas');
  const btnEval = document.getElementById('btnGuardarEvaluacion');
  const bloquearGuardado = (bloquear) => {
    if (!btnEval || btnEval.innerText !== 'Guardar Evaluación y Subir Fotos') return;   // no tocar mientras guarda
    btnEval.disabled = bloquear;
    btnEval.classList.toggle('opacity-40', bloquear);
    btnEval.classList.toggle('cursor-not-allowed', bloquear);
    btnEval.title = bloquear ? 'Corrige las medidas marcadas en rojo para poder guardar' : '';
  };

  if (porcentajeGrasa !== null) {
    if (porcentajeGrasa > 0 && porcentajeGrasa < 100) {
      // Cálculo exitoso y lógico: mostrar valores visualmente
      document.getElementById('evGrasa').value = porcentajeGrasa.toFixed(2);
      
      const masaGrasa = peso * (porcentajeGrasa / 100);
      const masaMagra = peso - masaGrasa; 
      document.getElementById('evMasa').value = masaMagra.toFixed(2);
      
      if (alerta) alerta.classList.add('hidden'); // Ocultar alerta
      bloquearGuardado(false);
    } else {
      // Cálculo atípico o matemáticamente imposible: limpiar casillas y mostrar alerta visual
      document.getElementById('evGrasa').value = '';
      document.getElementById('evMasa').value = '';
      if (alerta) alerta.classList.remove('hidden'); 
      bloquearGuardado(true);
    }
  } else {
    // Faltan datos para procesar la fórmula (Estado por defecto al cargar)
    document.getElementById('evGrasa').value = '';
    document.getElementById('evMasa').value = '';
    if (alerta) alerta.classList.add('hidden'); 
    bloquearGuardado(false);
  }
}
  
// --- LÓGICA DE GRÁFICOS DINÁMICOS DELTA ---
    let chartDeltaActivo = null;
    
    function abrirGraficoDelta(key, label, unidad) {
      document.getElementById('modalGraficoDelta').classList.remove('hidden');
      document.getElementById('tituloGraficoDelta').innerText = `Evolución: ${label}`;

      const progreso = estadoGlobal.progresoActual;
      if (!progreso || progreso.length === 0) return;

      const labels = progreso.map(p => p.fecha);
      const data = progreso.map(p => {
        const v = parseFloat(p[key]);
        return isNaN(v) || v === 0 ? null : v;
      });

      const ctx = document.getElementById('canvasGraficoDelta');
      if (chartDeltaActivo) chartDeltaActivo.destroy();

      chartDeltaActivo = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${label} (${unidad})`,
            data: data,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.3,
            spanGaps: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#1e293b' }, ticks: { color: '#cbd5e1' } },
            y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' }, title: { display: true, text: unidad, color: '#64748b' } }
          }
        }
      });
    }

        // --- DICCIONARIO GYM "EN CRISTIANO" ---
    const DICCIONARIO_GYM = {
      'TEMPO': {
        tituloHTML: '<div class="flex items-center gap-3"><span class="text-2xl text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">' + ico('timer', 'w-7 h-7') + '</span><div><span class="block text-[11px] text-emerald-400 font-bold tracking-widest uppercase">Metodología Clave</span><h3 class="text-base sm:text-lg font-black text-white">Guía de TEMPO (4 dígitos: ej. 3-1-1-0)</h3></div></div>',
        descHTML: '<p class="text-xs text-slate-300 mb-4">Controla los segundos exactos de cada fase de la repetición para maximizar la hipertrofia y prevenir lesiones. Los dígitos van en pareja: <b class="text-emerald-300">bajada</b> y <b class="text-amber-300">subida</b>.</p>' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
          '<div class="bg-emerald-500/5 p-3 sm:p-4 rounded-xl border border-emerald-500/30"><span class="block text-xs font-black text-emerald-300 mb-1.5 tracking-wider">1º EXCÉNTRICA</span><span class="text-xs text-slate-300">Descenso o bajada negativa, controlada, resistiendo la carga.</span></div>' +
          '<div class="bg-emerald-500/5 p-3 sm:p-4 rounded-xl border border-emerald-500/30"><span class="block text-xs font-black text-emerald-300 mb-1.5 tracking-wider">2º PAUSA EXCÉNTRICA</span><span class="text-xs text-slate-300">Isometría en el punto de estiramiento. Elimina el rebote elástico.</span></div>' +
          '<div class="bg-amber-500/5 p-3 sm:p-4 rounded-xl border border-amber-500/30"><span class="block text-xs font-black text-amber-300 mb-1.5 tracking-wider">3º CONCÉNTRICA</span><span class="text-xs text-slate-300">Fase de empuje o subida. Máxima aceleración voluntaria.</span></div>' +
          '<div class="bg-amber-500/5 p-3 sm:p-4 rounded-xl border border-amber-500/30"><span class="block text-xs font-black text-amber-300 mb-1.5 tracking-wider">4º PAUSA CONCÉNTRICA</span><span class="text-xs text-slate-300">Contracción de pico o reajuste antes de la siguiente repetición.</span></div>' +
          '</div>'
      },
      'BISERIE': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">' + ico('zap', 'w-5 h-5') + ' Bi-Serie (Súper Serie)</h3>', 
        descHTML: 'Es hacer 2 ejercicios distintos de corrido, uno justo después del otro. Solo descansas cuando terminas ambos. Prepárate para sudar.' 
      },
      'TRISERIE': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">' + ico('flame', 'w-5 h-5') + ' Tri-Serie</h3>', 
        descHTML: 'Igual que la Bi-Serie, pero con 3 ejercicios seguidos sin parar. Es un trabajo intenso para agotar el músculo rápido.' 
      },
      'DROPSET': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">' + ico('trending-down', 'w-5 h-5') + ' Drop Set (Serie Descendente)</h3>', 
        descHTML: 'Haces el ejercicio hasta que no puedas más (FALLO) o poner un peso que en la ultima repetición ya no puedas mas (FALLO), le bajas el peso rápido y sigues haciendo más repeticiones sin descansar. Te ayuda a exprimir al máximo tus fuerzas.' 
      },
      'ASCENDING': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">' + ico('trending-up', 'w-5 h-5') + ' Serie Ascendente</h3>', 
        descHTML: 'Vas subiendo el peso en cada serie que haces. Excelente para ganar fuerza poco a poco en el mismo entrenamiento.' 
      },
      'PIRAMIDE': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">' + ico('arrow-up-down', 'w-5 h-5') + ' Pirámide Completa</h3>', 
        descHTML: 'Empiezas con poco peso y hartas repeticiones, vas subiendo el peso (y bajando repeticiones) y luego vuelves a bajar el peso. Un bombardeo total para el músculo.' 
      }
    };

    function mostrarAyudaGym(termino) {
      const info = DICCIONARIO_GYM[termino];
      if (!info) return;
      document.getElementById('headerAyudaGym').innerHTML = info.tituloHTML;
      document.getElementById('descAyudaGym').innerHTML = info.descHTML;
      document.getElementById('modalAyudaGym').classList.remove('hidden');
    }

    // ==================== ACTIVIDAD (v11): señal de la app del alumno ====================
    // Cada 2 minutos (solo con la app abierta y visible) avisa al servidor: origen y cuánto entrenó hoy.
    const CLAVE_MARCAS_HOY = 'proc_marcas_hoy_v1';
    let senalIntervalo = null, senalPendiente = null, ultimaSenal = 0;

    function marcasHoy() {
      const hoy = fechaLocalISO();
      try {
        const d = JSON.parse(LS.get(CLAVE_MARCAS_HOY) || 'null');
        if (d && d.fecha === hoy && d.claves) return d;
      } catch (e) {}
      return { fecha: hoy, claves: {} };
    }
    /** Lo llama escribirProg() cada vez que el alumno marca o desmarca una serie o un ejercicio. */
    function registrarMarcaHoy(clave, marcada) {
      if (!estadoGlobal.user || estadoGlobal.user.rol !== 'ALUMNO') return;
      const d = marcasHoy();
      if (marcada) d.claves[clave] = 1; else delete d.claves[clave];
      LS.set(CLAVE_MARCAS_HOY, JSON.stringify(d));
      clearTimeout(senalPendiente);
      senalPendiente = setTimeout(enviarSenalActividad, 5000);   // agrupa varios toques seguidos (v18: 5 s para el «en vivo» del coach)
    }
    function resumenHoy() {
      const claves = Object.keys(marcasHoy().claves);
      const series = claves.filter(k => /::s\d+_ok$/.test(k)).length;
      const ejercicios = new Set(claves.map(k => k.split('::')[0])).size;
      return { series: series || (ejercicios ? ejercicios : 0), ejercicios };
    }
    /** v18 · Lo que el coach ve «en vivo»: series marcadas HOY por ejercicio, con sus kg. */
    function avanceEnVivo() {
      const claves = Object.keys(marcasHoy().claves);
      if (!claves.length) return null;
      const porEj = {}, dias = {};
      claves.forEach(k => {
        const m = /^([^|]+)\|(.+?)::(?:s(\d+)_ok|ok)$/.exec(k);
        if (!m) return;
        const clave = m[1] + '|' + m[2];
        dias[m[1]] = (dias[m[1]] || 0) + 1;
        const e = porEj[clave] = porEj[clave] || { d: m[1], b: m[2], s: [], kg: [], ok: false };
        if (m[3]) { e.s.push(+m[3]); e.kg.push(leerProg(clave + '::s' + m[3] + '_peso') || ''); }
        else e.ok = true;
      });
      const dia = Object.keys(dias).sort((a, b) => dias[b] - dias[a])[0] || '';
      const e = Object.values(porEj).filter(x => x.d === dia).slice(0, 40).map(x => {
        const orden = x.s.map((n, i) => [n, x.kg[i]]).sort((a, b) => a[0] - b[0]);
        return { b: x.b, s: orden.map(o => o[0]), kg: orden.map(o => o[1]), ok: x.ok };
      });
      return { d: dia, e: e };
    }
    function origenApp() {
      try { return (window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) ? 'app' : 'web'; } catch (e) { return 'web'; }
    }
    function enviarSenalActividad() {
      if (!estadoGlobal.user || estadoGlobal.user.rol !== 'ALUMNO' || document.hidden) return;
      ultimaSenal = Date.now();
      const r = resumenHoy();
      try {
        GS().withSuccessHandler(() => {}).withFailureHandler(() => {})
          .registrarActividad({ origen: origenApp(), seriesHoy: r.series, ejerciciosHoy: r.ejercicios, fecha: fechaLocalISO(), vivo: avanceEnVivo() });
      } catch (e) {}
    }
    function iniciarSenalActividad() {
      detenerSenalActividad();
      enviarSenalActividad();
      senalIntervalo = setInterval(enviarSenalActividad, 120000);
    }
    function detenerSenalActividad() {
      clearInterval(senalIntervalo); clearTimeout(senalPendiente);
      senalIntervalo = null; senalPendiente = null;
    }
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && senalIntervalo && Date.now() - ultimaSenal > 60000) enviarSenalActividad();
    });

    // ==================== RÉCORDS (v12 «Kinetic Obsidian»): pantalla compartida por alumno y coach ====================
    let recordsData = null, recordsContenedor = '', recordsEjSel = -1, recordsGrupo = 'M', recordsEdicion = null;
    let recordsPeriodo = 'S', clubesEdicion = null;
    const GRUPOS_RANKING = [['M', 'Hombres'], ['F', 'Mujeres'], ['X', 'Sin categoría']];
    const PERIODOS_REC = [['S', 'Esta semana'], ['M', 'Este mes'], ['H', 'Histórico']];
    const REACCIONES_REC = [['PUNO', '👊'], ['FUEGO', '🔥'], ['APLAUSO', '👏']];
    const MEDALLAS = ['🥇', '🥈', '🥉'];
    const LIMITE_PERIODO = { S: 7, M: 30, H: 0 };

    function cargarRecords(idCont) {
      recordsContenedor = idCont;
      const cont = document.getElementById(idCont);
      if (!cont) return;
      if (!recordsData) cont.innerHTML = esqueleto('tarjetas', 3, 'Cargando récords');
      else if (!cont.childElementCount) renderRecords();   // v18.1: ya se trajo en segundo plano → se ve al instante
      // v18: mientras llega la respuesta, se muestra el último muro guardado en el teléfono
      const claveRec = 'records/' + ((estadoGlobal.user && estadoGlobal.user.id) || '');
      let llegoServidor = false;
      if (!recordsData) CajaLocal.leerJSON(CAJA_VISTAS, claveRec).then(g => {
        if (!g || !g.success || llegoServidor || recordsData || recordsContenedor !== idCont) return;
        aplicarDatosRecords(g);
        renderRecords();
      });
      GS().withSuccessHandler(res => {
        llegoServidor = true;
        if (!res || !res.success) {
          cont.innerHTML = '<div class="ko"><p class="t-err text-sm">' + escHtml((res && res.error) || 'No se pudieron cargar los récords.') + '</p></div>';
          return;
        }
        aplicarDatosRecords(res);
        if (estadoGlobal.user) CajaLocal.guardarJSON(CAJA_VISTAS, claveRec, res);
        renderRecords();
      }).obtenerRecords();
    }
    function aplicarDatosRecords(res) {
      recordsData = res;
      if (recordsEjSel >= (res.ranking || []).length) recordsEjSel = -1;
      if (res.esCoach) {
        recordsEdicion = (res.ejercicios || []).map(e => ({ idEjercicio: e.idEjercicio, nombre: e.nombre }));
        clubesEdicion = (res.clubes || []).map(c => ({ idEjercicio: c.idEjercicio, nombre: c.ejercicio, kg: c.kg }));
      }
    }
    // v18.1 · El muro se trae en segundo plano unos segundos después de abrir la app,
    // así al tocar «Récords» ya está listo (y queda guardado en el teléfono para la próxima vez).
    let precargaRecordsEn = '';
    function precargarRecords() {
      const quien = estadoGlobal.user && estadoGlobal.user.id;
      if (!quien || precargaRecordsEn === quien) return;   // una vez por sesión
      precargaRecordsEn = quien;
      setTimeout(() => {
        if (recordsData || !estadoGlobal.user) return;
        const id = estadoGlobal.user.id;
        GS().withFailureHandler(() => {})
          .withSuccessHandler(res => {
            if (!res || !res.success || recordsData || !estadoGlobal.user || estadoGlobal.user.id !== id) return;
            aplicarDatosRecords(res);
            CajaLocal.guardarJSON(CAJA_VISTAS, 'records/' + id, res);
            const cont = recordsContenedor && document.getElementById(recordsContenedor);
            if (cont && cont.offsetParent !== null) renderRecords();   // si justo está mirando el muro
          })
          .obtenerRecords();
      }, 4000);
    }

    const kgRec = n => (Math.round(Number(n) * 10) / 10).toString().replace('.', ',') + ' kg';
    const numRec = n => (Math.round(Number(n) * 10) / 10).toString().replace('.', ',');
    const fechaRec = f => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(f || '')); return m ? m[3] + '/' + m[2] : ''; };
    // v14: los nombres de Material Symbols se traducen a íconos Lucide integrados (funcionan sin internet)
    const MS_A_LUCIDE = { add: 'plus', close: 'x', shield: 'shield', check_circle: 'circle-check', emoji_events: 'trophy', fact_check: 'clipboard-check',
      fitness_center: 'dumbbell', local_fire_department: 'flame', lock: 'lock', military_tech: 'medal', share: 'share-2', trending_up: 'trending-up',
      verified: 'badge-check', inbox: 'inbox', workspace_premium: 'award', chat: 'message-square', track_changes: 'target', history_edu: 'history',
      person: 'user', visibility: 'eye', visibility_off: 'eye-off', add_circle: 'circle-plus', group: 'users', schedule: 'clock', monitor_weight: 'scale', arrow_upward: 'arrow-up' };
    const icoRec = (n, extra = '') => {
      const m = /!text-\[(\d+)px\]/.exec(extra);
      const px = m ? +m[1] : 20;
      return ico(MS_A_LUCIDE[n] || n, 'ms-l ' + extra.replace(/!text-\[\d+px\]/, '').trim()).replace('<svg ', `<svg style="width:${px}px;height:${px}px" `);
    };
    function haceRec(ts, fecha) {
      if (!ts) return fechaRec(fecha);
      const min = Math.floor((Date.now() - ts) / 60000);
      if (min < 1) return 'Ahora';
      if (min < 60) return 'Hace ' + min + ' min';
      if (min < 1440) return 'Hace ' + Math.floor(min / 60) + ' h';
      const d = Math.floor(min / 1440);
      if (d === 1) return 'Ayer';
      if (d < 7) return 'Hace ' + d + ' días';
      return fechaRec(fecha) || new Date(ts).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
    }
    const enPeriodoRec = ts => !LIMITE_PERIODO[recordsPeriodo] || ts >= Date.now() - LIMITE_PERIODO[recordsPeriodo] * 86400000;
    const ejFiltroRec = () => recordsEjSel >= 0 && recordsData && recordsData.ranking[recordsEjSel] ? recordsData.ranking[recordsEjSel].nombre : '';

    // Avatar: iniciales debajo y la foto de perfil (privada en Drive) encima cuando llega
    function avatarRec(p, tam = 40) {
      const ini = String(p.nombre || '?').split(/\s+/).filter(x => x).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
      const foto = p.foto ? `<img alt="" referrerpolicy="no-referrer" data-foto-rec="${escHtml(p.foto)}" class="hidden">` : '';
      return `<span class="ko-av" style="width:${tam}px;height:${tam}px;font-size:${Math.round(tam * 0.38)}px">${escHtml(ini)}${foto}</span>`;
    }
    function cargarFotosRec(cont) {
      cont.querySelectorAll('img[data-foto-rec]').forEach(img => {
        pedirMiniaturaPerfil(img.dataset.fotoRec).then(uri => { if (uri) { img.src = uri; img.classList.remove('hidden'); } });
      });
    }

    function renderRecords() {
      const cont = document.getElementById(recordsContenedor);
      const d = recordsData;
      if (!cont || !d) return;
      if (!d.esCoach) return renderRecordsAlumno(cont, d);
      const partes = [bloqueHeroRecords(d), bloqueFiltrosRecords(d)];
      if (d.esCoach) {
        partes.push(bloquePendientesRecords(d));
      } else {
        partes.push(bloqueMostrarRecords(d));
      }
      partes.push(bloqueHito(d));
      partes.push(bloqueClubes(d));
      partes.push(bloqueRanking(d));
      partes.push(bloqueFeed(d));
      partes.push(bloqueConstancia(d));
      if (d.esCoach) {
        partes.push(bloqueEjerciciosRanking());
        partes.push(bloqueEditarClubes(d));
      } else {
        partes.push(bloqueMisRecords(d));
        if ((d.ejercicios || []).length) partes.push(`<div class="ko-cta pt-1"><button onclick="abrirModalRecord()" class="ko-btn ko-glow kf w-full py-4 text-[15px] uppercase tracking-wide flex items-center justify-center gap-2">${icoRec('add')} Registrar mi nuevo récord</button></div>`);
      }
      cont.innerHTML = `<div class="ko space-y-4">${partes.filter(x => x).join('')}</div>`;
      cargarFotosRec(cont);
    }

    const tituloRec = (ico, txt, extra = '') => `<div class="flex items-center justify-between gap-2 mb-3"><h3 class="kf text-[18px] leading-6 font-semibold flex items-center gap-2">${icoRec(ico, 't-lima')} ${txt}</h3>${extra}</div>`;
    const tarjetaRec = (titulo, cuerpo, extra = '') => `<div class="ko-card ${extra}"><h3 class="kf text-[17px] font-semibold mb-3">${titulo}</h3>${cuerpo}</div>`;

    function bloqueHeroRecords(d) {
      const r = (d.resumen || {})[recordsPeriodo] || {};
      const pct = r.enviados ? Math.round(r.aprobados / r.enviados * 100) + '%' : '—';
      const etq = { S: 'esta semana', M: 'este mes', H: 'en total' }[recordsPeriodo];
      return `
        <div class="ko-card">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 shrink-0 rounded-full ko-hi flex items-center justify-center">${icoRec('emoji_events', 't-lima !text-[30px]', true)}</div>
            <div class="min-w-0">
              <div class="flex items-center gap-2"><span class="ko-pill b-lima">${d.esCoach ? 'Tu equipo' : 'Tu comunidad'}</span><span class="ko-ping"></span></div>
              <h2 class="kf text-[26px] leading-8 font-bold uppercase tracking-tight mt-1">Muro de récords</h2>
              <p class="text-xs t-mu truncate">Celebrando cada kilo y cada conquista</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-1 mt-4 rounded-xl p-2.5 text-center" style="background:var(--ko-min);border:1px solid var(--ko-borde)">
            <div><p class="kf text-[22px] font-bold t-lima">${r.prs || 0}</p><p class="ko-lbl t-mu">PRs ${etq}</p></div>
            <div><p class="kf text-[22px] font-bold t-cian">${r.club || 0}</p><p class="ko-lbl t-mu">Nuevos en club</p></div>
            <div><p class="kf text-[22px] font-bold">${pct}</p><p class="ko-lbl t-mu">Validados coach</p></div>
          </div>
        </div>`;
    }

    function bloqueFiltrosRecords(d) {
      const chips = (d.ranking || []).length ? `<div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button onclick="recordsEjSel=-1; renderRecords()" class="ko-chip ${recordsEjSel < 0 ? 'on' : ''}">${ico('flame', 'w-4 h-4')} Todos</button>
          ${d.ranking.map((e, i) => `<button onclick="recordsEjSel=${i}; renderRecords()" class="ko-chip ${i === recordsEjSel ? 'on' : ''}">${escHtml(e.nombre)}</button>`).join('')}
        </div>` : '';
      const seg = PERIODOS_REC.map(([k, t]) => `<button onclick="recordsPeriodo='${k}'; renderRecords()" class="${recordsPeriodo === k ? 'on' : ''}">${t}</button>`).join('');
      return `<div class="space-y-2">${chips}<div class="ko-seg">${seg}</div></div>`;
    }

    function bloqueMostrarRecords(d) {
      const on = !!d.mostrar;
      return `
        <div class="ko-card flex items-center justify-between gap-3 ${on ? '' : ''}" style="${on ? 'box-shadow:inset 0 0 0 1px rgba(16,185,129,.4)' : ''}">
          <div class="min-w-0 flex items-start gap-2.5">
            ${icoRec(on ? 'visibility' : 'lock', on ? 't-lima' : 't-mu')}
            <div><p class="text-sm font-bold">Mostrar mis récords</p>
            <p class="text-xs t-mu mt-0.5">${on ? 'Tus compañeros ven tu nombre, tu foto de perfil y tus marcas.' : 'Solo tú y tu coach ven tus marcas. Actívalo para aparecer con tu nombre y foto.'}</p></div>
          </div>
          <button onclick="alternarMostrarRecords()" id="btnMostrarRecords" role="switch" aria-checked="${on}" class="ko-sw ${on ? 'on' : ''}"><span></span></button>
        </div>`;
    }
    function alternarMostrarRecords() {
      const nuevo = !(recordsData && recordsData.mostrar);
      const btn = document.getElementById('btnMostrarRecords'); if (btn) btn.disabled = true;
      GS().withSuccessHandler(res => {
        if (!res || !res.success) { if (btn) btn.disabled = false; return mostrarToast('❌ ' + ((res && res.error) || 'No se pudo cambiar.')); }
        mostrarToast((res.mostrar ? '🏆 ' : '🔒 ') + res.mensaje);
        cargarRecords(recordsContenedor);
      }).cambiarMostrarRecords(nuevo);
    }

    function reaccionesRec(f) {
      if (!f.id) return '';
      const botones = REACCIONES_REC.map(([t, e]) => `<button onclick="reaccionarRec('${escHtml(f.id)}','${t}')" data-reac="${escHtml(f.id)}" class="ko-reac ${f.miReaccion === t ? 'on' : ''}" aria-label="${t}"><span class="text-base leading-none">${e}</span><span>${(f.reacciones || {})[t] || 0}</span></button>`).join('');
      return `<div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">${botones}</div>`;
    }
    function reaccionarRec(id, tipo) {
      const d = recordsData; if (!d) return;
      const items = (d.feed || []).filter(f => f.id === id).concat(d.hito && d.hito.id === id && !(d.feed || []).includes(d.hito) ? [d.hito] : []);
      if (!items.length) return;
      const antes = JSON.stringify({ r: items[0].reacciones, m: items[0].miReaccion });
      const nueva = items[0].miReaccion === tipo ? '' : tipo;
      items.forEach(f => {                       // respuesta inmediata en pantalla
        f.reacciones = Object.assign({ PUNO: 0, FUEGO: 0, APLAUSO: 0 }, f.reacciones);
        if (f.miReaccion) f.reacciones[f.miReaccion] = Math.max(0, f.reacciones[f.miReaccion] - 1);
        if (nueva) f.reacciones[nueva]++;
        f.miReaccion = nueva;
      });
      renderRecords();
      GS().withFailureHandler(() => { const a = JSON.parse(antes); items.forEach(f => { f.reacciones = a.r; f.miReaccion = a.m; }); renderRecords(); mostrarToast('❌ Sin conexión: no se guardó la reacción.'); })
        .withSuccessHandler(res => {
          if (res && res.success) items.forEach(f => { f.reacciones = res.reacciones; f.miReaccion = res.mia; });
          else { const a = JSON.parse(antes); items.forEach(f => { f.reacciones = a.r; f.miReaccion = a.m; }); mostrarToast('❌ ' + ((res && res.error) || 'No se pudo reaccionar.')); }
          renderRecords();
        }).reaccionarRecord(id, tipo);
    }

    const nombreRec = p => `${escHtml(p.nombre)}${p.yo ? ' <span class="ko-pill b-lima-s !py-0.5 !px-1.5 align-middle">Tú</span>' : ''}${p.oculto && recordsData && recordsData.esCoach ? ` <span class="t-dim align-middle" title="Oculto para sus compañeros">${icoRec('lock', '!text-[14px]')}</span>` : ''}`;
    const ratioRec = r => r ? numRec(r) + '×' : '—';

    function bloqueHito(d) {
      const h = d.hito;
      if (!h) return '';
      const club = (h.clubes || []).length ? `<div class="mt-2 py-1.5 px-2.5 rounded-lg ko-hi flex items-center gap-2">${icoRec('verified', 't-cian', true)}<p class="text-xs font-semibold t-cian">¡Entró al club de ${numRec(h.clubes[h.clubes.length - 1])} kg en ${escHtml(h.ejercicio.toLowerCase())}!</p></div>` : '';
      const mejora = h.delta > 0 ? '+' + numRec(h.delta) + ' kg' : (h.primero ? '1.º' : '=');
      return `
        <div class="ko-card ko-dest ko-glow relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none" style="background:rgba(16,185,129,.10);filter:blur(24px)"></div>
          <div class="relative flex items-center justify-between gap-2 mb-3">
            <span class="ko-pill b-lima-s">${icoRec('local_fire_department', '!text-[16px]', true)} Hito del día</span>
            <span class="text-xs t-mu">${haceRec(h.ts, h.fechaRevision || h.fecha)}</span>
          </div>
          <div class="relative flex items-center gap-3 mb-3 min-w-0">
            <span class="relative">${avatarRec(h, 48)}<span class="absolute -bottom-1 -right-1 rounded-full p-0.5" style="background:var(--ko-min)">${icoRec('military_tech', 't-lima !text-[15px]', true)}</span></span>
            <div class="min-w-0"><p class="kf text-[18px] leading-6 font-semibold truncate">${nombreRec(h)}</p>
            <p class="text-xs t-mu">${escHtml(fechaRec(h.fecha))} · ${h.reps} ${h.reps === 1 ? 'repetición' : 'repeticiones'}</p></div>
          </div>
          <div class="relative ko-min rounded-xl p-4">
            <div class="flex items-end justify-between gap-2 flex-wrap">
              <div class="min-w-0"><span class="ko-lbl t-mu block">Ejercicio y carga</span>
              <h3 class="kf text-[22px] leading-7 font-bold t-lima2 tracking-tight">${escHtml(h.ejercicio)}</h3></div>
              <div class="text-right"><span class="kf text-[40px] leading-[44px] font-extrabold tracking-tight">${numRec(h.peso)}</span><span class="kf text-[18px] font-bold t-lima ml-0.5">KG</span></div>
            </div>
            ${club}
            <div class="grid grid-cols-3 gap-2 mt-3 rounded-lg p-2 text-center" style="background:var(--ko-c)">
              <div><span class="ko-lbl t-mu block">Repeticiones</span><span class="text-sm font-bold">${h.reps}</span></div>
              <div><span class="ko-lbl t-mu block">Mejora</span><span class="text-sm font-bold ${h.delta > 0 ? 't-lima' : ''}">${mejora}</span></div>
              <div><span class="ko-lbl t-mu block">× peso corp.</span><span class="text-sm font-bold t-lima">${ratioRec(h.ratio)}</span></div>
            </div>
          </div>
          ${h.comentario ? `<p class="relative text-sm t-mu italic mt-3">“${escHtml(h.comentario)}”</p>` : ''}
          ${h.coach ? `<div class="relative flex items-center justify-between gap-2 rounded-lg px-3 py-2 mt-3" style="background:var(--ko-min);border:1px solid var(--ko-borde)">
            <span class="flex items-center gap-2 min-w-0 text-xs">${icoRec('fact_check', 't-lima')}<span class="truncate">Validado por <strong class="t-lima2">${escHtml(h.coach)}</strong></span></span>${icoRec('check_circle', 't-lima !text-[18px]', true)}</div>` : ''}
          <div class="relative mt-3">${reaccionesRec(h)}</div>
        </div>`;
    }

    function bloqueClubes(d) {
      const clubes = d.clubes || [];
      if (!clubes.length) return d.esCoach ? '' : '';
      const colores = ['b-lima-s', 'b-cian-s', 'b-nar-s'];
      const ico = ['shield', 'emoji_events', 'workspace_premium'];
      const tarjetas = clubes.map((c, i) => {
        const m = c.miembros || [];
        const pila = m.length ? `<div class="ko-stack flex items-center mt-3">${m.slice(0, 4).map(p => avatarRec(p, 26)).join('')}${m.length > 4 ? `<span class="ko-av" style="width:26px;height:26px;font-size:10px;margin-left:-6px;box-shadow:0 0 0 2px var(--ko-c)">+${m.length - 4}</span>` : ''}</div>`
          : '<p class="text-xs t-dim mt-3">¡Sé el primero!</p>';
        const yoDentro = m.some(p => p.yo);
        return `<div class="ko-card !p-3 flex flex-col justify-between" style="${yoDentro ? 'box-shadow:inset 0 0 0 1px rgba(16,185,129,.5)' : ''}">
          <div><div class="flex items-center justify-between mb-1 gap-1"><span class="ko-pill ${colores[i % 3]} !px-1.5 !py-0.5 !text-[11px] truncate">${escHtml(c.ejercicio.split(' ')[0])}</span>${icoRec(ico[i % 3], 't-mu !text-[16px]')}</div>
          <p class="kf text-[18px] font-bold">${numRec(c.kg)} KG</p>
          <p class="text-xs leading-tight t-mu">${escHtml(c.ejercicio)}</p></div>
          ${pila}
          <p class="text-[11px] t-dim mt-1.5">${m.length} ${m.length === 1 ? 'miembro' : 'miembros'}${yoDentro ? ' · <span class="t-lima font-bold">incluido tú</span>' : ''}</p>
        </div>`;
      }).join('');
      return `<div>${tituloRec('workspace_premium', 'Clubes de honor')}<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${tarjetas}</div></div>`;
    }

    function bloqueRanking(d) {
      const ranking = d.ranking || [];
      if (!ranking.length) return `<div class="ko-card">${tituloRec('emoji_events', 'Ranking')}<p class="text-xs t-mu">${d.esCoach ? 'Elige abajo los ejercicios del ranking para empezar.' : 'Tu coach aún no eligió los ejercicios del ranking.'}</p></div>`;
      const idx = recordsEjSel >= 0 ? recordsEjSel : 0;
      const ej = ranking[idx] || ranking[0];
      const grupos = (ej.periodos && ej.periodos[recordsPeriodo]) || ej.grupos || {};
      const tabs = GRUPOS_RANKING.map(([g, t]) => {
        const n = (grupos[g] || []).length;
        if (g === 'X' && !n) return '';
        return `<button onclick="recordsGrupo='${g}'; renderRecords()" class="${recordsGrupo === g ? 'on' : ''}">${t} <span class="t-dim">${n}</span></button>`;
      }).join('');
      const lista = grupos[recordsGrupo] || [];
      const filas = lista.length ? lista.map(r => `
        <div class="ko-row ${r.yo ? 'yo' : ''}">
          <span class="w-7 text-center ${r.posicion && r.posicion <= 3 ? 'text-lg' : 'kf text-sm t-dim font-bold'}">${r.posicion ? (MEDALLAS[r.posicion - 1] || r.posicion) : '·'}</span>
          ${avatarRec(r, 34)}
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold truncate">${nombreRec(r)}</p>
            <p class="text-[11px] t-mu">${r.validado ? '' + ico('circle-check', 'w-4 h-4') + ' Validado' : 'De sus series'}${r.fecha ? ' · ' + fechaRec(r.fecha) : ''}${r.ratio ? ' · ' + ratioRec(r.ratio) + ' su peso' : ''}${r.fueraDeRanking ? ' · solo tú lo ves' : ''}</p>
          </div>
          <span class="kf shrink-0 text-[18px] font-bold ${r.yo ? 't-lima' : ''}">${numRec(r.peso)}<span class="text-xs t-mu ml-0.5">kg</span></span>
        </div>`).join('') : '<p class="text-xs t-mu py-2">Todavía no hay marcas en esta categoría y periodo.</p>';
      return `<div class="ko-card">
        ${tituloRec('emoji_events', 'Ranking', `<span class="text-xs t-cian font-bold uppercase truncate max-w-[45%]">${escHtml(ej.nombre)}</span>`)}
        <div class="ko-seg mb-3">${tabs}</div>
        <div class="space-y-2">${filas}</div>
        <p class="text-[11px] t-dim mt-3">${recordsEjSel < 0 && ranking.length > 1 ? 'Elige un ejercicio arriba para ver su ranking. ' : ''}Separado por sexo según la última evaluación.</p>
      </div>`;
    }

    function etiquetaFeed(f) {
      if (f.tipo === 'AUTO') return `<span class="ko-pill" style="background:var(--ko-hi);color:var(--ko-mu)">${icoRec('fitness_center', '!text-[13px]')} De su rutina</span>`;
      if ((f.clubes || []).length) return `<span class="ko-pill b-cian-s">${icoRec('shield', '!text-[13px]', true)} Club ${numRec(f.clubes[f.clubes.length - 1])}</span>`;
      if (f.delta > 0) return `<span class="ko-pill b-lima-s">${icoRec('trending_up', '!text-[13px]')} +${numRec(f.delta)} kg PR</span>`;
      if (f.primero) return `<span class="ko-pill b-nar-s">${icoRec('military_tech', '!text-[13px]', true)} Primer récord</span>`;
      return `<span class="ko-pill b-lima-s">${icoRec('verified', '!text-[13px]', true)} Validado</span>`;
    }

    function bloqueFeed(d) {
      const filtro = ejFiltroRec();
      const lista = (d.feed || []).filter(f => enPeriodoRec(f.ts) && (!filtro || f.ejercicio === filtro) && !(d.hito && f.id && f.id === d.hito.id));
      const vacio = `<p class="text-xs t-mu">${(d.feed || []).length ? 'No hay récords en este periodo o ejercicio.' : 'Todavía no hay récords nuevos. ¡El próximo puede ser el tuyo!'}</p>`;
      const items = lista.map(f => `
        <div class="ko-card space-y-3" style="${f.yo ? 'box-shadow:inset 0 0 0 1px rgba(16,185,129,.4)' : ''}">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-3 min-w-0">${avatarRec(f, 40)}
              <div class="min-w-0"><p class="text-sm font-bold truncate">${nombreRec(f)}</p><p class="text-xs t-mu">${haceRec(f.ts, f.fechaRevision || f.fecha)}</p></div></div>
            ${etiquetaFeed(f)}
          </div>
          <div class="ko-min rounded-xl px-3 py-2.5 flex items-end justify-between gap-2">
            <div class="min-w-0"><span class="ko-lbl t-mu block">${escHtml(f.ejercicio)}</span>
            ${f.ratio ? `<span class="text-xs t-mu">${ratioRec(f.ratio)} su peso corporal</span>` : ''}</div>
            <span class="shrink-0"><span class="kf text-[26px] font-bold">${numRec(f.peso)}</span><span class="kf text-sm t-lima font-bold ml-0.5">KG</span>${f.reps ? `<span class="text-sm t-mu"> × ${f.reps}</span>` : ''}</span>
          </div>
          ${f.comentario ? `<p class="text-[13px] t-mu italic">“${escHtml(f.comentario)}”</p>` : ''}
          ${f.tipo === 'VALIDADO' ? `<div class="flex items-center justify-between gap-2 flex-wrap">
            ${f.coach ? `<span class="text-xs t-mu flex items-center gap-1">${icoRec('fact_check', 't-lima !text-[15px]')} Validado por <strong class="t-lima2">${escHtml(f.coach)}</strong></span>` : '<span></span>'}
            ${reaccionesRec(f)}</div>` : ''}
        </div>`).join('');
      return `<div>${tituloRec('history_edu', 'Récords recientes', `<span class="text-xs t-mu">${lista.length}</span>`)}<div class="space-y-3">${items || `<div class="ko-card">${vacio}</div>`}</div></div>`;
    }

    function bloqueConstancia(d) {
      const lista = d.constancia || [];
      if (!lista.length) return '';
      return `<div class="ko-card">${tituloRec('local_fire_department', 'Constancia · semanas seguidas')}<div class="space-y-2">${lista.map((c, i) => `
        <div class="ko-row ${c.yo ? 'yo' : ''}">
          <span class="w-7 text-center text-lg">${MEDALLAS[i] || `<span class="kf text-sm t-dim font-bold">${i + 1}</span>`}</span>
          ${avatarRec(c, 30)}
          <p class="flex-1 min-w-0 text-sm font-bold truncate">${nombreRec(c)}</p>
          <span class="shrink-0 kf text-[16px] font-bold t-nar">🔥 ${c.semanas}</span>
        </div>`).join('')}</div></div>`;
    }

    function bloqueMisRecords(d) {
      const m = d.mios || { mejores: [], constancia: { actual: 0, mejor: 0 }, enviados: [] };
      const tarjetas = (m.mejores || []).map(e => `
        <div class="ko-low rounded-xl p-3">
          <p class="ko-lbl t-mu leading-tight">${escHtml(e.nombre)}</p>
          <p class="kf text-[22px] font-bold mt-1 ${e.peso ? '' : 't-dim'}">${e.peso ? numRec(e.peso) + '<span class="text-xs t-mu ml-0.5">kg</span>' : '—'}</p>
          ${e.validado ? `<p class="text-[11px] t-lima font-bold mt-0.5">${icoRec('verified', '!text-[12px]', true)} Validado</p>` : (e.peso ? '<p class="text-[11px] t-dim mt-0.5">De tus series</p>' : '')}
          ${e.peso && m.pesoCorp ? `<p class="text-[11px] t-mu">${ratioRec(Math.round(e.peso / m.pesoCorp * 100) / 100)} tu peso</p>` : ''}
        </div>`).join('');
      const racha = `
        <div class="rounded-xl p-3" style="background:rgba(249,115,22,.12)">
          <p class="ko-lbl" style="color:#ffb690">🔥 Constancia</p>
          <p class="kf text-[22px] font-bold mt-1">${m.constancia.actual} <span class="text-xs t-mu">${m.constancia.actual === 1 ? 'semana' : 'semanas'}</span></p>
          <p class="text-[11px] t-mu mt-0.5">Mejor racha: ${m.constancia.mejor}</p>
        </div>`;
      const ESTADOS = { PENDIENTE: [ico('clock', 'w-3.5 h-3.5') + ' Pendiente', 'b-nar-s'], APROBADO: [ico('circle-check', 'w-3.5 h-3.5') + ' Aprobado', 'b-lima-s'], RECHAZADO: ['' + ico('x', 'w-4 h-4') + ' Rechazado', ''] };
      const enviados = (m.enviados || []).length ? `
        <p class="ko-lbl t-mu mt-4 mb-2">Récords enviados</p>
        <div class="space-y-2">${m.enviados.map(r => {
          const st = ESTADOS[r.estado] || [r.estado, ''];
          return `<div class="ko-row !py-2.5 justify-between">
            <div class="min-w-0"><p class="text-xs font-bold truncate">${escHtml(r.ejercicio)} · ${kgRec(r.peso)} × ${escHtml(r.reps)}</p>
            <p class="text-[11px] t-mu">${escHtml(fechaRec(r.fecha))}${r.comentario ? ' · “' + escHtml(r.comentario) + '”' : ''}${r.nota ? ' · Coach: ' + escHtml(r.nota) : ''}</p></div>
            <span class="ko-pill ${st[1]} shrink-0" ${st[1] ? '' : 'style="background:rgba(255,180,171,.12);color:var(--ko-err)"'}>${st[0]}</span></div>`;
        }).join('')}</div>` : '';
      return `<div class="ko-card">${tituloRec('person', 'Mis récords')}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${racha}${tarjetas}</div>${enviados}</div>`;
    }

    // ---- Registrar récord (alumno) ----
    function abrirModalRecord(indice) {
      const ejs = (recordsData && recordsData.ejercicios) || [];
      if (!ejs.length) return mostrarToast('Tu coach aún no eligió ejercicios para el ranking.');
      document.getElementById('recEjercicio').innerHTML = ejs.map((e, i) => `<option value="${i}">${escHtml(e.nombre)}</option>`).join('');
      document.getElementById('recEjercicio').value = String(typeof indice === 'number' ? indice : Math.max(0, Math.min(recordsEjSel, ejs.length - 1)));
      document.getElementById('recPeso').value = '';
      document.getElementById('recReps').value = '1';
      document.getElementById('recFecha').value = fechaLocalISO();
      document.getElementById('recComentario').value = '';
      document.getElementById('modalRecord').classList.remove('hidden');
    }
    function cerrarModalRecord() { document.getElementById('modalRecord').classList.add('hidden'); }
    function enviarRecord() {
      const ejs = (recordsData && recordsData.ejercicios) || [];
      const e = ejs[parseInt(document.getElementById('recEjercicio').value, 10)];
      const peso = document.getElementById('recPeso').value, reps = document.getElementById('recReps').value;
      if (!e) return;
      if (!(parseFloat(peso) > 0)) return avisar('Escribe el peso que levantaste (kg).', 'atencion');
      const btn = document.getElementById('btnEnviarRecord');
      btn.disabled = true; btn.innerText = 'Enviando...';
      GS().withSuccessHandler(res => {
        btn.disabled = false; btn.innerText = 'Enviar a mi coach';
        if (!res || !res.success) return avisar((res && res.error) || 'No se pudo enviar.', 'error');
        cerrarModalRecord();
        mostrarToast('✅ ' + res.mensaje);
        cargarRecords(recordsContenedor);
      }).registrarRecord({ idEjercicio: e.idEjercicio, nombre: e.nombre, peso: peso, reps: reps, fecha: document.getElementById('recFecha').value,
        comentario: document.getElementById('recComentario').value.trim() });
    }

    // ==================== RÉCORDS · vista del ALUMNO (v12.2, «Muro de récords») ====================
    function tituloMuro(ico, txt, extra = '', color = 't-lima') {
      return `<div class="flex items-center justify-between gap-2 mb-3"><h3 class="text-[15px] font-extrabold uppercase tracking-wide flex items-center gap-2">${icoRec(ico, color, true)} ${txt}</h3>${extra}</div>`;
    }
    function yoRec() {
      const u = estadoGlobal.user || {};
      return { nombre: nombreCompletoRec(u.nombre), foto: extraerIdDriveCliente(u.urlFotoPerfil) || '', yo: true };
    }
    const nombreCompletoRec = n => String(n || '').trim().split(/\s+/).filter(x => x).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ') || 'Tú';

    function renderRecordsAlumno(cont, d) {
      const partes = [cabeceraMuro(d), bloqueFiltrosPeriodo(), bloqueRachaActual(d),
        `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">${bloqueRankingConstancia(d)}${bloqueRecientesMuro(d)}</div>`,
        bloqueMisRecordsMuro(d)];
      if ((d.ranking || []).length) partes.push(`<div class="space-y-2">${bloqueChipsEjercicio(d)}${bloqueRanking(d)}</div>`);
      partes.push(bloqueClubes(d), bloqueHito(d));
      cont.innerHTML = `<div class="ko space-y-4">${partes.filter(x => x).join('')}</div>`;
      cargarFotosRec(cont);
    }

    function cabeceraMuro(d) {
      const r = (d.resumen || {})[recordsPeriodo] || {};
      const etq = { S: 'esta semana', M: 'este mes', H: 'en total' }[recordsPeriodo];
      const on = !!d.mostrar;
      const caja = (n, txt, color) => `<div class="rounded-xl p-3 text-center" style="background:var(--ko-min);border:1px solid var(--ko-borde)">
          <p class="text-[26px] leading-8 font-black ${color}">${n}</p><p class="ko-lbl t-mu mt-0.5">${txt}</p></div>`;
      return `<div class="ko-card">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-14 h-14 shrink-0 rounded-full ko-hi flex items-center justify-center">${icoRec('emoji_events', 't-lima !text-[28px]', true)}</div>
            <div class="min-w-0">
              <div class="flex items-center gap-2"><span class="ko-pill b-lima">Tu comunidad</span><span class="ko-ping"></span></div>
              <h2 class="text-[24px] leading-8 font-black uppercase tracking-tight mt-1">Muro de récords</h2>
              <p class="text-xs t-mu">Celebrando cada kilo y cada conquista</p>
            </div>
          </div>
          <button onclick="alternarMostrarRecords()" id="btnMostrarRecords" role="switch" aria-checked="${on}"
            title="${on ? 'Tus compañeros ven tu nombre, tu foto y tus marcas. Toca para ocultarte.' : 'Solo tú y tu coach ven tus marcas. Toca para aparecer.'}"
            class="ml-auto shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition"
            style="${on ? 'background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.5);color:var(--ko-lima2)' : 'background:var(--ko-hi);border:1px solid var(--ko-borde);color:var(--ko-tx)'}">
            ${icoRec(on ? 'visibility' : 'visibility_off', '!text-[17px]')} ${on ? 'Mostrando mis récords' : 'Mostrar mis récords'}
          </button>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-4">
          ${caja(r.prs || 0, 'PRs ' + etq, 't-lima')}${caja(r.club || 0, 'Nuevos en club', 't-cian')}${caja(r.aprobados || 0, 'Validados coach', '')}
        </div>
      </div>`;
    }

    function bloqueFiltrosPeriodo() {
      return `<div class="ko-seg">${PERIODOS_REC.map(([k, t]) => `<button onclick="recordsPeriodo='${k}'; renderRecords()" class="${recordsPeriodo === k ? 'on' : ''}">${t}</button>`).join('')}</div>`;
    }
    function bloqueChipsEjercicio(d) {
      return `<div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
        ${d.ranking.map((e, i) => `<button onclick="recordsEjSel=${i}; renderRecords()" class="ko-chip ${i === Math.max(0, recordsEjSel) ? 'on' : ''}">${escHtml(e.nombre)}</button>`).join('')}</div>`;
    }

    function bloqueRachaActual(d) {
      const m = (d.mios && d.mios.constancia) || { actual: 0, mejor: 0 };
      const yo = yoRec();
      const txt = m.actual > 0
        ? `${m.actual} ${m.actual === 1 ? 'semana seguida' : 'semanas seguidas'} · Mejor racha: ${m.mejor}`
        : `Sube tu progreso esta semana para empezar tu racha · Mejor racha: ${m.mejor}`;
      return `<div class="ko-card">
        ${tituloMuro('local_fire_department', '¡Tu racha actual! 🔥', '', 't-nar')}
        <div class="ko-row yo !py-3 flex-wrap">
          ${avatarRec(yo, 48)}
          <div class="min-w-0 flex-1"><p class="text-[15px] font-bold truncate">${escHtml(yo.nombre)} <span class="t-lima">(TÚ)</span></p>
            <p class="text-xs t-mu">${txt}</p></div>
          ${m.actual > 0 ? `<button onclick="compartirRacha()" class="ko-btn shrink-0 px-4 py-2.5 text-xs flex items-center gap-1.5">${icoRec('share', '!text-[17px]')} Compartir logro</button>` : ''}
        </div>
      </div>`;
    }
    async function compartirRacha() {
      const m = (recordsData && recordsData.mios && recordsData.mios.constancia) || { actual: 0, mejor: 0 };
      const texto = `🔥 Llevo ${m.actual} ${m.actual === 1 ? 'semana seguida' : 'semanas seguidas'} entrenando con PRO COACHING (mejor racha: ${m.mejor}). ¡Vamos por más! 💪`;
      try {
        const P = window.Capacitor && window.Capacitor.Plugins;
        if (P && P.Share && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return await P.Share.share({ text: texto, dialogTitle: 'Compartir logro' });
        if (navigator.share) return await navigator.share({ text: texto });
      } catch (e) { if (e && /cancel|abort/i.test(String(e.message || e.name || e))) return; }
      window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
    }

    function bloqueRankingConstancia(d) {
      const lista = d.constancia || [];
      const filas = lista.length ? lista.map((c, i) => `
        <div class="ko-row ${c.yo ? 'yo' : ''}" ${c.yo ? 'id="miFilaConstancia"' : ''}>
          <span class="w-6 text-center text-[15px] font-black ${i < 3 ? 't-cian' : 't-dim'}">${i + 1}.</span>
          ${avatarRec(c, 38)}
          <div class="min-w-0 flex-1"><p class="text-sm font-bold truncate">${escHtml(c.nombre)}${c.yo ? ' <span class="t-lima">(TÚ)</span>' : ''}</p>
            <p class="text-xs t-mu">${c.semanas} ${c.semanas === 1 ? 'semana' : 'semanas'}</p></div>
        </div>`).join('') : '<p class="text-xs t-mu">Aún nadie tiene racha activa. ¡Empieza la tuya subiendo tu progreso!</p>';
      const boton = lista.length ? `<button onclick="verMiPosicionConstancia()" class="ko-btn2 px-3 py-1.5 text-xs">Ver mi posición</button>` : '';
      return `<div class="ko-card">${tituloMuro('emoji_events', 'Ranking de constancia', '', 't-cian')}
        ${boton ? `<div class="flex justify-end -mt-1 mb-2">${boton}</div>` : ''}
        <div class="space-y-2">${filas}</div></div>`;
    }
    function verMiPosicionConstancia() {
      const fila = document.getElementById('miFilaConstancia');
      if (!fila) return mostrarToast('Aún no apareces: sube tu progreso semanal para entrar al ranking de constancia.');
      fila.scrollIntoView({ behavior: modoScroll(), block: 'center' });
      if (!movimientoReducido()) fila.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 600 });
    }

    function textoLogro(f) {
      const ej = `<strong style="color:var(--ko-tx)">${escHtml(f.ejercicio.charAt(0) + f.ejercicio.slice(1).toLowerCase())}</strong>`;
      const kg = ` <span class="t-lima font-bold">${numRec(f.peso)} kg</span>`;
      if (f.tipo === 'AUTO') return `subió su marca en ${ej}${kg}`;
      if ((f.clubes || []).length) return `entró al club de ${numRec(f.clubes[f.clubes.length - 1])} kg en ${ej}`;
      if (f.delta > 0) return `rompió su récord en ${ej}${kg}`;
      if (f.primero) return `registró su primer récord en ${ej}${kg}`;
      return `logró${kg} en ${ej}`;
    }
    function bloqueRecientesMuro(d) {
      const lista = (d.feed || []).filter(f => enPeriodoRec(f.ts)).slice(0, 8);
      const items = lista.length ? lista.map((f, i) => `
        <div class="py-3 ${i ? 'border-t' : ''}" style="border-color:var(--ko-borde)">
          <div class="flex items-start gap-3">
            ${avatarRec(f, 38)}
            <div class="min-w-0 flex-1">
              <p class="text-[13px] leading-5 t-mu"><strong class="text-[13px]" style="color:var(--ko-tx)">${escHtml(f.nombre)}${f.yo ? ' (tú)' : ''}</strong> ${textoLogro(f)} <span class="t-dim">· ${haceRec(f.ts, f.fechaRevision || f.fecha)}</span></p>
              ${f.comentario ? `<p class="text-xs t-mu italic mt-0.5">“${escHtml(f.comentario)}”</p>` : ''}
              ${f.id ? `<div class="mt-2">${reaccionesRec(f)}</div>` : ''}
            </div>
          </div>
        </div>`).join('') : `<p class="text-xs t-mu py-2">${(d.feed || []).length ? 'No hay récords en este periodo.' : 'Todavía no hay récords nuevos. ¡El próximo puede ser el tuyo!'}</p>`;
      const boton = (d.ejercicios || []).length
        ? `<button onclick="abrirModalRecord()" class="ko-btn w-full py-3 mt-3 text-sm flex items-center justify-center gap-1.5">${icoRec('add', '!text-[19px]')} Registrar mi récord</button>` : '';
      return `<div class="ko-card">${tituloMuro('chat', 'Récords recientes')}<div>${items}</div>${boton}</div>`;
    }

    function bloqueMisRecordsMuro(d) {
      const m = d.mios || { mejores: [], enviados: [] };
      const mejores = m.mejores || [];
      if (!mejores.length) return `<div class="ko-card">${tituloMuro('track_changes', 'Mis récords')}<p class="text-xs t-mu">Tu coach aún no eligió los ejercicios del ranking.</p></div>`;
      const maxPeso = Math.max(...mejores.map(e => e.peso || 0));
      const tiles = mejores.map((e, i) => e.peso ? `
        <div class="rounded-xl p-3 relative" style="background:var(--ko-min);border:1px solid ${e.peso === maxPeso || e.validado ? 'rgba(16,185,129,.6)' : 'var(--ko-borde)'}">
          <div class="flex items-center justify-between">${icoRec('fitness_center', 't-lima !text-[18px]')}${e.validado ? '<span class="text-base leading-none" title="Validado por tu coach">🏅</span>' : ''}</div>
          <p class="text-[13px] font-semibold mt-2 leading-tight">${escHtml(e.nombre.charAt(0) + e.nombre.slice(1).toLowerCase())}</p>
          <p class="text-[22px] leading-7 font-black mt-0.5">${numRec(e.peso)} <span class="text-sm font-bold">kg</span></p>
          ${m.pesoCorp ? `<p class="text-[11px] t-mu">${ratioRec(Math.round(e.peso / m.pesoCorp * 100) / 100)} tu peso${e.validado ? '' : ' · de tus series'}</p>` : (e.validado ? '' : '<p class="text-[11px] t-mu">De tus series</p>')}
        </div>` : `
        <button onclick="abrirModalRecord(${i})" class="rounded-xl p-3 text-center flex flex-col items-center justify-center min-h-[112px] transition hover:brightness-110" style="background:var(--ko-hi);border:1px solid var(--ko-top)">
          ${icoRec('lock', 't-mu !text-[24px]', true)}
          <p class="text-[13px] font-semibold t-mu mt-1.5 leading-tight">${escHtml(e.nombre.charAt(0) + e.nombre.slice(1).toLowerCase())}</p>
          <p class="text-xs t-cian font-semibold mt-0.5">${ico('lock', 'w-4 h-4')} Registra marca</p>
        </button>`).join('');
      const ESTADOS = { PENDIENTE: [ico('clock', 'w-3.5 h-3.5') + ' Pendiente', 'b-nar-s'], APROBADO: [ico('circle-check', 'w-3.5 h-3.5') + ' Aprobado', 'b-lima-s'], RECHAZADO: ['' + ico('x', 'w-4 h-4') + ' Rechazado', ''] };
      const enviados = (m.enviados || []).length ? `
        <p class="ko-lbl t-mu mt-4 mb-2">Récords enviados</p>
        <div class="space-y-2">${m.enviados.slice(0, 5).map(r => {
          const st = ESTADOS[r.estado] || [r.estado, ''];
          return `<div class="ko-row !py-2.5 justify-between">
            <div class="min-w-0"><p class="text-xs font-bold truncate">${escHtml(r.ejercicio)} · ${kgRec(r.peso)} × ${escHtml(r.reps)}</p>
            <p class="text-[11px] t-mu">${escHtml(fechaRec(r.fecha))}${r.nota ? ' · Coach: ' + escHtml(r.nota) : ''}</p></div>
            <span class="ko-pill ${st[1]} shrink-0" ${st[1] ? '' : 'style="background:rgba(253,164,175,.12);color:var(--ko-err)"'}>${st[0]}</span></div>`;
        }).join('')}</div>` : '';
      return `<div class="ko-card">${tituloMuro('track_changes', 'Mis récords')}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">${tiles}</div>${enviados}</div>`;
    }

    // ==================== v18 · GIFs DE LA RUTINA DESCARGADOS POR ADELANTADO ====================
    // Al abrir la app (con calma, 3 s después) se descargan los GIFs de HOY y las imágenes del resto de la semana.
    // Quedan en la memoria del navegador/app, así en el gimnasio con poca señal no se quedan cargando.
    // No se hace si el teléfono tiene activado el «ahorro de datos».
    function precargarMediosRutina(rutina) {
      try {
        if (navigator.connection && navigator.connection.saveData) return;
        const lista = rutina || estadoGlobal.rutinaActual || [];
        if (!lista.length) return;
        const hoy = normalizarDia(obtenerDiaActualSemana());
        const gifs = [], minis = [];
        lista.forEach(r => {
          if (!r || !r.media) return;
          minis.push(urlMini(r.media));
          if (normalizarDia(r.dia) === hoy) gifs.push(urlGif(r.media));
        });
        const urls = Array.from(new Set(gifs.concat(minis)));
        let i = 0;
        const siguiente = () => {
          if (i >= urls.length || !estadoGlobal.user) return;
          const im = new Image();
          im.onload = im.onerror = () => setTimeout(siguiente, 40);
          im.src = urls[i++];
        };
        setTimeout(() => { siguiente(); siguiente(); }, 3000);   // de a 2 para no saturar la conexión
      } catch (e) {}
    }

    // ==================== v18 · MODO GUIADO (un ejercicio a la vez) ====================
    // Usa las MISMAS casillas que la rutina (s1_peso, s1_ok, carga_d1…): lo que marques aquí se ve en la rutina y viceversa.
    // Descanso automático con el cronómetro de siempre (suena y vibra; en la app avisa aunque la pantalla esté apagada).
    let guiado = null;
    function construirPasosGuiado(diaNorm) {
      const ejs = (estadoGlobal.rutinaActual || []).filter(r => normalizarDia(r.dia) === diaNorm);
      const bases = basesEjerciciosDia(ejs);
      const kp = (idx, campo) => diaNorm + '|' + bases[idx] + '::' + campo;
      const bloques = agruparBloquesDia(ejs);
      const pasos = [];
      const desc = r => parseInt(r.descanso) || 0;
      bloques.forEach((b, bi) => {
        if (b.tipo === 'GRUPO') {
          const its = b.items, rondas = Math.max(...its.map(it => cuantasSeries(it.data)));
          const descGrupo = parseInt(its[its.length - 1].data.descanso) || 90;
          for (let n = 1; n <= rondas; n++) its.forEach((it, pos) => {
            if (n > cuantasSeries(it.data)) return;
            const ultimo = its.slice(pos + 1).every(o => n > cuantasSeries(o.data));
            pasos.push({ bi, it, tipo: 'serie', n, total: cuantasSeries(it.data), reps: it.data.repeticiones,
              kPeso: kp(it.idx, 's' + n + '_peso'), kOk: kp(it.idx, 's' + n + '_ok'), kMain: kp(it.idx, 'ok'),
              descanso: ultimo ? descGrupo : 0, grupo: { sub: b.subtipo, pos: pos + 1, de: its.length } });
          });
        } else if (b.tipo === 'DROPSET' || b.tipo === 'ASCENDING' || b.tipo === 'PIRAMIDE') {
          const it = b.item, fases = fasesEspeciales(it.data, b.tipo);
          fases.forEach((rep, d) => pasos.push({ bi, it, tipo: 'fase', especial: b.tipo, n: d + 1, total: fases.length, reps: rep,
            kPeso: kp(it.idx, 'carga_d' + (d + 1)), kOk: kp(it.idx, 'ok_d' + (d + 1)), kMain: kp(it.idx, 'ok'),
            descanso: d === fases.length - 1 ? (desc(it.data) || 90) : 0 }));
        } else {
          const it = b.item, t = cuantasSeries(it.data);
          for (let n = 1; n <= t; n++) pasos.push({ bi, it, tipo: 'serie', n, total: t, reps: it.data.repeticiones,
            kPeso: kp(it.idx, 's' + n + '_peso'), kOk: kp(it.idx, 's' + n + '_ok'), kMain: kp(it.idx, 'ok'), descanso: desc(it.data) });
        }
      });
      return { pasos, bloques, kp, diaNorm };
    }
    const pasoHecho = p => leerProg(p.kOk) === 'true' || leerProg(p.kMain) === 'true';
    function siguientePendiente(desde) {
      const ps = guiado.pasos;
      for (let k = 1; k <= ps.length; k++) { const j = (desde + k) % ps.length; if (!pasoHecho(ps[j])) return j; }
      return -1;
    }

    async function abrirModoGuiado() {
      const p = asegurarSemanaLocal();
      if (!p || p.soloLectura) return;
      const dia = estadoGlobal.diaSeleccionado || obtenerDiaActualSemana();
      const datos = construirPasosGuiado(normalizarDia(dia));
      if (!datos.pasos.length) return avisar('No hay ejercicios para este día.', 'atencion');
      guiado = Object.assign(datos, { dia, i: 0, vista: 'serie', inicio: Date.now(), reloj: null, wake: null, siguiente: -1 });
      const primero = datos.pasos.findIndex(x => !pasoHecho(x));
      if (primero < 0) guiado.vista = 'fin'; else guiado.i = primero;
      document.getElementById('modalGuiado').classList.remove('hidden');
      document.documentElement.style.overflow = 'hidden';
      prepararAudio();
      guiado.reloj = setInterval(tickGuiado, 250);
      try { if (navigator.wakeLock) guiado.wake = await navigator.wakeLock.request('screen'); } catch (e) {}   // pantalla encendida
      renderGuiado();
    }
    function cerrarModoGuiado() {
      if (!guiado) return;
      clearInterval(guiado.reloj);
      try { if (guiado.wake) guiado.wake.release(); } catch (e) {}
      guiado = null;
      document.getElementById('modalGuiado').classList.add('hidden');
      document.documentElement.style.overflow = '';
      seleccionarDiaRutina(estadoGlobal.diaSeleccionado);
    }
    document.addEventListener('visibilitychange', async () => {   // el bloqueo de pantalla se suelta al salir: se pide de nuevo
      if (!document.hidden && guiado && navigator.wakeLock) { try { guiado.wake = await navigator.wakeLock.request('screen'); } catch (e) {} }
    });
    document.addEventListener('keydown', e => {
      const tecnica = document.getElementById('modalEjercicio');
      if (e.key === 'Escape' && guiado && (!tecnica || tecnica.classList.contains('hidden'))) cerrarModoGuiado();
    });

    const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    function tickGuiado() {
      if (!guiado) return;
      const t = document.getElementById('guiadoTiempo');
      if (t) t.textContent = mmss((Date.now() - guiado.inicio) / 1000);
      if (guiado.vista !== 'descanso') return;
      if (!cronometroFin) { irPasoGuiado(guiado.siguiente); return; }   // terminó (o se saltó) el descanso
      const resta = Math.max(0, (cronometroFin - Date.now()) / 1000);
      const txt = document.getElementById('guiadoResta'), arco = document.getElementById('guiadoArco');
      if (txt) txt.textContent = mmss(Math.ceil(resta));
      if (arco) arco.setAttribute('stroke-dashoffset', (666 * (1 - resta / Math.max(1, guiado.descansoTotal))).toFixed(1));
    }
    function irPasoGuiado(j) {
      if (!guiado) return;
      if (j < 0 || j >= guiado.pasos.length) { guiado.vista = 'fin'; detenerCronometro(); }
      else { guiado.i = j; guiado.vista = 'serie'; }
      renderGuiado();
    }
    function ajustarKgGuiado(delta) {
      const inp = document.getElementById('guiadoKg'); if (!inp) return;
      const v = parseFloat(String(inp.value).replace(',', '.')) || 0;
      inp.value = String(Math.max(0, Math.round((v + delta) * 10) / 10));
    }
    function completarPasoGuiado() {
      if (!guiado || guiado.vista !== 'serie') return;
      const p = guiado.pasos[guiado.i];
      const inp = document.getElementById('guiadoKg');
      const kg = inp ? String(inp.value || '').trim() : '';
      if (kg) guardarCargaEjercicio(p.kPeso, kg);
      escribirProg(p.kOk, 'true');
      // ✓ del ejercicio cuando todas sus series/fases están hechas (igual que en la rutina)
      const hermanos = guiado.pasos.filter(x => x.it === p.it);
      if (hermanos.every(x => leerProg(x.kOk) === 'true')) escribirProg(p.kMain, 'true');
      try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {}
      const sig = siguientePendiente(guiado.i);
      if (sig < 0) {
        guiado.vista = 'fin';
        // v19: duración de la sesión (la ve el coach) y envío inmediato del progreso
        const minutos = Math.max(1, Math.round((Date.now() - guiado.inicio) / 60000));
        escribirProg(guiado.diaNorm + '|_SESION::min', String(minutos));
        if (typeof subirProgresoAuto === 'function') setTimeout(subirProgresoAuto, 300);
        renderGuiado(); return;
      }
      if (p.descanso > 0) {
        guiado.siguiente = sig; guiado.descansoTotal = p.descanso; guiado.vista = 'descanso';
        iniciarCronometro(p.descanso);
        renderGuiado();
      } else irPasoGuiado(sig);
    }
    function ajustarDescansoGuiado(delta) {
      if (!cronometroFin) return;
      const resta = Math.ceil((cronometroFin - Date.now()) / 1000) + delta;
      if (resta <= 0) { detenerCronometro(); return; }
      guiado.descansoTotal = Math.max(guiado.descansoTotal + Math.max(0, delta), resta);
      iniciarCronometro(resta);
    }

    /** v19 · Qué hacer con el peso en esta fase (misma lógica que la vista normal de la rutina). */
    function indicacionPeso(p) {
      if (p.tipo !== 'fase') return null;
      if (p.n === 1) return { texto: 'Peso inicial', sub: 'Empieza con el peso de la primera fase', icono: 'dumbbell', clase: 'bg-slate-800 text-slate-200 border-slate-700' };
      const baja = { texto: 'Baja el peso', sub: 'Sigue sin descansar', icono: 'trending-down', clase: 'bg-rose-500/15 text-rose-300 border-rose-500/40' };
      const sube = { texto: 'Sube el peso', sub: 'Sigue sin descansar', icono: 'trending-up', clase: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' };
      if (p.especial === 'DROPSET') return baja;
      if (p.especial === 'ASCENDING') return sube;
      if (p.especial === 'PIRAMIDE') return p.n <= 3 ? sube : baja;   // fases 2-3 suben, 4-5 bajan
      return null;
    }
    function detallePaso(p) {
      const r = p.it.data;
      const tempo = `${r.excentrica || 0}-${r.pausaExcentrica || 0}-${r.concentrica || 0}-${r.pausaConcentrica || 0}`;
      const etiqueta = p.grupo ? (p.grupo.sub === 'TRISERIE' ? 'Tri-serie' : 'Súper serie') + ` · ${p.grupo.pos} de ${p.grupo.de}`
        : p.especial ? ({ DROPSET: 'Drop set', ASCENDING: 'Ascendente', PIRAMIDE: 'Pirámide' })[p.especial] + ` · fase ${p.n} de ${p.total}` : '';
      return { r, tempo, etiqueta };
    }
    function vistaPrevia(j, texto) {
      if (j < 0) return '';
      const q = guiado.pasos[j], r = q.it.data;
      return `<div class="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-2.5">
        ${r.media ? `<img src="${urlMini(r.media)}" alt="" class="w-11 h-11 rounded-xl bg-white object-contain shrink-0">` : ''}
        <div class="min-w-0 flex-1"><p class="text-[11px] font-black text-slate-400 tracking-wider">${texto}</p>
        <p class="text-sm font-extrabold text-white truncate">${escHtml(r.ejercicio)} · ${q.tipo === 'fase' ? 'fase' : 'serie'} ${q.n} de ${q.total}</p></div></div>`;
    }

    function renderGuiado() {
      const cont = document.getElementById('contGuiado'); if (!cont || !guiado) return;
      const g = guiado, total = g.bloques.length;
      const bloqueHecho = bi => g.pasos.filter(x => x.bi === bi).every(pasoHecho);
      const biActual = g.vista === 'fin' ? total : g.pasos[g.vista === 'descanso' ? g.siguiente : g.i].bi;
      const segmentos = g.bloques.map((b, bi) => `<span class="flex-1 h-1.5 rounded-full ${bloqueHecho(bi) ? 'bg-emerald-500' : bi === biActual ? 'bg-amber-400' : 'bg-slate-800'}"></span>`).join('');
      const cabecera = `
        <div class="flex gap-1" aria-hidden="true">${segmentos}</div>
        <div class="flex items-center justify-between mt-3 mb-3">
          <button type="button" onclick="cerrarModoGuiado()" aria-label="Salir del modo guiado" class="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-center">${ico('x', 'w-5 h-5')}</button>
          <div class="text-center"><p class="text-xs font-bold text-slate-400 tabular-nums">${g.vista === 'fin' ? 'TERMINADO' : `EJERCICIO ${Math.min(biActual + 1, total)} DE ${total}`} · <span id="guiadoTiempo">${mmss((Date.now() - g.inicio) / 1000)}</span></p>
            <p class="text-sm font-extrabold text-white">${escHtml(g.dia)}</p></div>
          <button type="button" onclick="cerrarModoGuiado()" aria-label="Ver la rutina completa" class="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-center">${ico('list-checks', 'w-5 h-5')}</button>
        </div>`;

      if (g.vista === 'fin') {
        const hechas = g.pasos.filter(pasoHecho).length;
        const pend = false;   // v19: el progreso se envía solo al coach
        cont.innerHTML = cabecera + `
          <div class="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
            <span class="w-24 h-24 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">${ico('check', 'w-12 h-12')}</span>
            <h2 class="text-2xl font-black text-white">¡Entrenamiento completado!</h2>
            <p class="text-sm text-slate-400">${hechas} de ${g.pasos.length} series · ${mmss((Date.now() - g.inicio) / 1000)} de entrenamiento</p>
            <p class="text-xs text-emerald-300 inline-flex items-center gap-1.5">${ico('send', 'w-4 h-4')} Tu coach recibe tu progreso automáticamente</p>
            ${pend ? `<button type="button" onclick="cerrarModoGuiado(); subirProgresoSemanal()" class="w-full min-h-[52px] rounded-2xl bg-emerald-500 text-slate-950 font-extrabold">Subir mi semana a mi coach</button>` : ''}
            <button type="button" onclick="cerrarModoGuiado()" class="w-full min-h-[52px] rounded-2xl ${pend ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-emerald-500 text-slate-950'} font-extrabold">Volver a mi rutina</button>
          </div>`;
        return;
      }

      if (g.vista === 'descanso') {
        const resta = cronometroFin ? Math.max(0, Math.ceil((cronometroFin - Date.now()) / 1000)) : 0;
        cont.innerHTML = cabecera + `
          <div class="flex-1 flex flex-col items-center gap-5 py-4">
            <p class="text-xs font-black text-slate-400 tracking-[0.2em]">DESCANSO</p>
            <div class="relative w-60 h-60">
              <svg width="240" height="240" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="106" stroke="#1e293b" stroke-width="14" fill="none"/>
                <circle id="guiadoArco" cx="120" cy="120" r="106" stroke="#10b981" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="666" stroke-dashoffset="${(666 * (1 - resta / Math.max(1, g.descansoTotal))).toFixed(1)}" transform="rotate(-90 120 120)"/></svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center"><span id="guiadoResta" class="text-6xl font-black text-white tabular-nums" role="timer" aria-live="off">${mmss(resta)}</span><span class="text-sm text-slate-400">de ${mmss(g.descansoTotal)}</span></div>
            </div>
            <div class="grid grid-cols-3 gap-2.5 w-full">
              <button type="button" onclick="ajustarDescansoGuiado(-15)" class="min-h-[52px] rounded-xl bg-slate-900 border border-slate-700 text-white font-extrabold">−15 s</button>
              <button type="button" onclick="ajustarDescansoGuiado(15)" class="min-h-[52px] rounded-xl bg-slate-900 border border-slate-700 text-white font-extrabold">+15 s</button>
              <button type="button" onclick="detenerCronometro()" class="min-h-[52px] rounded-xl border border-emerald-500/50 text-emerald-300 font-extrabold">Saltar</button>
            </div>
            <div class="w-full">${vistaPrevia(g.siguiente, 'A CONTINUACIÓN')}</div>
            <p class="text-xs text-slate-400 text-center">Suena y vibra al terminar${origenApp() === 'app' ? ', aunque la pantalla esté apagada' : ''}.</p>
          </div>`;
        return;
      }

      const p = g.pasos[g.i], { r, tempo, etiqueta } = detallePaso(p);
      const mismos = g.pasos.map((x, j) => [x, j]).filter(([x]) => x.it === p.it);
      const chips = mismos.map(([x, j]) => {
        const hecho = pasoHecho(x), actual = j === g.i, kg = leerProg(x.kPeso);
        const est = hecho ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' : actual ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800';
        return `<button type="button" onclick="irPasoGuiado(${j})" aria-label="${x.tipo === 'fase' ? 'Fase' : 'Serie'} ${x.n}${hecho ? ', hecha' : ''}" ${actual ? 'aria-current="step"' : ''}
          class="flex-1 min-w-[52px] min-h-[48px] rounded-xl border text-xs font-extrabold leading-tight ${est}">${x.tipo === 'fase' ? 'F' : 'S'}${x.n}<br><span class="font-semibold">${hecho ? (kg ? escHtml(kg) + ' kg ✓' : '✓') : actual ? 'ahora' : '—'}</span></button>`;
      }).join('');
      const kgActual = leerProg(p.kPeso) || '';
      const anterior = mismos.map(([x]) => x).filter(x => x.n < p.n).map(x => leerProg(x.kPeso)).filter(Boolean).pop() || '';
      const pasada = valorSemanaPasada(g.diaNorm, txtClave(p.kPeso)) || '';
      const sugerido = kgActual || anterior || pasada;
      const sig = siguientePendiente(g.i);
      const indSig = sig >= 0 && guiado.pasos[sig].it === p.it ? indicacionPeso(guiado.pasos[sig]) : null;
      const textoBoton = p.descanso > 0 && sig >= 0 ? `Serie hecha · descansar ${p.descanso} s`
        : sig < 0 ? 'Serie hecha · terminar'
        : indSig ? `Hecha · ${indSig.texto.toLowerCase()}` : 'Serie hecha · siguiente';
      cont.innerHTML = cabecera + `
        <div class="flex-1 flex flex-col gap-3.5">
          ${r.media ? `<button type="button" onclick="abrirModalEjercicio('${escHtml(r.idEjercicio || '')}', '${escHtml(String(r.ejercicio || '').replace(/'/g, ''))}', '${escHtml(r.media)}')" class="relative w-full h-56 rounded-3xl bg-white overflow-hidden" aria-label="Ver la técnica de ${escHtml(r.ejercicio)}">
            <img src="${urlGif(r.media)}" alt="Demostración: ${escHtml(r.ejercicio)}" class="w-full h-full object-contain">
            <span class="absolute right-3 bottom-3 bg-slate-950/85 text-white text-xs font-extrabold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5">${ico('circle-help', 'w-4 h-4')} Técnica</span></button>` : ''}
          <div>
            ${etiqueta ? `<span class="inline-block mb-1 text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">${escHtml(etiqueta)}</span>` : ''}
            <h2 class="text-2xl font-black text-white leading-tight">${escHtml(r.ejercicio)}</h2>
            ${(() => { const ind = indicacionPeso(p); return ind ? `<div class="mt-2 flex items-center gap-3 border rounded-2xl px-3 py-2.5 ${ind.clase}" role="note">
              ${ico(ind.icono, 'w-7 h-7 shrink-0')}<div><p class="text-base font-black leading-tight">${ind.texto}</p><p class="text-xs opacity-80">${ind.sub}</p></div></div>` : ''; })()}
            <p class="text-sm text-slate-400 mt-0.5">${p.tipo === 'fase' ? 'Fase' : 'Serie'} ${p.n} de ${p.total} · <b class="text-white">${escHtml(String(p.reps || '-'))} reps</b> · tempo <span class="font-mono text-amber-300">${tempo}</span>${p.descanso ? ' · descanso ' + p.descanso + ' s' : ''}</p>
          </div>
          <div class="flex gap-2 overflow-x-auto no-scrollbar">${chips}</div>
          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-3">
            <label for="guiadoKg" class="block text-[11px] font-black text-slate-400 tracking-wider mb-1.5">PESO (KG)</label>
            <div class="flex items-center gap-3">
              <button type="button" onclick="ajustarKgGuiado(-2.5)" aria-label="Bajar 2,5 kg" class="w-14 h-14 shrink-0 rounded-xl bg-slate-800 text-white flex items-center justify-center">${ico('minus', 'w-6 h-6')}</button>
              <input id="guiadoKg" type="number" inputmode="decimal" step="0.5" min="0" value="${escHtml(sugerido)}" placeholder="—" class="flex-1 min-w-0 h-14 bg-slate-950 border border-slate-700 rounded-xl text-center text-3xl font-black text-white">
              <button type="button" onclick="ajustarKgGuiado(2.5)" aria-label="Subir 2,5 kg" class="w-14 h-14 shrink-0 rounded-xl bg-slate-800 text-white flex items-center justify-center">${ico('plus', 'w-6 h-6')}</button>
            </div>
            <p class="text-xs text-slate-400 text-center mt-2">${pasada ? 'Semana pasada: <b class="text-slate-200">' + escHtml(kgTxt(pasada)) + '</b>' : 'Anota el peso que usaste'}</p>
          </div>
          <button type="button" onclick="completarPasoGuiado()" class="w-full min-h-[58px] rounded-2xl bg-emerald-500 text-slate-950 text-base font-extrabold flex items-center justify-center gap-2 active:scale-[0.98] transition">${ico('check', 'w-5 h-5')} ${textoBoton}</button>
          ${sig >= 0 && guiado.pasos[sig].it !== p.it ? vistaPrevia(sig, 'SIGUIENTE') : ''}
          <div class="flex justify-between">
            <button type="button" onclick="irPasoGuiado(${Math.max(0, g.i - 1)})" ${g.i === 0 ? 'disabled' : ''} class="min-h-[44px] px-2 text-sm font-bold text-slate-400 disabled:opacity-30">← Anterior</button>
            <button type="button" onclick="irPasoGuiado(${Math.min(g.pasos.length - 1, g.i + 1)})" ${g.i >= g.pasos.length - 1 ? 'disabled' : ''} class="min-h-[44px] px-2 text-sm font-bold text-slate-400 disabled:opacity-30">Saltar →</button>
          </div>
        </div>`;
    }
