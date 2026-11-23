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
      `<li class="text-[11px] border-b border-slate-700 py-1.5 last:border-0 flex justify-between">
        <span class="text-emerald-400 font-bold">${p.fecha}</span> 
        <span class="text-slate-400">${p.peso}kg</span>
      </li>`
    ).reverse().join('');

    contenedorCards.innerHTML = `
  <!-- Tarjeta Peso (Cyan) -->
  <div onclick="abrirModalComposicion('${ultimaEval ? ultimaEval.peso : '-'}', '${ultimaEval ? ultimaEval.grasaCorporal : '-'}', '${ultimaEval ? (ultimaEval.sexo || '') : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-neon-cyan/30 flex flex-col justify-center cursor-pointer transition-all relative overflow-hidden group">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <span class="text-[10px] uppercase text-neon-cyan/80 font-bold tracking-widest block mb-1">Masa Total</span>
    <span class="text-3xl font-black text-white">${ultimaEval && ultimaEval.peso ? ultimaEval.peso + '<span class="text-sm text-neon-cyan">KG</span>' : '-'}</span>
    <span class="text-[9px] text-neon-cyan font-bold uppercase mt-2 tracking-[0.2em]">Escaneo HUD ▾</span>
  </div>
  
  <!-- Tarjeta Grasa (Orange Neon) -->
  <div onclick="abrirModalMetrica('GRASA', '${ultimaEval ? ultimaEval.grasaCorporal : '-'}', '${ultimaEval ? ultimaEval.sexo : ''}', '${ultimaEval ? ultimaEval.edad : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-neon-orange/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <div class="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-neon-orange to-transparent opacity-50"></div>
    <span class="text-[10px] uppercase text-neon-orange/80 font-bold tracking-widest block mb-1">Tejido Adiposo</span>
    <span class="text-3xl font-black text-white">${grasaData.val}</span>
    <span class="text-[10px] text-neon-orange font-black mt-2 tracking-wider bg-neon-orange/10 px-2 py-0.5 rounded inline-block w-max border border-neon-orange/30">${grasaData.class}</span>
  </div>

  <!-- Tarjeta IMC (Green Neon) -->
  <div onclick="abrirModalMetrica('IMC', '${ultimaEval ? ultimaEval.imc : '-'}', '${ultimaEval ? ultimaEval.sexo : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-[#34d399]/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <span class="text-[10px] uppercase text-[#34d399]/80 font-bold tracking-widest block mb-1">Índice IMC</span>
    <span class="text-3xl font-black text-white">${imcData.val}</span>
    <div class="mt-2 w-full bg-[#020617] h-1.5 rounded-full overflow-hidden border border-[#34d399]/20">
        <div class="bg-[#34d399] h-full" style="width: ${imcPct}%;"></div>
    </div>
    <span class="text-[9px] text-[#34d399] mt-1.5 tracking-widest uppercase">Rango: ${imcData.class}</span>
  </div>

  <!-- Tarjeta V-Taper (Purple Neon) -->
  <div onclick="abrirModalMetrica('VTAPER', '${vTaperRatio}', '${ultimaEval ? ultimaEval.sexo : ''}')" 
       class="bg-panel p-4 rounded-2xl border border-purple-500/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <span class="text-[10px] uppercase text-purple-400/80 font-bold tracking-widest block mb-1">Ratio V-Taper</span>
    <span class="text-3xl font-black text-white">${vTaperRatio}</span>
    <span class="text-[10px] text-purple-400 font-black mt-2 tracking-wider bg-purple-500/10 px-2 py-0.5 rounded inline-block w-max border border-purple-500/30">${vTaperData.class}</span>
  </div>

  <!-- Tarjeta Día Actual (Tech Estándar) -->
  <div class="bg-panel p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center shadow-lg relative overflow-hidden">
    <span class="text-[10px] uppercase text-slate-500 font-bold tracking-widest block mb-1">Día Actual (${diaHoy})</span>
    <span class="text-3xl font-black text-white leading-none">${ejerciciosHoy} <span class="text-[10px] text-slate-500 tracking-wider">EJERC.</span></span>
  </div>

  <!-- Tarjeta Controles (Emerald HUD) -->
  <div onclick="document.getElementById('modalFechasControles').classList.toggle('hidden')" class="bg-panel p-4 rounded-2xl border border-emerald-500/30 flex flex-col justify-center cursor-pointer transition-all relative group">
    <div class="flex justify-between items-center mb-1">
      <span class="text-[10px] uppercase text-emerald-500/80 font-bold tracking-widest block">Controles</span>
      <span class="text-[9px] bg-[#020617] border border-emerald-500/50 px-1.5 py-0.5 rounded text-emerald-400">VER ▾</span>
    </div>
    <span class="text-3xl font-black text-emerald-400">${progreso.length}</span>
    
    <div id="modalFechasControles" class="hidden absolute top-[105%] right-0 w-48 bg-[#0f172a]/95 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 max-h-48 overflow-y-auto cursor-default">
      <p class="text-[10px] text-emerald-400 font-black mb-2 uppercase tracking-widest border-b border-emerald-500/30 pb-1.5">Historial Médico</p>
      <ul class="text-slate-300">
        ${listadoFechas || '<li class="text-[10px] text-slate-600 py-2 uppercase tracking-wider font-bold">Sin registros de red</li>'}
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
            <p class="text-[10px] text-slate-500">${h.total} ejercicio${h.total === 1 ? '' : 's'}</p>
          </div>
          ${h.activa
            ? '<span class="shrink-0 text-[10px] font-black uppercase text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 px-2 py-1 rounded-full">● Activa</span>'
            : `<button onclick="activarRutinaHistorial('${escHtml(h.idRutina)}')" class="shrink-0 text-[11px] font-bold text-sky-300 bg-sky-500/10 border border-sky-500/40 px-3 py-1.5 rounded-lg active:scale-95 transition">Activar</button>`}
        </div>`).join('');
      return `
        <details class="mt-4 bg-slate-950 border border-slate-800 rounded-xl">
          <summary class="cursor-pointer select-none flex items-center justify-between gap-2 px-4 py-3 text-xs font-bold text-slate-300">
            <span>🗂️ Historial de rutinas <span class="text-slate-500 font-semibold">(${historial.length})</span></span>
            <span class="text-[10px] text-slate-500 font-semibold">Toca para ver</span>
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
            <span class="block text-[10px] font-black tracking-wider">${DIAS_ABREV_RESUMEN[r.diaNorm] || dia.slice(0, 3)}</span>
            <span class="block text-[11px] font-bold mt-0.5">${n ? (completo ? '✓ ' : '') + n : '—'}</span>
          </button>`;
      }).join('');
      const cuerpo = rutina.length ? `
          ${accionesRutinaCoach(rutina)}
          <div class="grid grid-cols-7 gap-1.5 mb-3">${chips}</div>
          <div id="barraSemanal" class="mb-3"></div>
          <div id="detalleResumenDia"></div>`
        : `
          <div class="py-8 text-center bg-slate-950 rounded-xl border border-dashed border-slate-700">
            <p class="text-3xl mb-2">📭</p>
            <p class="text-sm font-bold text-slate-200">Este alumno no tiene una rutina activa</p>
            <p class="text-xs text-slate-500 mt-1 px-4">Asígnale una desde «Crear rutina» o activa una del historial.</p>
          </div>`;
      return `
        <div id="bloqueRutinaCoach" class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-lg">
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="min-w-0">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Rutina asignada</p>
              <h3 class="text-base sm:text-lg font-extrabold text-white leading-tight">${escHtml(nombre || 'Sin rutina activa')}</h3>
              ${rutina.length ? `<p class="text-[11px] text-slate-500 mt-0.5">${rutina.length} ejercicios · ${DIAS_SEMANA.filter(d => resumenDia(d).ejs.length).length} días de entrenamiento</p>` : ''}
            </div>
            ${rutina.length ? '<span class="shrink-0 text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded-full">● Activa</span>' : ''}
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
      let peso = '<span class="text-slate-500">Sin pesos registrados aún</span>';
      if (hp.ultimo) {
        const d = hp.previo ? Math.round((hp.ultimo.kg - hp.previo.kg) * 10) / 10 : null;
        const tendencia = d === null ? ''
          : d > 0 ? `<span class="text-emerald-400 font-bold">▲ +${fmtKg(d)}</span>`
          : d < 0 ? `<span class="text-rose-400 font-bold">▼ ${fmtKg(d)}</span>`
          : '<span class="text-slate-500 font-bold">= igual</span>';
        peso = `<span class="text-slate-500">Sem. ${hp.ultimo.numero}:</span> <span class="font-extrabold text-white">${fmtKg(hp.ultimo.kg)} kg</span> ${tendencia}`;
      }
      const chip = (t, cls) => `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${cls}">${t}</span>`;
      const chips = [
        r.musculo ? chip(escHtml(String(r.musculo).toUpperCase()), 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30') : '',
        chip(`${escHtml(r.serie || '—')} × ${escHtml(r.repeticiones || '—')}`, 'bg-slate-800 text-white border-slate-700'),
        chip('⏱ ' + escHtml(tempo), 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-mono'),
        chip('💤 ' + escHtml(r.descanso || 0) + 's', 'bg-slate-800 text-slate-300 border-slate-700'),
        (!enGrupo && ETIQUETA_TIPO[tipo]) ? chip(ETIQUETA_TIPO[tipo], 'bg-sky-500/10 text-sky-300 border-sky-500/30') : ''
      ].join('');
      const datos = `data-id="${escHtml(r.idEjercicio)}" data-nombre="${escHtml(r.ejercicio)}" data-media="${escHtml(r.media)}"
        onclick="abrirModalEjercicio(this.dataset.id, this.dataset.nombre, this.dataset.media)"`;
      const mini = r.media
        ? `<button type="button" ${datos} title="Ver GIF y técnica" class="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-slate-700 overflow-hidden p-0.5 active:scale-95 transition">
             <img src="${urlMini(r.media)}" alt="" loading="lazy" decoding="async" class="w-full h-full object-contain"></button>`
        : '<span class="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">🏋️</span>';
      const estado = est.completo
        ? '<span class="shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm" title="Completado esta semana">✓</span>'
        : est.hechas > 0
          ? `<span class="shrink-0 w-8 h-8 rounded-full border-2 border-amber-500/60 text-amber-300 flex items-center justify-center font-black text-[10px]" title="Series hechas esta semana">${est.hechas}/${est.total}</span>`
          : '<span class="shrink-0 w-8 h-8 rounded-full border-2 border-slate-700" title="Pendiente esta semana"></span>';
      return `
        <div class="flex items-center gap-3 ${enGrupo ? 'bg-slate-950/80 rounded-xl p-2.5' : ''}">
          ${mini}
          <div class="min-w-0 flex-1">
            <p class="text-[13px] font-extrabold text-white uppercase leading-tight line-clamp-2"><span class="text-slate-500">${numero}.</span> ${escHtml(r.ejercicio || 'Ejercicio')}</p>
            <div class="flex flex-wrap gap-1 mt-1.5">${chips}</div>
            <p class="text-[11px] mt-1.5">${peso}</p>
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
                          : 'bg-slate-950/40 text-slate-600 border-slate-800');
      });
      actualizarEstadoSubida();
      const cont = document.getElementById('detalleResumenDia');
      if (!cont) return;
      const { ejs, bases, hechos } = resumenDia(dia);
      if (!ejs.length) {
        cont.innerHTML = `
          <div class="py-6 text-center bg-slate-950 rounded-xl border border-slate-800">
            <p class="text-sm font-bold text-emerald-400">🛌 ${escHtml(nombreDia(dia))}: descanso</p>
            <p class="text-xs text-slate-500 mt-1">No hay ejercicios programados este día.</p>
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
              <p class="text-[10px] font-black text-sky-300 uppercase tracking-wider px-1 pt-0.5">⚡ ${ETIQUETA_TIPO[b.tipo] || 'Grupo'} · sin descanso entre ejercicios</p>
              ${filas}
            </div>`;
        }
        const i = b.idxs[0];
        return `<div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">${filaResumenEjercicio(ejs[i], i + 1, diaNorm, bases[i], false)}</div>`;
      }).join('');
      cont.innerHTML = `
        <div class="flex items-end justify-between gap-3 mb-2">
          <div class="min-w-0">
            <p class="text-sm font-extrabold text-white">${escHtml(nombreDia(dia))} <span class="text-slate-500 font-semibold">· ${ejs.length} ejercicios · ${series} series</span></p>
            <p class="text-[11px] text-emerald-300/90 font-semibold mt-0.5 truncate">${escHtml(musculos.join(' · '))}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-lg font-black leading-none ${pct === 100 ? 'text-emerald-400' : 'text-white'}">${hechos}/${ejs.length}</p>
            <p class="text-[9px] text-slate-500 uppercase font-bold mt-1">esta semana</p>
          </div>
        </div>
        <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4"><div class="h-full bg-emerald-500 rounded-full transition-all" style="width:${pct}%"></div></div>
        <div class="space-y-2">${bloques}</div>
        <p class="text-[10px] text-slate-600 mt-3 text-center">Toca la miniatura para ver el GIF y la técnica · ✓ completado · n/n series hechas esta semana</p>`;
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
      if (!confirm(`¿Activar «${h ? h.nombreRutina : 'esta rutina'}»?\n\nEl alumno dejará de ver su rutina actual y verá esta. Su progreso no se borra.`)) return;
      GS().withSuccessHandler(res => {
        if (!res || !res.success) return alert((res && res.error) || 'No se pudo activar la rutina.');
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
        return '<div class="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs">Se requieren al menos 2 controles para calcular tus variaciones (Delta).</div>';
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
        let icono = '➖';
        let bgClase = 'bg-slate-950 border-slate-800';
        
        if (diffNum > 0) {
          colorClase = invertido ? 'text-rose-400' : 'text-emerald-400';
          icono = invertido ? '📈' : '🔥';
          bgClase = invertido ? 'bg-rose-950/20 border-rose-500/20' : 'bg-emerald-950/20 border-emerald-500/20';
        } else if (diffNum < 0) {
          colorClase = invertido ? 'text-emerald-400' : 'text-rose-400';
          icono = invertido ? '🔥' : '📉';
          bgClase = invertido ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-rose-950/20 border-rose-500/20';
        }
        
        return `
          <div onclick="abrirGraficoDelta('${key}', '${label}', '${unidad}')" class="p-4 rounded-xl border flex flex-col justify-between shadow-lg transition-all cursor-pointer hover:scale-[1.03] ${bgClase}">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">${label}</span>
            <div class="flex items-end justify-between">
              <div>
                <span class="text-2xl font-black text-white leading-none block">${valAct}<span class="text-xs text-slate-500">${unidad}</span></span>
                <span class="text-[10px] text-slate-500 line-through mt-1 block">Antes: ${valIni}${unidad}</span>
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
        : '<p class="text-slate-500 text-xs">Sin variaciones registradas aún.</p>';
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
        const m = (et, v, u) => `<div class="bg-slate-950 rounded-lg px-2 py-1.5"><p class="text-[9px] text-slate-500 font-bold uppercase">${et}</p><p class="text-sm font-extrabold text-white">${(v === '' || v === undefined || v === null) ? '—' : v}<span class="text-[10px] text-slate-500 font-semibold"> ${u}</span></p></div>`;
        return `<div class="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div class="flex items-center justify-between mb-2"><span class="text-xs font-extrabold text-emerald-400">${p.fecha}</span><span class="text-[11px] font-bold text-amber-400">${p.grasaCorporal}% grasa</span></div>
          <div class="grid grid-cols-3 gap-1.5">${m('Peso', p.peso, 'kg')}${m('IMC', p.imc, '')}${m('Pecho', p.pecho, 'cm')}${m('Hombros', p.hombros, 'cm')}${m('Brazo', (p.brazoRelajado || '') + ' / ' + (p.brazoFlexionado || ''), 'cm')}${m('Cintura', p.cintura, 'cm')}${m('Cadera', p.cadera, 'cm')}${m('Glúteos', p.gluteos, 'cm')}${m('Muslo', p.muslo, 'cm')}${m('Pantorrilla', p.pantorrilla, 'cm')}</div>
        </div>`;
      }).join('');
      return `
      <div class="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
          <h3 class="text-base sm:text-lg font-extrabold text-emerald-400 uppercase tracking-wider mb-1">Análisis de Progreso y Evolución</h3>
          <p class="text-xs text-slate-400 mb-4">Selecciona el módulo que deseas inspeccionar en detalle:</p>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
            <button onclick="cambiarSeccionProgreso('secPerimetros')" id="btn-secPerimetros" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-lg">
              <div class="text-xs sm:text-sm">📏 Progreso General y Medidas</div>
            </button>
            
            ${tienePliegues ? `
              <button onclick="cambiarSeccionProgreso('secPliegues')" id="btn-secPliegues" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 font-semibold">
                <div class="text-xs sm:text-sm">📐 Pliegues Cutáneos (mm)</div>
              </button>
            ` : ''}
            
            <button onclick="cambiarSeccionProgreso('secComparativa')" id="btn-secComparativa" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 font-semibold">
              <div class="text-xs sm:text-sm">📸 Comparativa Visual (Antes vs. Después)</div>
            </button>
            
            <button onclick="cambiarSeccionProgreso('secSemanal')" id="btn-secSemanal" class="btn-seccion-prog text-left p-3.5 rounded-xl border transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800 font-semibold">
              <span class="block text-xs uppercase tracking-wider">📅 Progreso Semanal</span><span class="block text-[11px] font-normal text-slate-400 mt-0.5">Cargas en el Gym</span>
            </button>
          </div>

          <div id="secPerimetros" class="seccion-progreso-detalle space-y-6">
            <!-- B2: gráficos de línea del historial (antes los canvas no existían y nunca se dibujaban) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div class="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
                <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3">📈 Evolución del Peso Corporal</h4>
                <div class="relative h-60 sm:h-64"><canvas id="chartPeso"></canvas></div>
              </div>
              <div class="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
                <h4 class="text-xs font-extrabold uppercase tracking-wider text-sky-400 mb-3">📊 Composición Corporal (grasa, IMC y masa)</h4>
                <div class="relative h-60 sm:h-64"><canvas id="chartComposicion"></canvas></div>
              </div>
            </div>
            <div class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-lg">
              <div class="mb-4">
                <h4 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-400">🔥 Tarjetas Delta de Progreso</h4>
                <p class="text-[11px] text-slate-400">Toca cualquier tarjeta para visualizar su gráfico de evolución.</p>
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
               <h4 class="text-xs font-extrabold uppercase tracking-wider text-purple-400 mb-1">📐 Evolución de Pliegues Cutáneos</h4>
               <p class="text-[11px] text-slate-400 mb-3">Mediciones con plicómetro (mm) por fecha de evaluación.</p>
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
      if (!p || !r || p <= 0 || r <= 0) return alert('Ingresa valores válidos.');
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
            <p class="text-emerald-400 font-bold text-sm sm:text-base mb-1">🛌 Día de Descanso / Recuperación Activa</p>
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

      // 3. Renderizar cada bloque según su diseño visual
      const bloquesHTML = bloques.map(bloque => {
        
        // ==================== CASO A: CONTENEDOR DE BI-SERIE O TRI-SERIE ====================
        if (bloque.tipo === 'GRUPO') {
          const esTri = bloque.subtipo === 'TRISERIE';
          const tituloGrupo = esTri ? 'TRI-SERIE (3 EJERCICIOS SEGUIDOS)' : 'SÚPER SERIE / BI-SERIE (2 EJERCICIOS)';
          const badgeGrupo = esTri ? '🔥 TRI-SERIE' : '⚡ SÚPER SERIE';
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
              <div class="bg-slate-900/95 border ${estaMarcado ? 'border-emerald-500/50 bg-emerald-950/10 opacity-75' : 'border-slate-800'} rounded-xl p-3.5 transition-all">
                <div class="flex justify-between items-start gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-xs flex items-center justify-center">${pos + 1}.</span>
                      <h5 class="text-sm sm:text-base font-black text-white tracking-wide uppercase ${estaMarcado ? 'line-through text-slate-400' : ''}">${escHtml(r.ejercicio)}</h5>
                    </div>
                    <div class="pl-8">${chipTecnica(r)}</div>
                  </div>
                  <button onclick="alternarCheckEjercicio('${storageKey}', ${idx})" 
                    class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all shrink-0 ${estaMarcado ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-emerald-500'}">
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
                  <span class="text-[10px] uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full">
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
                  <span class="${colorBadge} text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1">
                    ${badgeGrupo} 
                    <button onclick="mostrarAyudaGym('${esTri ? 'TRISERIE' : 'BISERIE'}')" class="bg-black/20 text-current rounded-full px-1.5 py-0.5 text-[10px] transition hover:bg-black/40">?</button>
                </span>
                  <h4 class="text-xs sm:text-sm font-black text-white uppercase tracking-wider">${tituloGrupo} - <span class="text-emerald-400">${escHtml(musculosUnicos)}</span></h4>
                </div>
                <span class="bg-slate-900 text-slate-300 border border-slate-700 px-3 py-1 rounded-lg text-xs font-extrabold">🔢 ${escHtml(seriesGrupo)} Series Totales</span>
              </div>

              <div>${subTarjetasHTML}</div>

              <div class="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                <div class="text-xs font-extrabold text-white uppercase tracking-wider">
                  ⏱️ DESCANSAR TRAS ${esTri ? 'TRI-SERIE' : 'SÚPER SERIE'}: <span class="text-emerald-400 text-sm">${descansoFinal}s</span>
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
          let config = { colorBorde: 'border-rose-500/50', badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40', titulo: '🔻 DROP SET (BAJANDO PESO)', etiquetaPaso: 'Caída', colorTextoPaso: 'text-rose-400', txtSecundario: 'Bajar Peso' };
          
          if (bloque.tipo === 'ASCENDING') {
            config = { colorBorde: 'border-amber-500/50', badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', titulo: '🔺 ASCENDING SERIES (SUBIENDO PESO)', etiquetaPaso: 'Serie', colorTextoPaso: 'text-amber-400', txtSecundario: 'Subir Peso' };
          } else if (bloque.tipo === 'PIRAMIDE') {
            config = { colorBorde: 'border-blue-500/50', badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40', titulo: '🔼🔽 PIRÁMIDE COMPLETA (5 SERIES SEGUIDAS)', etiquetaPaso: 'Fase', colorTextoPaso: 'text-blue-400', txtSecundario: 'Ajustar Peso' };
          }

          const filasDropHTML = caidasReps.map((repNum, dropIdx) => {
            const dropLoadKey = kp(idx, 'carga_d' + (dropIdx + 1));
            const dropCheckKey = kp(idx, 'ok_d' + (dropIdx + 1));
            const pesoDrop = leerProg(dropLoadKey) || '';
            const checkDrop = leerProg(dropCheckKey) === 'true';
            
            // Lógica de etiquetas: Las primeras 3 suben (idx 0,1,2), las últimas 2 bajan (idx 3,4) para Pirámide
            let etiquetaBajada = dropIdx === 0 ? 'Peso Inicial' : `🔥 ${config.txtSecundario}`;
            if (bloque.tipo === 'PIRAMIDE' && dropIdx > 0) {
              etiquetaBajada = dropIdx < 3 ? '🔺 Subir Peso' : '🔻 Bajar Peso';
            }

            return `
              <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border ${checkDrop ? 'border-emerald-500/50' : 'border-slate-800'} px-3 py-2.5 rounded-xl text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold ${config.colorTextoPaso}">${config.etiquetaPaso} ${dropIdx + 1}:</span>
                  <span class="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">${escHtml(repNum)} Reps</span>
                  <span class="text-[10px] font-semibold ${dropIdx === 0 ? 'text-slate-400' : (etiquetaBajada.includes('Bajar') ? 'text-rose-300' : 'text-emerald-300')}">${etiquetaBajada}</span>
                </div>
                <div class="flex items-center gap-2">
                  <input type="text" value="${escHtml(pesoDrop)}" placeholder="Ej. 20kg"
                    onchange="guardarCargaEjercicio('${dropLoadKey}', this.value)"
                    class="w-20 p-1 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold text-center text-xs">
                  <button onclick="alternarCheckSubDrop('${dropCheckKey}', '${storageKey}', ${caidasReps.length}, '${userId}', '${hoyKey}', '${diaNorm}', ${idx})"
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
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">${escHtml(r.musculo)}</span>
                    <span class="text-[10px] uppercase font-black px-2.5 py-0.5 ${config.badgeBg} rounded-md flex items-center gap-1">
                      ${config.titulo} 
                      <button onclick="mostrarAyudaGym('${bloque.tipo}')" class="bg-black/20 text-current rounded-full px-1.5 py-0.5 text-[10px] transition hover:bg-black/40">?</button>
                    </span>
                  </div>
                  <h4 class="text-base sm:text-lg font-black text-white mt-1.5 tracking-wide uppercase ${estaMarcado ? 'line-through text-slate-400' : ''}">${escHtml(r.ejercicio)}</h4>
                  ${chipTecnica(r)}
                </div>
                <button onclick="alternarCheckEjercicio('${storageKey}', ${idx})" 
                  class="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shrink-0 ${estaMarcado ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-emerald-500'}">
                  ✓
                </button>
              </div>

              ${gifEj(r)}

              ${filaEspecs(r, segDescanso, 'Fases')}

              <div class="space-y-2 mt-2 pt-3 border-t border-slate-800">
                <p class="text-[11px] text-slate-400 font-semibold">👇 Registra el peso en cada paso de la secuencia:</p>
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
          <div class="bg-slate-900 border ${estaMarcado ? 'border-emerald-500/50 bg-emerald-950/10 opacity-75' : 'border-slate-800'} rounded-2xl p-4 mb-4 transition-all shadow-md">
            <div class="flex justify-between items-start gap-3 mb-2">
              <div class="flex items-start gap-3 min-w-0">
                <div class="min-w-0">
                  <span class="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">${escHtml(r.musculo)}</span>
                  <h4 class="text-base sm:text-lg font-black text-white mt-1 tracking-wide uppercase ${estaMarcado ? 'line-through text-slate-400' : ''}">${escHtml(r.ejercicio)}</h4>
                  ${chipTecnica(r)}
                </div>
              </div>
              <button onclick="alternarCheckEjercicio('${storageKey}', ${idx})" 
                class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shrink-0 ${estaMarcado ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-95' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-emerald-500'}">
                ✓
              </button>
            </div>

            ${gifEj(r)}

            ${filaEspecs(r, segDescanso)}

            ${tablaSeries(r, idx, kp, diaNorm)}
          </div>
        `;
      }).join('');

      const porcentaje = Math.round((completados / ejerciciosDia.length) * 100);
      contador.innerText = `${dia}: ${completados}/${ejerciciosDia.length} (${porcentaje}%)`;

      contenedor.innerHTML = bloquesHTML;
      activarGifsEnPantalla();
      precargarDetallesDia();
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
          <p class="text-[9px] font-bold text-slate-500 uppercase tracking-tight sm:tracking-wider leading-tight">${et}</p>
          <div class="mt-0.5 leading-none">${val}</div>
        </div>`;
      return `
        <div class="grid grid-cols-4 divide-x divide-slate-800 bg-slate-950 border border-slate-800 rounded-xl mb-3 overflow-hidden">
          ${cel(etiquetaSeries || 'Series', `<span class="text-sm font-black text-white">${escHtml(String(r.serie || '-'))}</span>`)}
          ${cel('Reps', `<span class="text-sm font-black text-white">${escHtml(String(r.repeticiones || '-'))}</span>`)}
          ${cel('Tempo', `<span class="text-[11px] font-mono font-black text-amber-300">${tempo}</span><button onclick="mostrarAyudaGym('TEMPO')" class="ml-1 bg-amber-500/20 text-amber-400 rounded-full px-1 text-[9px] font-black border border-amber-500/30 align-middle">?</button>`)}
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
              <span class="text-[11px] font-black ${hecha ? 'text-emerald-400' : 'text-slate-500'}">S${n}</span>
              <div class="relative">
                <input type="number" inputmode="decimal" step="0.5" value="${escHtml(peso)}" placeholder="${antP ? escHtml(antP) : ''}"
                  onchange="guardarCargaEjercicio('${kPeso}', this.value)"
                  class="w-full p-2 pr-8 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold text-center text-sm">
                <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold pointer-events-none">kg</span>
              </div>
              <button type="button" onclick="alternarSerie('${kOk}', ${idx}, ${total})" title="Serie hecha"
                class="w-9 h-9 rounded-lg flex items-center justify-center font-bold transition ${hecha ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border border-slate-700 text-slate-500'}">✓</button>
            </div>
            ${antP ? `<p class="text-[10px] text-slate-500 mt-1 pl-[1.9rem]">Semana pasada: <span class="text-slate-400 font-semibold">${escHtml(antP)} kg</span></p>` : ''}
          </div>`;
      }
      const refGeneral = (!hayRefSerie && viejoAntes)
        ? `<p class="text-[11px] text-amber-300/90 mb-2">📌 La semana pasada registraste <span class="font-bold">${escHtml(viejoAntes)}</span> en este ejercicio.</p>` : '';
      return `
        <div class="pt-3 border-t border-slate-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">⚖️ Registra cada serie</span>
            <span class="text-[10px] text-slate-600">peso en kg</span>
          </div>
          ${refGeneral}
          <div class="space-y-1.5 pr-14 sm:pr-16">${filas}</div>
          ${viejoHoy ? `<p class="text-[10px] text-amber-400/80 mt-2">Registro anterior de este ejercicio: ${escHtml(viejoHoy)}</p>` : ''}
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
          : `<div class="h-56 flex items-center justify-center text-slate-500 text-xs">Sin foto en ${escHtml(angulo)}</div>`;
        return `${imgHtml}
          <div class="text-[11px] text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 w-full text-left">
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
      document.getElementById('modalFotoCompleta').classList.remove('hidden');
      pintarGaleria();
    }
    const galeria = { items: [], pos: 0, angulo: 'urlFrente', x0: null };
    const NOMBRE_ANGULO = { urlFrente: 'Frente', urlPerfil: 'Perfil', urlEspalda: 'Espalda' };
    function pintarGaleria() {
      const it = galeria.items[galeria.pos]; if (!it) return;
      const r = it.reg;
      const imgGal = document.getElementById('imgFotoCompleta');
      imgGal.referrerPolicy = 'no-referrer';
      imgGal.dataset.b64Try = '';
      imgGal.onerror = () => cargarFotoSegura(imgGal, false);
      imgGal.src = urlFotoConCache(r[galeria.angulo] || '');
      document.getElementById('galContador').innerText = `${NOMBRE_ANGULO[galeria.angulo] || ''} · ${galeria.pos + 1} / ${galeria.items.length}`;
      document.getElementById('galPuntos').innerHTML = galeria.items.map((_, k) => `<span class="w-2 h-2 rounded-full ${k === galeria.pos ? 'bg-emerald-400' : 'bg-slate-700'}"></span>`).join('');
      document.getElementById('txtFotoCompletaInfo').innerHTML = r.fecha ? `
        <div class="text-[11px] text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
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

    function cerrarModalFotoCompleta() {
      document.getElementById('modalFotoCompleta').classList.add('hidden');
      document.getElementById('imgFotoCompleta').src = ''; // Limpiar memoria
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
      const cache = mini ? cacheMiniaturas : cacheFotosDrive;
      if (cacheFotosDrive[id] || cache[id]) {
        img.src = cacheFotosDrive[id] || cache[id];
        return;
      }
      const runner = GS()
        .withFailureHandler(() => {
          if (esAvatar && estadoGlobal.user) img.src = obtenerAvatarFallback(estadoGlobal.user.nombre);
        })
        .withSuccessHandler(res => {
          if (res && res.success && res.dataUri) {
            cache[id] = res.dataUri;
            img.src = res.dataUri;
          } else if (esAvatar && estadoGlobal.user) {
            img.src = obtenerAvatarFallback(estadoGlobal.user.nombre);
          }
        });
      if (mini) runner.obtenerMiniaturaBase64(id); else runner.obtenerFotoBase64(id);
    } 

    function actualizarAvataresUI() {
      if (!estadoGlobal.user) return;
      const url = urlFotoConCache(estadoGlobal.user.urlFotoPerfil) || obtenerAvatarFallback(estadoGlobal.user.nombre);
      const ids = ['avatarAlumnoBanner', 'avatarAlumnoSidebar', 'avatarCoachHeader', 'avatarAlumnoTop', 'avatarAlumnoPerfil'];
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
        return alert('El nombre y el usuario no pueden quedar vacíos.');
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
          if (!res.success) return alert(res.error);

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
          if (coachWel) coachWel.innerText = `Coach activo: ${estadoGlobal.user.nombre}`;

          actualizarAvataresUI();
          alert(res.mensaje);
          cerrarModalPerfil();
        })
        .actualizarPerfilUsuario(payload);
    }

    async function ejecutarCambioPassword() {
      const actual = document.getElementById('passActual').value;
      const nueva = document.getElementById('passNueva').value;
      const confirmar = document.getElementById('passConfirmar').value;
      const btn = document.getElementById('btnGuardarPass');

      if (!actual || !nueva || !confirmar) return alert('Completa los tres campos de contraseña.');
      if (nueva.length < 4) return alert('La nueva contraseña debe tener al menos 4 caracteres.');
      if (nueva !== confirmar) return alert('La nueva contraseña y su confirmación no coinciden.');

      btn.innerText = 'Cifrando y actualizando...';
      btn.disabled = true;

      const hashActual = await sha256(actual);
      const hashNuevo = await sha256(nueva);

      GS()
        .withSuccessHandler(res => {
          btn.innerText = 'Actualizar Contraseña';
          btn.disabled = false;
          alert(res.mensaje || res.error);
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
      detenerCronometro();
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
       'hojaCronometro', 'hojaCheckin', 'hojaDuplicar', 'avisoEdicionRutina'].forEach(id => {
        const el = document.getElementById(id); if (el) el.classList.add('hidden');
      });
      ['contenedorComparativaCoach', 'contenedorRutinaAlumno', 'contenedorHistorialAlumno',
       'resumenInicioCards', 'listaConstructorRutina'].forEach(id => {
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
        tituloHTML: '<div class="flex items-center gap-3"><span class="text-2xl text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">⏱️</span><div><span class="block text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Metodología Clave</span><h3 class="text-base sm:text-lg font-black text-white">Guía de TEMPO (4 dígitos: ej. 3-1-1-0)</h3></div></div>',
        descHTML: '<p class="text-xs text-slate-300 mb-4">Controla los segundos exactos de cada fase de la repetición para maximizar la hipertrofia y prevenir lesiones. Los dígitos van en pareja: <b class="text-emerald-300">bajada</b> y <b class="text-amber-300">subida</b>.</p>' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
          '<div class="bg-emerald-500/5 p-3 sm:p-4 rounded-xl border border-emerald-500/30"><span class="block text-xs font-black text-emerald-300 mb-1.5 tracking-wider">1º EXCÉNTRICA</span><span class="text-xs text-slate-300">Descenso o bajada negativa, controlada, resistiendo la carga.</span></div>' +
          '<div class="bg-emerald-500/5 p-3 sm:p-4 rounded-xl border border-emerald-500/30"><span class="block text-xs font-black text-emerald-300 mb-1.5 tracking-wider">2º PAUSA EXCÉNTRICA</span><span class="text-xs text-slate-300">Isometría en el punto de estiramiento. Elimina el rebote elástico.</span></div>' +
          '<div class="bg-amber-500/5 p-3 sm:p-4 rounded-xl border border-amber-500/30"><span class="block text-xs font-black text-amber-300 mb-1.5 tracking-wider">3º CONCÉNTRICA</span><span class="text-xs text-slate-300">Fase de empuje o subida. Máxima aceleración voluntaria.</span></div>' +
          '<div class="bg-amber-500/5 p-3 sm:p-4 rounded-xl border border-amber-500/30"><span class="block text-xs font-black text-amber-300 mb-1.5 tracking-wider">4º PAUSA CONCÉNTRICA</span><span class="text-xs text-slate-300">Contracción de pico o reajuste antes de la siguiente repetición.</span></div>' +
          '</div>'
      },
      'BISERIE': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">⚡ Bi-Serie (Súper Serie)</h3>', 
        descHTML: 'Es hacer 2 ejercicios distintos de corrido, uno justo después del otro. Solo descansas cuando terminas ambos. Prepárate para sudar.' 
      },
      'TRISERIE': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">🔥 Tri-Serie</h3>', 
        descHTML: 'Igual que la Bi-Serie, pero con 3 ejercicios seguidos sin parar. Es un trabajo intenso para agotar el músculo rápido.' 
      },
      'DROPSET': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">🔻 Drop Set (Serie Descendente)</h3>', 
        descHTML: 'Haces el ejercicio hasta que no puedas más (FALLO) o poner un peso que en la ultima repetición ya no puedas mas (FALLO), le bajas el peso rápido y sigues haciendo más repeticiones sin descansar. Te ayuda a exprimir al máximo tus fuerzas.' 
      },
      'ASCENDING': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">🔺 Serie Ascendente</h3>', 
        descHTML: 'Vas subiendo el peso en cada serie que haces. Excelente para ganar fuerza poco a poco en el mismo entrenamiento.' 
      },
      'PIRAMIDE': { 
        tituloHTML: '<h3 class="text-lg font-black text-emerald-400">🔼🔽 Pirámide Completa</h3>', 
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
