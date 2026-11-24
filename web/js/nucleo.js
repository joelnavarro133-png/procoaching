    // nucleo.js · Estado global, utilidades, conexión con el servidor, biblioteca de ejercicios,
    // progreso semanal, inicio de sesión, navegación, pantalla «Hoy» y check-in. (Se incluye dentro del <script> de Index.html)
    // ==================== ÍCONOS (v14) · Lucide (ISC, https://lucide.dev), integrados: funcionan sin internet ====================
    const ICONOS = {"circle-check":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m16 9-5.5 5.5L8 12\"/>","circle-x":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m15 9-6 6\"/> <path d=\"m9 9 6 6\"/>","check":"<path d=\"M20 6 9 17l-5-5\"/>","x":"<path d=\"M18 6 6 18\"/> <path d=\"m6 6 12 12\"/>","dumbbell":"<path d=\"M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z\"/> <path d=\"m2.5 21.5 1.4-1.4\"/> <path d=\"m20.1 3.9 1.4-1.4\"/> <path d=\"M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z\"/> <path d=\"m9.6 14.4 4.8-4.8\"/>","scale":"<path d=\"M12 3v18\"/> <path d=\"m19 8 3 8a5 5 0 0 1-6 0zV7\"/> <path d=\"M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1\"/> <path d=\"m5 8 3 8a5 5 0 0 1-6 0zV7\"/> <path d=\"M7 21h10\"/>","biceps-flexed":"<path d=\"M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1\"/> <path d=\"M15 14a5 5 0 0 0-7.584 2\"/> <path d=\"M9.964 6.825C8.019 7.977 9.5 13 8 15\"/>","loader-circle":"<path d=\"M21 12a9 9 0 1 1-6.219-8.56\"/>","hourglass":"<path d=\"M5 22h14\"/> <path d=\"M5 2h14\"/> <path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/> <path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/>","clipboard-list":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/> <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/> <path d=\"M12 11h4\"/> <path d=\"M12 16h4\"/> <path d=\"M8 11h.01\"/> <path d=\"M8 16h.01\"/>","chart-column":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\"/> <path d=\"M18 17V9\"/> <path d=\"M13 17V5\"/> <path d=\"M8 17v-3\"/>","timer":"<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\"/> <line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\"/> <circle cx=\"12\" cy=\"14\" r=\"8\"/>","triangle-alert":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/> <path d=\"M12 9v4\"/> <path d=\"M12 17h.01\"/>","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>","save":"<path d=\"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z\"/> <path d=\"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7\"/> <path d=\"M7 3v4a1 1 0 0 0 1 1h7\"/>","zap":"<path d=\"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z\"/>","message-circle":"<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"/>","file-text":"<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"/> <path d=\"M14 2v5a1 1 0 0 0 1 1h5\"/> <path d=\"M10 9H8\"/> <path d=\"M16 13H8\"/> <path d=\"M16 17H8\"/>","library":"<path d=\"m16 6 4 14\"/> <path d=\"M12 6v14\"/> <path d=\"M8 8v12\"/> <path d=\"M4 4v16\"/>","circle-help":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M9 9.5a3 2.5 0 016 0c0 2-2 2-3 3.5\"/> <path d=\"M12 17h.01\"/>","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/> <path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>","pencil":"<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"/> <path d=\"m15 5 4 4\"/>","user":"<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/> <circle cx=\"12\" cy=\"7\" r=\"4\"/>","settings":"<path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\"/> <circle cx=\"12\" cy=\"12\" r=\"3\"/>","trophy":"<path d=\"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2\"/> <path d=\"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2\"/> <path d=\"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3\"/> <path d=\"M4 22h16\"/> <path d=\"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z\"/> <path d=\"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3\"/>","calendar":"<path d=\"M8 2v3\"/> <path d=\"M16 2v3\"/> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/> <path d=\"M3 9h18\"/>","ruler":"<path d=\"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z\"/> <path d=\"m14.5 12.5 2-2\"/> <path d=\"m11.5 9.5 2-2\"/> <path d=\"m8.5 6.5 2-2\"/> <path d=\"m17.5 15.5 2-2\"/>","arrow-right":"<path d=\"M5 12h14\"/> <path d=\"m12 5 7 7-7 7\"/>","refresh-cw":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/> <path d=\"M21 3v5h-5\"/> <path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/> <path d=\"M8 16H3v5\"/>","trash-2":"<path d=\"M10 11v6\"/> <path d=\"M14 11v6\"/> <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/> <path d=\"M3 6h18\"/> <path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/>","download":"<path d=\"M12 15V3\"/> <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/> <path d=\"m7 10 5 5 5-5\"/>","trending-down":"<path d=\"M16 17h6v-6\"/> <path d=\"m22 17-8.5-8.5-5 5L2 7\"/>","trending-up":"<path d=\"M16 7h6v6\"/> <path d=\"m22 7-8.5 8.5-5-5L2 17\"/>","arrow-up-down":"<path d=\"m21 16-4 4-4-4\"/> <path d=\"M17 20V4\"/> <path d=\"m3 8 4-4 4 4\"/> <path d=\"M7 4v16\"/>","search":"<path d=\"m21 21-4.34-4.34\"/> <circle cx=\"11\" cy=\"11\" r=\"8\"/>","person-standing":"<circle cx=\"12\" cy=\"5\" r=\"1\"/> <path d=\"m9 20 3-6 3 6\"/> <path d=\"m6 8 6 2 6-2\"/> <path d=\"M12 10v4\"/>","copy":"<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/> <path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/>","hash":"<line x1=\"4\" x2=\"20\" y1=\"9\" y2=\"9\"/> <line x1=\"4\" x2=\"20\" y1=\"15\" y2=\"15\"/> <line x1=\"10\" x2=\"8\" y1=\"3\" y2=\"21\"/> <line x1=\"16\" x2=\"14\" y1=\"3\" y2=\"21\"/>","bed":"<path d=\"M2 4v16\"/> <path d=\"M2 8h18a2 2 0 0 1 2 2v10\"/> <path d=\"M2 17h20\"/> <path d=\"M6 8v9\"/>","users":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/> <path d=\"M16 3.128a4 4 0 0 1 0 7.744\"/> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/> <circle cx=\"9\" cy=\"7\" r=\"4\"/>","folder":"<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"/>","pen-line":"<path d=\"M13 21h8\"/> <path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"/>","arrow-left":"<path d=\"m12 19-7-7 7-7\"/> <path d=\"M19 12H5\"/>","house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>","camera":"<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\"/> <circle cx=\"12\" cy=\"13\" r=\"3\"/>","chevrons-down":"<path d=\"m7 6 5 5 5-5\"/> <path d=\"m7 13 5 5 5-5\"/>","notebook-pen":"<path d=\"M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4\"/> <path d=\"M2 6h4\"/> <path d=\"M2 10h4\"/> <path d=\"M2 14h4\"/> <path d=\"M2 18h4\"/> <path d=\"M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z\"/>","wrench":"<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z\"/>","target":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <circle cx=\"12\" cy=\"12\" r=\"6\"/> <circle cx=\"12\" cy=\"12\" r=\"2\"/>","map-pin":"<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/> <circle cx=\"12\" cy=\"10\" r=\"3\"/>","upload":"<path d=\"M12 3v12\"/> <path d=\"m17 8-5-5-5 5\"/> <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/>","wifi-off":"<path d=\"M12 20h.01\"/> <path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/> <path d=\"M5 12.859a10 10 0 0 1 5.17-2.69\"/> <path d=\"M19 12.859a10 10 0 0 0-2.007-1.523\"/> <path d=\"M2 8.82a15 15 0 0 1 4.177-2.643\"/> <path d=\"M22 8.82a15 15 0 0 0-11.288-3.764\"/> <path d=\"m2 2 20 20\"/>","alarm-clock":"<circle cx=\"12\" cy=\"13\" r=\"8\"/> <path d=\"M12 9v4l2 2\"/> <path d=\"M5 3 2 6\"/> <path d=\"m22 6-3-3\"/> <path d=\"M6.38 18.7 4 21\"/> <path d=\"M17.64 18.67 20 21\"/>","moon":"<path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>","bandage":"<path d=\"M10 10.01h.01\"/> <path d=\"M10 14.01h.01\"/> <path d=\"M14 10.01h.01\"/> <path d=\"M14 14.01h.01\"/> <path d=\"M18 6v12\"/> <path d=\"M6 6v12\"/> <rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\"/>","folder-open":"<path d=\"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\"/>","inbox":"<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\"/> <path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/>","pause":"<rect x=\"14\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/> <rect x=\"5\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/>","minus":"<path d=\"M5 12h14\"/>","images":"<path d=\"m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16\"/> <path d=\"M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2\"/> <circle cx=\"13\" cy=\"7\" r=\"1\" fill=\"currentColor\"/> <rect x=\"8\" y=\"2\" width=\"14\" height=\"14\" rx=\"2\"/>","arrow-down":"<path d=\"M12 5v14\"/> <path d=\"m19 12-7 7-7-7\"/>","pin":"<path d=\"M12 17v5\"/> <path d=\"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z\"/>","flame":"<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\"/>","badge-check":"<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/> <path d=\"m16 9-5.5 5.5L8 12\"/>","medal":"<path d=\"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15\"/> <path d=\"M11 12 5.12 2.2\"/> <path d=\"m13 12 5.88-9.8\"/> <path d=\"M8 7h8\"/> <circle cx=\"12\" cy=\"17\" r=\"5\"/> <path d=\"M12 18v-2h-.5\"/>","award":"<path d=\"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526\"/> <circle cx=\"12\" cy=\"8\" r=\"6\"/>","shield":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>","clipboard-check":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/> <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/> <path d=\"m9 14 2 2 4-4\"/>","history":"<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/> <path d=\"M3 3v5h5\"/> <path d=\"M12 7v5l4 2\"/>","plus":"<path d=\"M5 12h14\"/> <path d=\"M12 5v14\"/>","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/> <circle cx=\"12\" cy=\"12\" r=\"3\"/>","eye-off":"<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"/> <path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"/> <path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"/> <path d=\"m2 2 20 20\"/>","share-2":"<circle cx=\"18\" cy=\"5\" r=\"3\"/> <circle cx=\"6\" cy=\"12\" r=\"3\"/> <circle cx=\"18\" cy=\"19\" r=\"3\"/> <line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\"/> <line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\"/>","message-square":"<path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\"/>","circle-plus":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M8 12h8\"/> <path d=\"M12 8v8\"/>","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M12 6v6l4 2\"/>","arrow-up":"<path d=\"m5 12 7-7 7 7\"/> <path d=\"M12 19V5\"/>","info":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M12 16v-4\"/> <path d=\"M12 8h.01\"/>","circle-alert":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"/> <line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"/>","chart-line":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\"/> <path d=\"m19 9-5 5-4-4-3 3\"/>","languages":"<path d=\"m5 8 6 6\"/> <path d=\"m4 14 6-6 2-3\"/> <path d=\"M2 5h12\"/> <path d=\"M7 2h1\"/> <path d=\"m22 22-5-10-5 10\"/> <path d=\"M14 18h6\"/>","layers":"<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\"/> <path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\"/> <path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\"/>","bell":"<path d=\"M10.268 21a2 2 0 0 0 3.464 0\"/> <path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"/>","ellipsis":"<circle cx=\"12\" cy=\"12\" r=\"1\"/> <circle cx=\"19\" cy=\"12\" r=\"1\"/> <circle cx=\"5\" cy=\"12\" r=\"1\"/>","user-plus":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/> <circle cx=\"9\" cy=\"7\" r=\"4\"/> <line x1=\"19\" x2=\"19\" y1=\"8\" y2=\"14\"/> <line x1=\"22\" x2=\"16\" y1=\"11\" y2=\"11\"/>","clipboard-pen":"<path d=\"M16 4h2a2 2 0 0 1 2 2v2\"/> <path d=\"M21.34 15.664a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z\"/> <path d=\"M8 22H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/> <rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\"/>","calendar-check":"<path d=\"M8 2v3\"/> <path d=\"M16 2v3\"/> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/> <path d=\"M3 9h18\"/> <path d=\"m9 15 2 2 4-4\"/>","activity":"<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\"/>","send":"<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\"/> <path d=\"m21.854 2.147-10.94 10.939\"/>","chevron-right":"<path d=\"m9 18 6-6-6-6\"/>","log-out":"<path d=\"m16 17 5-5-5-5\"/> <path d=\"M21 12H9\"/> <path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/>","list-checks":"<path d=\"M13 5h8\"/> <path d=\"M13 12h8\"/> <path d=\"M13 19h8\"/> <path d=\"m3 17 2 2 4-4\"/> <path d=\"m3 7 2 2 4-4\"/>","filter":"<path d=\"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z\"/>","graduation-cap":"<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\"/> <path d=\"M22 10v6\"/> <path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\"/>"};
    /** Ícono SVG en línea. clases: tamaño y color (Tailwind). Decorativo (aria-hidden) salvo que se pase etiqueta. */
    function ico(nombre, clases = 'w-4 h-4', etiqueta = '') {
      const p = ICONOS[nombre] || ICONOS['circle-help'];
      const a11y = etiqueta ? `role="img" aria-label="${etiqueta}"` : 'aria-hidden="true"';
      return `<svg class="ico ${clases}" ${a11y} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
    }

    const DIAS_SEMANA = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    
    const FRASES_MOTIVADORAS = [
      "\"La disciplina es hacer lo que tienes que hacer, incluso cuando no tienes ganas. ¡A darlo todo hoy!\"",
      "\"Cada serie contada, cada segundo de tempo y cada kilo levantado construyen tu mejor versión.\"",
      "\"No entrenes para cumplir, entrena para superar al que eras la semana pasada. ¡Enfoque total!\"",
      "\"El progreso real no ocurre por casualidad. Respeta tu técnica, controla el descanso y domina tu sesión.\"",
      "\"Tu único rival está en el espejo. Haz que cada repetición cuente hoy.\"",
      "\"No negocio con mi cerebro a las 6 AM; mi cuerpo ya sabe lo que toca.\"",
      "\"La motivación es dopamina barata, la disciplina es progreso real.\"",
      "\"El hierro nunca miente: o lo dominas o te expone.\"",
      "\"Tu excusa suena perfectamente lógica, pero solo para ti.\"",
      "\"Romper tus propios límites es la única terapia que no puedes fingir.\"",
      "\"Entrenamos para soportar la vida, no solo para lucir bien en el espejo.\"",
      "\"Que tu constancia grite más fuerte que el botón de posponer de tu alarma.\"",
      "\"No estás agotado físicamente, estás desentrenado mentalmente.\"",
      "\"El crecimiento ocurre exactamente en esa última repetición que nadie quiere hacer.\"",
      "\"Menos scroll en la pantalla, más repeticiones en la barra.\"",
      "\"No compitas con el de al lado, destrúyete a ti mismo y vuelve a armarte.\"",
      "\"Si el proceso fuera cómodo y rápido, todo el mundo estaría fuerte.\"",
      "\"El peor entrenamiento de tu vida siempre será el que decidiste saltarte.\"",
      "\"Tu cuerpo escucha cada debilidad que tu mente decide validar.\"",
      "\"Construye tu fuerza en absoluto silencio, deja que el resultado haga el ruido.\"",
      "\"El gimnasio es el único ecosistema donde llegar al fallo técnico se celebra.\"",
      "\"El peso que hoy te aplasta, mañana será simplemente tu serie de calentamiento.\"",
      "\"La consistencia implacable de meses siempre humillará a la genética de nacimiento.\"",
      "\"Abraza la incomodidad hoy para no tener que lidiar con la frustración mañana.\"",
      "\"El sudor es la factura innegociable que pagas a diario por tu mejor versión.\""
    ];

    const INDICADORES_PESO = [{ key: 'peso', label: 'Peso Corporal (kg)', color: '#10b981' }];
    const INDICADORES_COMPOSICION = [
      { key: 'imc', label: 'IMC', color: '#38bdf8' },
      { key: 'grasaCorporal', label: '% Grasa Corporal', color: '#f59e0b' },
      { key: 'masaCorporal', label: 'Masa Magra (kg)', color: '#a78bfa' }
    ];

    // 1. Panel de Amplitud y Core (Evaluación de Ratio V-Taper)
    const INDICADORES_PERIMETROS_CORE = [
      { key: 'hombros', label: 'Hombros (cm)', color: '#f472b6' },
      { key: 'pecho', label: 'Pecho (cm)', color: '#818cf8' },
      { key: 'cintura', label: 'Cintura (cm)', color: '#fbbf24' },
      { key: 'cadera', label: 'Cadera (cm)', color: '#60a5fa' }
    ];

    // 2. Panel de Extremidades Superiores (Densidad y Tono Muscular)
    const INDICADORES_PERIMETROS_BRAZOS = [
      { key: 'brazoRelajado', label: 'Brazo Relajado (cm)', color: '#fb7185' },
      { key: 'brazoFlexionado', label: 'Brazo Flexionado (cm)', color: '#34d399' }
    ];

    // 3. Panel de Tren Inferior (Desarrollo de Pierna y Glúteo)
    const INDICADORES_PERIMETROS_PIERNAS = [
      { key: 'gluteos', label: 'Glúteos (cm)', color: '#c084fc' },
      { key: 'muslo', label: 'Muslo (cm)', color: '#2dd4bf' },
      { key: 'pantorrilla', label: 'Pantorrilla (cm)', color: '#f97316' }
    ];

    const INDICADORES_PLIEGUES = [
      { key: 'subescapular', label: 'Subescapular (mm)', color: '#10b981' },
      { key: 'tricipital', label: 'Tricipital (mm)', color: '#38bdf8' },
      { key: 'bicipital', label: 'Bicipital (mm)', color: '#f59e0b' },
      { key: 'supracrestal', label: 'Supracrestal (mm)', color: '#818cf8' },
      { key: 'suprailiaca', label: 'Suprailíaca (mm)', color: '#f472b6' },
      { key: 'abdominal', label: 'Abdominal (mm)', color: '#fb7185' }
    ];

    const INDICADORES_DIAMETROS = [
      { key: 'humero', label: 'Diám. Húmero (cm)', color: '#a78bfa' },
      { key: 'muneca', label: 'Diám. Muñeca (cm)', color: '#34d399' },
      { key: 'femur', label: 'Diám. Fémur (cm)', color: '#fbbf24' }
    ];

    let estadoGlobal = {
      user: null, alumnos: [], plantillas: [], semanas: [], progLocal: null, progresoActual: [], rutinaActual: [], catalogo: [], diaSeleccionado: 'LUNES',
      charts: {
        peso: null,
        composicion: null,
        perimetrosCore: null,
        perimetrosBrazos: null,
        perimetrosPiernas: null,
        pliegues: null,
        diametros: null
      },
      timerInterval: null
    };

    async function sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);                    
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Evaluar y obtener tabla de V-Taper
function evaluarVTaper(hombros, cintura, sexo) {
  const h = parseFloat(hombros), c = parseFloat(cintura);
  return clasificarVTaper((h > 0 && c > 0) ? h / c : 0, sexo);
}

// Clasifica un ratio hombros/cintura YA calculado (lo usa el modal de métricas)
function clasificarVTaper(ratio, sexo) {
  const val = parseFloat(ratio) > 0 ? parseFloat(ratio) : 0;
  const s = String(sexo).trim().toUpperCase();
  
  const tabla = s === 'M' ? [
    { limite: 1.29, rangoTxt: "Menos de 1.30", nombre: "Mínimo / Estrecho", desc: "Hombros y cintura con anchuras similares; poca silueta en V.", color: "rose" },
    { limite: 1.44, rangoTxt: "1.30 - 1.44", nombre: "Promedio / Moderado", desc: "Ligera conicidad; la silueta comienza a definirse.", color: "amber" },
    { limite: 1.54, rangoTxt: "1.45 - 1.54", nombre: "Atlético", desc: "Clara forma en V; aspecto notablemente deportivo.", color: "emerald" },
    { limite: 1.617, rangoTxt: "1.55 - 1.617", nombre: "Estética Avanzada", desc: "Fuerte dominancia de los hombros sobre la zona media.", color: "purple" },
    { limite: 99, rangoTxt: "1.618 o más", nombre: "Proporción Áurea", desc: "Rango excepcional, alta estética y desarrollo.", color: "orange" }
  ] : [
    { limite: 1.14, rangoTxt: "Menos de 1.15", nombre: "Estrecho / Mínimo", desc: "Hombros compactos en relación con la cintura.", color: "rose" },
    { limite: 1.25, rangoTxt: "1.15 - 1.25", nombre: "Promedio", desc: "Proporción equilibrada común en la población general.", color: "amber" },
    { limite: 1.35, rangoTxt: "1.26 - 1.35", nombre: "Atlético / Moderado", desc: "Silueta tonificada y claramente deportiva.", color: "emerald" },
    { limite: 1.45, rangoTxt: "1.36 - 1.45", nombre: "Ideal / Estético", desc: "Rango óptimo clásico de proporción hombros-cintura.", color: "purple" },
    { limite: 99, rangoTxt: "Más de 1.45", nombre: "Muy musculoso / Definido", desc: "Hombros marcadamente desarrollados, típicos de disciplinas de fuerza.", color: "orange" }
  ];

  let obj = tabla[0];
  for (let t of tabla) { if (val <= t.limite) { obj = t; break; } }
  return { val: val > 0 ? val.toFixed(2) : '-', class: obj.nombre, desc: obj.desc, tabla: tabla };
}

// Evaluar y obtener tabla de IMC
function evaluarIMC(imc, sexo) {
  const val = parseFloat(imc) || 0;
  const tabla = [
    { limite: 18.49, rangoTxt: "Menos de 18.5", nombre: "Bajo Peso / Déficit", desc: "Peso corporal por debajo del rango estándar para la estatura.", color: "amber" },
    { limite: 24.99, rangoTxt: "18.5 - 24.9", nombre: "Normopeso / Saludable", desc: "Rango óptimo estandarizado de relación peso-estatura.", color: "emerald" },
    { limite: 29.99, rangoTxt: "25.0 - 29.9", nombre: "Sobrepeso / Volumen Muscular", desc: "Por encima del estándar; en atletas suele deberse a alta masa magra (verifica tu % de grasa).", color: "purple" },
    { limite: 99, rangoTxt: "30.0 o más", nombre: "Rango Alto / Obesidad", desc: "Peso elevado respecto a la talla; contrastar siempre con el % de grasa corporal.", color: "rose" }
  ];
  let obj = tabla[0];
  for (let t of tabla) { if (val <= t.limite) { obj = t; break; } }
  return { val: val > 0 ? val.toFixed(2) : '-', class: obj.nombre, desc: obj.desc, tabla: tabla };
}

// Evaluar y obtener tabla de % Grasa Corporal
function evaluarGrasa(grasa, sexo, edad) {
  const val = parseFloat(grasa) || 0;
  const s = String(sexo).trim().toUpperCase();
  const e = parseInt(edad) || 25;
  
  let u = { ideal: 14, fitness: 17, aceptable: 22 };
  if (s === 'M') {
    if (e < 30) u = { ideal: 14, fitness: 17, aceptable: 22 };
    else if (e < 40) u = { ideal: 16, fitness: 19, aceptable: 24 };
    else if (e < 50) u = { ideal: 18, fitness: 21, aceptable: 26 };
    else if (e < 60) u = { ideal: 20, fitness: 23, aceptable: 28 };
    else u = { ideal: 22, fitness: 25, aceptable: 30 };
  } else {
    if (e < 30) u = { ideal: 20, fitness: 23, aceptable: 28 };
    else if (e < 40) u = { ideal: 21, fitness: 24, aceptable: 29 };
    else if (e < 50) u = { ideal: 23, fitness: 26, aceptable: 31 };
    else if (e < 60) u = { ideal: 24, fitness: 27, aceptable: 32 };
    else u = { ideal: 25, fitness: 28, aceptable: 33 };
  }

  const tabla = [
    { limite: u.ideal, rangoTxt: `Hasta ${u.ideal}%`, nombre: "Ideal / Atleta", desc: "Nivel de grasa excepcionalmente bajo; alta vascularidad.", color: "purple" },
    { limite: u.fitness, rangoTxt: `${u.ideal + 1}% - ${u.fitness}%`, nombre: "Fitness / Bueno", desc: "Porcentaje de grasa atlético, cortes musculares visibles.", color: "emerald" },
    { limite: u.aceptable, rangoTxt: `${u.fitness + 1}% - ${u.aceptable}%`, nombre: "Aceptable / Promedio", desc: "Rango saludable promedio para la edad.", color: "amber" },
    { limite: 99, rangoTxt: `Más de ${u.aceptable + 1}%`, nombre: "Sobrepeso / Obesidad", desc: "Exceso de tejido adiposo que debe monitorearse.", color: "rose" }
  ];

  let obj = tabla[0];
  for (let t of tabla) { if (val <= t.limite) { obj = t; break; } }
  return { val: val > 0 ? val.toFixed(2) + '%' : '-', class: obj.nombre, desc: obj.desc, tabla: tabla };
}

function abrirModalMetrica(tipo, valor, sexo, edad) {
  const numero = parseFloat(String(valor === null || valor === undefined ? '' : valor).replace('%', '').replace(',', '.'));
  if (!isFinite(numero) || numero <= 0) {
    mostrarToast('Aún no hay un valor registrado para esta métrica.');
    return;
  }

  const mtTitulo = document.getElementById('mtTitulo');
  const mtValor = document.getElementById('mtValorActual');
  const mtSubtitulo = document.getElementById('mtSubtitulo');
  const mtContenedor = document.getElementById('mtContenedorTabla');
  const esHombre = String(sexo || '').trim().toUpperCase() === 'M';
  const sexoTxt = esHombre ? 'hombre' : 'mujer';

  let datos, segmentos, emoji = '' + ico('biceps-flexed', 'w-4 h-4') + '';
  if (tipo === 'VTAPER') {
    datos = clasificarVTaper(numero, sexo);
    mtTitulo.textContent = 'RATIO V-TAPER · HOMBRO / CINTURA';
    mtSubtitulo.textContent = sexoTxt + (edad ? ` · ${edad} años` : '');
    const lims = esHombre ? [1.0, 1.30, 1.45, 1.55, 1.618, 1.75] : [0.95, 1.15, 1.26, 1.36, 1.45, 1.60];
    segmentos = [
      { corto: 'Bajo', min: lims[0], max: lims[1], hex: '#64748b' },
      { corto: 'Normal', min: lims[1], max: lims[2], hex: '#0ea5e9' },
      { corto: 'Atlético', min: lims[2], max: lims[3], hex: '#10b981' },
      { corto: 'Estético', min: lims[3], max: lims[4], hex: '#a855f7' },
      { corto: 'Élite', min: lims[4], max: lims[5], hex: '#f59e0b' }
    ];
    emoji = numero >= lims[2] ? '' + ico('biceps-flexed', 'w-4 h-4') + '' : '' + ico('ruler', 'w-4 h-4') + '';
  } else if (tipo === 'IMC') {
    datos = evaluarIMC(numero, sexo);
    mtTitulo.textContent = 'ÍNDICE DE MASA CORPORAL · IMC';
    mtSubtitulo.textContent = sexoTxt + (edad ? ` · ${edad} años` : '');
    segmentos = [
      { corto: 'Déficit', min: 14, max: 18.5, hex: '#f59e0b' },
      { corto: 'Saludable', min: 18.5, max: 25.0, hex: '#10b981' },
      { corto: 'Volumen', min: 25.0, max: 30.0, hex: '#0ea5e9' },
      { corto: 'Alto', min: 30.0, max: 38.0, hex: '#f43f5e' }
    ];
    emoji = (numero >= 18.5 && numero < 25) ? '' + ico('circle-check', 'w-4 h-4') + '' : '' + ico('scale', 'w-4 h-4') + '';
  } else if (tipo === 'GRASA') {
    datos = evaluarGrasa(numero, sexo, edad);
    mtTitulo.textContent = '% GRASA CORPORAL · COMPOSICIÓN';
    mtSubtitulo.textContent = `${sexoTxt} · ${edad || 25} años`;
    const u0 = datos.tabla[0].limite, u1 = datos.tabla[1].limite, u2 = datos.tabla[2].limite;
    segmentos = [
      { corto: 'Atleta', min: esHombre ? 6 : 12, max: u0, hex: '#0ea5e9' },
      { corto: 'Fitness', min: u0, max: u1, hex: '#10b981' },
      { corto: 'Promedio', min: u1, max: u2, hex: '#f59e0b' },
      { corto: 'Alto', min: u2, max: u2 + 12, hex: '#f43f5e' }
    ];
    emoji = numero <= u1 ? '' + ico('flame', 'w-4 h-4') + '' : '' + ico('chart-column', 'w-4 h-4') + '';
  }

  mtValor.textContent = datos.val;

  // Índice activo y posición exacta del indicador dentro de la barra segmentada
  let idxActivo = datos.tabla.findIndex(t => t.nombre === datos.class);
  if (idxActivo < 0) idxActivo = 0;
  const segAct = segmentos[idxActivo] || segmentos[0];
  const frac = Math.max(0.08, Math.min(0.92, (numero - segAct.min) / Math.max(0.01, segAct.max - segAct.min)));
  const posPct = ((idxActivo + frac) / segmentos.length) * 100;
  const hexActivo = segAct.hex;

  const barrasHTML = segmentos.map(s =>
    `<div class="h-2.5 flex-1 rounded-full" style="background-color:${s.hex};"></div>`
  ).join('');

  const etiquetasHTML = segmentos.map((s, i) =>
    `<span class="flex-1 text-center text-[11px] font-bold truncate ${i === idxActivo ? 'text-white' : 'text-slate-400'}">${s.corto}</span>`
  ).join('');

  const detalleRangosHTML = datos.tabla.map((t, i) => {
    const esAct = i === idxActivo;
    const h = (segmentos[i] && segmentos[i].hex) || '#10b981';
    return `
      <div class="p-3 rounded-xl border ${esAct ? 'bg-slate-900 border-slate-600' : 'bg-slate-950/70 border-slate-800/80'}">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-extrabold text-white">${t.rangoTxt}</span>
          <span class="text-[11px] font-black uppercase px-2 py-0.5 rounded-md" style="background-color:${h}22;color:${h};border:1px solid ${h}55;">${t.nombre}</span>
        </div>
        <p class="text-xs text-slate-400 mt-1.5 leading-snug">${t.desc}</p>
      </div>`;
  }).join('');

  mtContenedor.innerHTML = `
    <div class="rounded-2xl p-4 border" style="background-color:${hexActivo}14;border-color:${hexActivo}55;">
      <p class="text-[11px] font-black uppercase tracking-[0.16em]" style="color:${hexActivo};">TU RANGO ACTUAL</p>
      <p class="text-2xl font-black text-white mt-1 flex items-center gap-2">${datos.class} <span>${emoji}</span></p>
      <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">${datos.desc}</p>
    </div>

    <div class="pt-1">
      <div class="relative flex items-center gap-1.5">
        ${barrasHTML}
        <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-6 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none transition-all duration-500"
             style="left:${posPct.toFixed(1)}%;"></div>
      </div>
      <div class="flex items-center gap-1.5 mt-2">
        ${etiquetasHTML}
      </div>
    </div>

    <details class="bg-slate-950/60 border border-slate-800 rounded-2xl">
      <summary class="cursor-pointer select-none px-4 py-3 text-xs font-bold text-slate-300 flex items-center justify-between">
        <span>Ver descripción de cada rango</span>
        <span class="text-slate-400 text-[11px] uppercase">Desplegar ▾</span>
      </summary>
      <div class="px-3 pb-3 space-y-2">
        ${detalleRangosHTML}
      </div>
    </details>
  `;

  document.getElementById('modalTablasMetricas').classList.remove('hidden');
}

// Lógica para abrir y calcular el gráfico tipo Donut de Masa Magra vs Masa Grasa
function abrirModalComposicion(pesoVal, grasaPct, sexo) {
  if (!pesoVal || pesoVal === '-' || !grasaPct || grasaPct === '-') {
    return avisar("No hay datos suficientes de % Grasa Corporal en tu último control para calcular la composición.", 'atencion');
  }

  const peso = parseFloat(pesoVal);
  const grasa = parseFloat(grasaPct);
  const magraPct = 100 - grasa;
  
  const masaGrasa = peso * (grasa / 100);
  const masaMagra = peso - masaGrasa;

  // Personaje pixel-art según el sexo y el % de grasa
  const sx = String(sexo || (estadoGlobal.progresoActual.slice(-1)[0] || {}).sexo || '').toUpperCase();
  document.getElementById('mcAvatar').innerHTML = avatarPixel((sx.startsWith('F') || sx.startsWith('MUJ')) ? 'F' : 'M', grasa);

  // Actualizar Textos del Gráfico Donut
  document.getElementById('mcPesoTotal').innerText = peso.toFixed(1) + ' kg';
  document.getElementById('mcGrasaPctTop').innerText = grasa.toFixed(1) + '%';
  document.getElementById('mcMagraPctBottom').innerText = magraPct.toFixed(1) + '%';
  
  // Actualizar Texto Central (Porcentaje grande)
  document.getElementById('mcGrasaMain').innerText = grasa.toFixed(1) + '%';

  // Actualizar Tarjetas Inferiores
  document.getElementById('mcMasaMagraKg').innerText = masaMagra.toFixed(1) + ' kg';
  document.getElementById('mcMagraDesc').innerText = magraPct.toFixed(1) + '% del total';
  
  document.getElementById('mcMasaGrasaKg').innerText = masaGrasa.toFixed(1) + ' kg';
  document.getElementById('mcGrasaDesc').innerText = grasa.toFixed(1) + '% del total';

  // Pintar el gráfico (Magra = Esmeralda, Grasa = Naranja)
  const donut = document.getElementById('mcDonutChart');
  donut.style.background = `conic-gradient(#10b981 ${magraPct}%, #f97316 0)`;

  // Calcular la posición del indicador en la barra de espectro (aprox. 8% a 35%)
  let posFlecha = 50; 
  if (grasa < 8) posFlecha = 5;
  else if (grasa > 35) posFlecha = 95;
  else posFlecha = ((grasa - 8) / (35 - 8)) * 100;
  
  document.getElementById('mcIndicadorFlecha').style.left = posFlecha + '%';

  // Mostrar el modal
  document.getElementById('modalComposicion').classList.remove('hidden');
}

    // ==================== AVATAR VECTORIAL LIMPIO (composición corporal) ====================
    function avatarPixel(sexo, grasa) {
      const g = parseFloat(grasa);
      // Adapta sutilmente el ancho del torso según el % de grasa sin deformar el rostro
      const escala = isNaN(g) ? 1 : Math.max(0.9, Math.min(1.22, 0.9 + ((g - 10) / 30) * 0.32));
      const trCuerpo = `translate(60 0) scale(${escala.toFixed(2)} 1) translate(-60 0)`;

      if (sexo === 'F') {
        return `<svg viewBox="0 0 120 185" class="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Coleta trasera -->
          <path d="M74 22 C88 22 92 40 84 54 C78 48 76 38 72 34 Z" fill="#1e293b"/>
          <circle cx="74" cy="24" r="3.5" fill="#10b981"/>
          <!-- Cuerpo escalable -->
          <g transform="${trCuerpo}">
            <!-- Piernas / Leggings -->
            <path d="M46 104 L42 162 L51 162 L57 118 L63 118 L69 162 L78 162 L74 104 Z" fill="#334155"/>
            <path d="M46 104 L74 104 L76 112 L44 112 Z" fill="#1e293b"/>
            <!-- Zapatillas -->
            <path d="M41 162 L52 162 L53 169 C53 171 38 171 38 168 Z" fill="#e2e8f0"/>
            <path d="M68 162 L79 162 L82 168 C82 171 67 171 67 169 Z" fill="#e2e8f0"/>
            <rect x="38" y="168" width="15" height="2.5" rx="1" fill="#10b981"/>
            <rect x="67" y="168" width="15" height="2.5" rx="1" fill="#10b981"/>
            <!-- Brazos -->
            <path d="M42 54 C35 60 32 82 35 104 L42 104 C41 86 43 70 47 62 Z" fill="#f3c6a5"/>
            <path d="M78 54 C85 60 88 82 85 104 L78 104 C79 86 77 70 73 62 Z" fill="#f3c6a5"/>
            <!-- Top / Camiseta deportiva -->
            <path d="M44 50 C48 48 72 48 76 50 L82 65 L75 68 L72 60 L72 98 C66 100 54 100 48 98 L48 60 L45 68 L38 65 Z" fill="#34d399"/>
            <path d="M48 94 L72 94 L72 99 L48 99 Z" fill="#10b981"/>
            <!-- Cintura piel -->
            <rect x="49" y="99" width="22" height="5" fill="#f3c6a5"/>
          </g>
          <!-- Cuello y Cabeza -->
          <rect x="55" y="42" width="10" height="9" rx="3" fill="#eab894"/>
          <ellipse cx="60" cy="29" rx="13" ry="15" fill="#f3c6a5"/>
          <!-- Cabello frontal -->
          <path d="M47 28 C47 16 53 12 60 12 C67 12 73 16 73 28 C70 21 65 19 60 19 C55 19 50 21 47 28 Z" fill="#1e293b"/>
          <!-- Rasgos -->
          <circle cx="55.5" cy="29" r="1.4" fill="#0f172a"/>
          <circle cx="64.5" cy="29" r="1.4" fill="#0f172a"/>
          <path d="M57 35 Q60 37.5 63 35" stroke="#c07a5b" stroke-width="1.4" stroke-linecap="round"/>
        </svg>`;
      }

      return `<svg viewBox="0 0 120 185" class="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Cuerpo escalable -->
        <g transform="${trCuerpo}">
          <!-- Pantalón deportivo -->
          <path d="M44 104 L41 162 L52 162 L58 118 L62 118 L68 162 L79 162 L76 104 Z" fill="#334155"/>
          <rect x="44" y="102" width="32" height="6" rx="2" fill="#1e293b"/>
          <!-- Zapatillas -->
          <path d="M40 162 L53 162 L54 169 C54 171 37 171 37 168 Z" fill="#e2e8f0"/>
          <path d="M67 162 L80 162 L83 168 C83 171 66 171 66 169 Z" fill="#e2e8f0"/>
          <rect x="37" y="168" width="17" height="2.5" rx="1" fill="#10b981"/>
          <rect x="66" y="168" width="17" height="2.5" rx="1" fill="#10b981"/>
          <!-- Brazos -->
          <path d="M38 56 C31 64 29 86 33 108 L41 108 C40 90 42 74 46 66 Z" fill="#f3c6a5"/>
          <path d="M82 56 C89 64 91 86 87 108 L79 108 C80 90 78 74 74 66 Z" fill="#f3c6a5"/>
          <!-- Camiseta atlética -->
          <path d="M40 50 C46 47 74 47 80 50 L87 68 L78 72 L75 63 L76 103 L44 103 L45 63 L42 72 L33 68 Z" fill="#34d399"/>
          <path d="M44 97 L76 97 L76 103 L44 103 Z" fill="#10b981"/>
          <!-- Cuello camiseta -->
          <path d="M52 49 Q60 55 68 49" stroke="#065f46" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- Cuello y Cabeza -->
        <rect x="54" y="42" width="12" height="9" rx="3" fill="#eab894"/>
        <ellipse cx="60" cy="28" rx="13.5" ry="15" fill="#f3c6a5"/>
        <!-- Cabello corto -->
        <path d="M46.5 26 C46 15 52 11 60 11 C68 11 74 15 73.5 26 C71 20 67 17.5 60 17.5 C53 17.5 49 20 46.5 26 Z" fill="#1e293b"/>
        <!-- Rasgos -->
        <circle cx="55" cy="28.5" r="1.5" fill="#0f172a"/>
        <circle cx="65" cy="28.5" r="1.5" fill="#0f172a"/>
        <path d="M56.5 34.5 Q60 37 63.5 34.5" stroke="#c07a5b" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    }

    // ==================== UTILIDADES NUEVAS (v3) ====================
    function escHtml(v) {
      return String(v === null || v === undefined ? '' : v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    const LS = {
      get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
      set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} },
      del(k) { try { window.localStorage.removeItem(k); } catch (e) {} }
    };
    const CLAVE_TOKEN = 'proc_sesion_v5';   // token de sesión (dura 7 días en el servidor)

    // ==================== v18 · ALMACÉN DEL TELÉFONO (Cache Storage) ====================
    // Para lo que pesa más que un texto corto: fotos de perfil, panel «Hoy», muro de récords, GIFs.
    // Todo lo del usuario se borra al cerrar sesión (CajaLocal.borrarDatosUsuario).
    const CAJA_FOTOS = 'procoaching-fotos-v1';     // miniaturas de fotos de PERFIL (no las de evaluación)
    const CAJA_VISTAS = 'procoaching-vistas-v1';   // últimas respuestas del panel del coach y del muro de récords
    const CAJA_GIFS = 'procoaching-gifs-v1';       // GIFs/imágenes de ejercicios (públicos, no son datos personales)
    const CajaLocal = {
      _url: k => new URL('__local/' + encodeURIComponent(k), location.href).href,
      async leer(caja, clave) {
        try { if (!window.caches) return null; const c = await caches.open(caja); const r = await c.match(this._url(clave)); return r ? await r.text() : null; }
        catch (e) { return null; }
      },
      async leerJSON(caja, clave) { const t = await this.leer(caja, clave); try { return t ? JSON.parse(t) : null; } catch (e) { return null; } },
      async guardar(caja, clave, texto) {
        try { if (!window.caches) return; const c = await caches.open(caja); await c.put(this._url(clave), new Response(String(texto), { headers: { 'Content-Type': 'text/plain' } })); }
        catch (e) {}
      },
      guardarJSON(caja, clave, obj) { return this.guardar(caja, clave, JSON.stringify(obj)); },
      async todas(caja) {   // { clave: texto } — para cargar las fotos guardadas al abrir
        const out = {};
        try {
          if (!window.caches) return out;
          const c = await caches.open(caja);
          for (const req of await c.keys()) {
            const k = decodeURIComponent(req.url.split('__local/').pop() || '');
            const r = await c.match(req); if (r) out[k] = await r.text();
          }
        } catch (e) {}
        return out;
      },
      async podar(caja, max) {   // si pasa del máximo, borra las más antiguas
        try {
          if (!window.caches) return;
          const c = await caches.open(caja), ks = await c.keys();
          if (ks.length > max) for (const k of ks.slice(0, ks.length - max)) await c.delete(k);
        } catch (e) {}
      },
      async borrar(caja) { try { if (window.caches) await caches.delete(caja); } catch (e) {} },
      borrarDatosUsuario() { this.borrar(CAJA_FOTOS); this.borrar(CAJA_VISTAS); }
    };

    // Fecha local (YYYY-MM-DD) SIN desfase de zona horaria (toISOString usa UTC y adelanta el día)
    function fechaLocalISO(d) {
      d = d || new Date();
      const p = n => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }

    // Semana ISO-8601 (lunes a domingo): misma lógica que el backend
    function infoSemana(fechaStr) {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaStr);
      const DIA = 86400000;
      const f = Date.UTC(+m[1], +m[2] - 1, +m[3]);
      const lunes = f - ((new Date(f).getUTCDay() + 6) % 7) * DIA;
      const jueves = lunes + 3 * DIA;
      const anio = new Date(jueves).getUTCFullYear();
      const numero = Math.floor((jueves - Date.UTC(anio, 0, 1)) / DIA / 7) + 1;
      const p = n => String(n).padStart(2, '0');
      const fmt = t => { const d = new Date(t); return p(d.getUTCDate()) + '/' + p(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear(); };
      return { semanaISO: anio + '-W' + p(numero), numero, anio, rango: fmt(lunes) + ' - ' + fmt(lunes + 6 * DIA) };
    }

    // ---- Avisos no bloqueantes ----
    // ==================== SILUETAS DE CARGA (v15) ====================
    // Muestran la forma de lo que viene mientras llegan los datos, en vez de un texto «Cargando...».
    function esqueleto(tipo = 'tarjetas', n = 3, texto = 'Cargando') {
      const b = (cls) => `<div class="bg-slate-800/70 rounded-lg animate-pulse ${cls}"></div>`;
      let cuerpo = '';
      if (tipo === 'lista') {
        cuerpo = Array.from({ length: n }, () => `<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div class="w-10 h-10 rounded-full bg-slate-800/70 animate-pulse shrink-0"></div>
            <div class="flex-1 space-y-2">${b('h-3 w-2/3')}${b('h-3 w-1/3')}</div></div>`).join('');
        cuerpo = `<div class="space-y-2">${cuerpo}</div>`;
      } else if (tipo === 'cuadricula') {
        cuerpo = `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 col-span-full w-full">${Array.from({ length: n }, () =>
          `<div class="rounded-2xl bg-slate-900 border border-slate-800 p-3 space-y-2">${b('aspect-square w-full rounded-xl')}${b('h-3 w-3/4')}${b('h-3 w-1/2')}</div>`).join('')}</div>`;
      } else if (tipo === 'texto') {
        cuerpo = `<div class="space-y-2.5">${b('h-3 w-full')}${b('h-3 w-11/12')}${b('h-3 w-4/5')}${b('h-3 w-2/3')}</div>`;
      } else {
        cuerpo = `<div class="space-y-3">${Array.from({ length: n }, (x, i) => `<div class="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
            <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-slate-800/70 animate-pulse shrink-0"></div>${b('h-4 w-1/2')}</div>
            ${b(i === 0 ? 'h-20 w-full' : 'h-12 w-full')}${b('h-3 w-2/3')}</div>`).join('')}</div>`;
      }
      return `<div role="status" aria-busy="true" class="w-full col-span-full"><span class="sr-only">${escHtml(texto)}…</span>${cuerpo}</div>`;
    }

    // v14: respeta la opción «reducir movimiento» del teléfono o computadora
    function movimientoReducido() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
    function modoScroll() { return movimientoReducido() ? 'auto' : 'smooth'; }

    // Emoji de estado al inicio de un mensaje → ícono y color del aviso (v14)
    const ICONO_ESTADO = [
      ['✅', 'circle-check', 'exito'], ['❌', 'circle-x', 'error'], ['⚠️', 'triangle-alert', 'atencion'], ['⚠', 'triangle-alert', 'atencion'],
      ['⏱️', 'timer', 'exito'], ['🔄', 'refresh-cw', 'info'], ['📶', 'wifi-off', 'atencion'], ['📥', 'download', 'exito'],
      ['🗑️', 'trash-2', 'info'], ['🏆', 'trophy', 'exito'], ['🔒', 'lock', 'info']
    ];
    const ESTILO_ESTADO = {
      exito: { ico: 'circle-check', color: 'text-emerald-300', borde: 'border-emerald-500/50', fondo: 'bg-emerald-500/15' },
      error: { ico: 'circle-x', color: 'text-rose-300', borde: 'border-rose-500/50', fondo: 'bg-rose-500/15' },
      atencion: { ico: 'triangle-alert', color: 'text-amber-300', borde: 'border-amber-500/50', fondo: 'bg-amber-500/15' },
      info: { ico: 'info', color: 'text-slate-200', borde: 'border-slate-600', fondo: 'bg-slate-700/40' }
    };
    function separarEstado(msg, tipo) {
      let texto = String(msg == null ? '' : msg).trim(), icono = '';
      for (const [e, n, t] of ICONO_ESTADO) {
        if (texto.startsWith(e)) { texto = texto.slice(e.length).trim(); icono = n; if (!tipo) tipo = t; break; }
      }
      tipo = tipo || 'info';
      return { texto, tipo, icono: icono || ESTILO_ESTADO[tipo].ico };
    }

    function mostrarToast(msg, opciones) {
      let t = document.getElementById('toastGlobal');
      if (!t) {
        t = document.createElement('div');
        t.id = 'toastGlobal';
        t.setAttribute('role', 'status');
        t.setAttribute('aria-live', 'polite');
        document.body.appendChild(t);
      }
      const e = separarEstado(msg, opciones && opciones.tipo);
      const st = ESTILO_ESTADO[e.tipo];
      t.className = `fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] max-w-[90vw] bg-slate-900 border ${st.borde} ${st.color} text-xs font-bold px-4 py-3 rounded-xl shadow-lg transition-opacity duration-300 flex items-center gap-2`;
      t.innerHTML = `${ico(e.icono, 'w-4 h-4 shrink-0')}<span>${escHtml(e.texto)}</span>` +
        (opciones && opciones.accion ? `<button class="ml-2 underline font-extrabold text-white min-h-[32px]">${escHtml(opciones.accion)}</button>` : '');
      if (opciones && opciones.accion) t.querySelector('button').onclick = () => { t.style.opacity = '0'; opciones.fn && opciones.fn(); };
      t.style.opacity = '1';
      clearTimeout(t._h);
      t._h = setTimeout(() => { t.style.opacity = '0'; }, (opciones && opciones.ms) || 4000);
    }

    // ==================== AVISOS PROPIOS (v14): reemplazan alert / confirm / prompt del navegador ====================
    // Devuelven una promesa. avisar → se cierra con «Entendido»; confirmar → true/false; preguntar → texto o null.
    const colaDialogos = [];
    let dialogoAbierto = false, mensajeAbierto = null;
    function abrirDialogo(cfg) {
      // Un mismo aviso repetido (p. ej. varios fallos de conexión seguidos) se muestra una sola vez
      if (cfg.modo === 'aviso' && (mensajeAbierto === cfg.mensaje || colaDialogos.some(x => x.cfg.modo === 'aviso' && x.cfg.mensaje === cfg.mensaje))) return Promise.resolve();
      return new Promise(resolve => { colaDialogos.push({ cfg, resolve }); if (!dialogoAbierto) siguienteDialogo(); });
    }
    function siguienteDialogo() {
      const item = colaDialogos.shift();
      if (!item) { dialogoAbierto = false; mensajeAbierto = null; return; }
      dialogoAbierto = true;
      mensajeAbierto = item.cfg.mensaje;
      const { cfg, resolve } = item;
      const e = separarEstado(cfg.mensaje, cfg.tipo);
      const st = ESTILO_ESTADO[e.tipo];
      const previo = document.activeElement;
      const capa = document.createElement('div');
      capa.className = 'fixed inset-0 z-[95] bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 dlg-capa';
      capa.innerHTML = `
        <div role="${cfg.modo === 'aviso' ? 'alertdialog' : 'dialog'}" aria-modal="true" aria-labelledby="dlgTitulo" aria-describedby="dlgTexto"
             class="dlg-caja w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl">
          <div class="flex items-start gap-3">
            <span class="w-10 h-10 shrink-0 rounded-full ${st.fondo} ${st.color} flex items-center justify-center">${ico(e.icono, 'w-5 h-5')}</span>
            <div class="min-w-0 flex-1">
              <h3 id="dlgTitulo" class="text-base font-extrabold text-white">${escHtml(cfg.titulo || { exito: 'Listo', error: 'No se pudo completar', atencion: 'Revisa esto', info: 'Aviso' }[e.tipo])}</h3>
              <p id="dlgTexto" class="text-sm text-slate-300 mt-1 whitespace-pre-line break-words">${escHtml(e.texto)}</p>
            </div>
          </div>
          ${cfg.modo === 'pregunta' ? `<label for="dlgEntrada" class="sr-only">${escHtml(e.texto)}</label>
            <input id="dlgEntrada" type="${cfg.tipoEntrada || 'text'}" maxlength="${cfg.max || 200}" value="${escHtml(cfg.valor || '')}" placeholder="${escHtml(cfg.placeholder || '')}"
              class="mt-4 w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-emerald-500">` : ''}
          <div class="flex gap-2 mt-5 ${cfg.modo === 'aviso' ? 'justify-end' : ''}">
            ${cfg.modo !== 'aviso' ? `<button data-r="no" class="flex-1 min-h-[44px] px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold">${escHtml(cfg.textoNo || 'Cancelar')}</button>` : ''}
            <button data-r="si" class="${cfg.modo === 'aviso' ? 'min-w-[120px]' : 'flex-1'} min-h-[44px] px-4 rounded-xl text-sm font-extrabold ${cfg.peligro ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-slate-950'}">${escHtml(cfg.textoSi || (cfg.modo === 'aviso' ? 'Entendido' : 'Aceptar'))}</button>
          </div>
        </div>`;
      document.body.appendChild(capa);
      const entrada = capa.querySelector('#dlgEntrada');
      const cerrar = (ok) => {
        document.removeEventListener('keydown', teclas, true);
        capa.remove();
        try { previo && previo.focus && previo.focus(); } catch (err) {}
        resolve(cfg.modo === 'aviso' ? undefined : cfg.modo === 'pregunta' ? (ok ? entrada.value : null) : ok);
        setTimeout(siguienteDialogo, 0);
      };
      const teclas = (ev) => {
        if (ev.key === 'Escape') { ev.preventDefault(); cerrar(cfg.modo === 'aviso'); }
        else if (ev.key === 'Enter' && (ev.target === entrada || cfg.modo !== 'pregunta')) { ev.preventDefault(); cerrar(true); }
        else if (ev.key === 'Tab') {                     // el foco no sale del aviso
          const f = [...capa.querySelectorAll('button, input')];
          const i = f.indexOf(document.activeElement);
          if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); }
          else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); }
        }
      };
      document.addEventListener('keydown', teclas, true);
      capa.querySelectorAll('button[data-r]').forEach(b => b.onclick = () => cerrar(b.dataset.r === 'si'));
      capa.addEventListener('click', ev => { if (ev.target === capa && cfg.modo !== 'aviso') cerrar(false); });
      setTimeout(() => { (entrada || capa.querySelector(cfg.peligro ? 'button[data-r="no"]' : 'button[data-r="si"]')).focus(); }, 30);
    }
    /** Aviso con botón «Entendido». tipo: 'exito' | 'error' | 'atencion' | 'info' (o un emoji ✅/❌/⚠️ al inicio del texto). */
    function avisar(mensaje, tipo, titulo) { return abrirDialogo({ modo: 'aviso', mensaje, tipo, titulo }); }
    /** Confirmación sí/no. opciones: { titulo, textoSi, textoNo, peligro } → Promise<boolean> */
    function confirmar(mensaje, opciones = {}) { return abrirDialogo(Object.assign({ modo: 'confirmar', mensaje, tipo: opciones.peligro ? 'atencion' : 'info' }, opciones)); }
    /** Pregunta con un campo de texto. opciones: { titulo, valor, placeholder, textoSi, max, tipoEntrada } → Promise<string|null> */
    function preguntar(mensaje, opciones = {}) { return abrirDialogo(Object.assign({ modo: 'pregunta', mensaje, tipo: 'info' }, opciones)); }

    // ---- Sonido del cronómetro ----
    // Android y los navegadores solo dejan sonar audio que nace de un toque del usuario. Por eso el
    // «parlante» se prepara al iniciar el cronómetro (un toque) y se reutiliza cuando termina.
    let audioCtxCronometro = null;
    function prepararAudio() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!audioCtxCronometro) audioCtxCronometro = new AC();
        if (audioCtxCronometro.state === 'suspended') audioCtxCronometro.resume();
      } catch (e) {}
    }
    function sonarAlarma() {
      try {
        prepararAudio();
        const ctx = audioCtxCronometro;
        if (!ctx) return;
        const t0 = ctx.currentTime + 0.05;
        // tres pitidos ascendentes, fuertes y claros
        [[880, 0], [988, 0.32], [1175, 0.64]].forEach(([frec, desde]) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'square'; o.frequency.value = frec;
          g.gain.setValueAtTime(0.0001, t0 + desde);
          g.gain.exponentialRampToValueAtTime(0.35, t0 + desde + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + desde + 0.26);
          o.connect(g); g.connect(ctx.destination);
          o.start(t0 + desde); o.stop(t0 + desde + 0.28);
        });
      } catch (e) {}
    }
    function avisarFinDescanso() {
      mostrarToast('⏱️ ¡Descanso terminado! A la siguiente serie.');
      try { if (navigator.vibrate) navigator.vibrate([400, 150, 400, 150, 400]); } catch (e) {}
      sonarAlarma();
    }

    // ---- Llamadas al servidor con manejo de errores (los botones ya no se quedan bloqueados) ----
    const TEXTO_BOTONES = {
      btnLogin: 'Ingresar al Sistema',
      btnCrearAlumno: 'Crear Alumno',
      btnGuardarEvaluacion: 'Guardar Evaluación y Subir Fotos',
      btnGuardarRutina: 'Guardar Rutina',
      btnAsignarPlantilla: ico('link') + ' Designar Rutina al Alumno',
      btnGuardarPerfil: 'Guardar Cambios de Perfil',
      btnGuardarPass: 'Actualizar Contraseña',
      btnDuplicar: 'Duplicar',
      btnEnviarCheckin: 'Enviar a mi coach'
    };

    function reactivarBotones() {
      Object.keys(TEXTO_BOTONES).forEach(id => {
        const b = document.getElementById(id);
        if (b && b.disabled) {
          b.disabled = false;
          b.innerHTML = (id === 'btnGuardarRutina' && estadoGlobal.edicionRutina)
            ? ico('save') + ' Guardar cambios'
            : TEXTO_BOTONES[id];
        }
      });
      if (estadoGlobal.progLocal) { estadoGlobal.progLocal.subiendo = false; actualizarEstadoSubida(); }
    }

    function manejarFalloGS(err) {
      console.error(err);
      reactivarBotones();
      avisar('No se pudo completar la operación (conexión o servidor). Revisa tu internet e inténtalo de nuevo.', 'error');
    }

    // El servidor marca con [SESION] los errores de sesión vencida o anulada
    function esErrorSesion(res) {
      return !!(res && res.success === false && /\[SESION\]/.test(String(res.error || '')));
    }
    function sesionExpirada() {
      if (!estadoGlobal.user) return;
      reactivarBotones();
      cerrarSesion(true);
      avisar('Tu sesión expiró o se cerró desde otro dispositivo. Vuelve a ingresar.', 'error');
    }
    // AHORA (Interceptor que inyecta automáticamente el token de sesión en cada petición):
function GS() {
  const Envolver = (runner) => new Proxy(runner, {
    get(target, prop) {
      if (prop === 'withSuccessHandler') {
        return (cb) => Envolver(target.withSuccessHandler(res => {
          if (esErrorSesion(res)) { sesionExpirada(); return; }
          cb(res);
        }));
      }
      if (prop === 'withFailureHandler') {
        return (cb) => Envolver(target.withFailureHandler(cb));
      }
      return (...args) => {
        const token = (estadoGlobal && estadoGlobal.user && estadoGlobal.user.token) || '';
        if (prop !== 'autenticarUsuario' && prop !== 'obtenerCatalogoEjercicios' && prop !== 'obtenerDetalleEjercicio') {
          args.push(token);
        }
        return target[prop](...args);
      };
    }
  });
  return Envolver(google.script.run.withFailureHandler(manejarFalloGS));
}

    // ==================== BIBLIOTECA DE EJERCICIOS (hasaneyldrm/exercises-dataset) ====================
    const CDN_EJ = 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/';
    const GRUPOS_ES = { 'shoulders':'HOMBROS','deltoids':'DELTOIDES','forearms':'ANTEBRAZOS','biceps':'BÍCEPS','triceps':'TRÍCEPS',
      'hamstrings':'FEMORALES','quadriceps':'CUÁDRICEPS','glutes':'GLÚTEOS','obliques':'OBLICUOS','hip flexors':'FLEX. DE CADERA',
      'chest':'PECHO','trapezius':'TRAPECIO','traps':'TRAPECIO','calves':'PANTORRILLAS','soleus':'SÓLEO','core':'CORE',
      'lower back':'LUMBAR','upper back':'ESPALDA ALTA','rhomboids':'ROMBOIDES','rotator cuff':'MANGUITO ROTADOR',
      'latissimus dorsi':'DORSAL','lats':'DORSAL','abdominals':'ABDOMEN','ankles':'TOBILLOS','ankle stabilizers':'TOBILLOS',
      'wrists':'MUÑECAS','wrist flexors':'MUÑECAS','wrist extensors':'MUÑECAS','hands':'MANOS' };
    const ZONAS_ES = { 'upper arms':'BRAZOS','lower arms':'ANTEBRAZOS','upper legs':'PIERNAS','lower legs':'PANTORRILLAS',
      'back':'ESPALDA','waist':'CORE / ABDOMEN','chest':'PECHO','shoulders':'HOMBROS','cardio':'CARDIO','neck':'CUELLO' };
    const EQUIPOS_ES = { 'body weight':'PESO CORPORAL','dumbbell':'MANCUERNA','barbell':'BARRA','cable':'POLEA',
      'leverage machine':'MÁQUINA','smith machine':'MÁQUINA SMITH','band':'BANDA','kettlebell':'KETTLEBELL','weighted':'CON LASTRE',
      'stability ball':'BALÓN','ez barbell':'BARRA Z','assisted':'ASISTIDO','sled machine':'PRENSA / SLED','medicine ball':'BALÓN MEDICINAL',
      'rope':'CUERDA','bosu ball':'BOSU','wheel roller':'RUEDA ABDOMINAL','skierg machine':'SKIERG','hammer':'MARTILLO',
      'trap bar':'BARRA HEXAGONAL','olympic barbell':'BARRA OLÍMPICA','tire':'LLANTA','roller':'RODILLO','resistance band':'BANDA',
      'stationary bike':'BICICLETA','elliptical machine':'ELÍPTICA','stepmill machine':'ESCALADORA','upper body ergometer':'ERGÓMETRO' };
    const trCat = (mapa, clave) => mapa[String(clave || '').toLowerCase()] || String(clave || '').toUpperCase();
    const normBusq = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const urlGif = media => media ? CDN_EJ + 'videos/' + media + '.gif' : '';
    const urlMini = media => media ? CDN_EJ + 'images/' + media + '.jpg' : '';
    const esCoach = () => !!(estadoGlobal.user && estadoGlobal.user.rol === 'COACH');

    // ---- Rutina (alumno y vista del coach): GIF grande siempre visible + botón de ayuda ----
    // El GIF se muestra a su tamaño original (180 px): sin estirarlo se ve nítido. Al tocarlo se abre en grande.
    function gifEj(r) {
      if (!r || !r.media) return '';
      const datos = `data-id="${escHtml(r.idEjercicio)}" data-nombre="${escHtml(r.ejercicio)}" data-media="${escHtml(r.media)}"
              onclick="abrirModalEjercicio(this.dataset.id, this.dataset.nombre, this.dataset.media)"`;
      return `
        <div class="my-3 flex flex-col items-center gap-2">
          <button type="button" ${datos} title="Toca para ver en grande"
            class="block bg-white rounded-2xl border border-slate-700 shadow-lg p-2 cursor-zoom-in active:scale-[0.98] transition">
            <img src="${urlMini(r.media)}" data-gif="${urlGif(r.media)}" data-jpg="${urlMini(r.media)}" width="180" height="180"
              loading="lazy" decoding="async" alt="Demostración: ${escHtml(r.ejercicio)}" class="gif-inteligente gif-nativo block object-contain">
          </button>
          <button type="button" ${datos}
            class="bg-slate-950 text-sky-300 border border-sky-500/60 rounded-xl px-3 py-2 text-xs font-extrabold active:scale-95 transition">${ico('circle-help', 'w-4 h-4')} Cómo se hace · ver en grande</button>
        </div>`;
    }
    // Solo se anima el GIF que está en pantalla; fuera de pantalla vuelve a JPG (libera CPU y RAM del celular)
    let observadorGifs = null;
    function activarGifsEnPantalla() {
      if (observadorGifs) observadorGifs.disconnect();
      const imgs = document.querySelectorAll('.gif-inteligente');
      if (!imgs.length) return;
      if (!('IntersectionObserver' in window)) { imgs.forEach(i => { i.src =
    i.dataset.gif; }); return; }
      observadorGifs = new IntersectionObserver(entradas => {
        entradas.forEach(ent => {
          const img = ent.target, destino = ent.isIntersecting ?
    img.dataset.gif : img.dataset.jpg;
          if (img.getAttribute('src') !== destino) img.src = destino;
        });
      }, { rootMargin: '120px 0px' });
      imgs.forEach(i => observadorGifs.observe(i));
}

// Nombre en inglés bajo el nombre en español
    function chipTecnica(r) {
      if (!r || !r.idEjercicio) return '';
      const en = r.nombreEn && normBusq(r.nombreEn) !== normBusq(r.ejercicio)
        ? `<p class="text-xs text-sky-300/90 italic font-semibold mt-0.5">EN · ${escHtml(r.nombreEn)}</p>` : '';
      const ayuda = !r.media ? `<button data-id="${escHtml(r.idEjercicio)}" data-nombre="${escHtml(r.ejercicio)}" data-media=""
        onclick="abrirModalEjercicio(this.dataset.id, this.dataset.nombre, this.dataset.media)"
        class="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/30">${ico('circle-help', 'w-4 h-4')} Cómo se hace</button>` : '';
      return en + ayuda;
    }
    function miniEj() { return ''; }        // reemplazado por gifEj (se mantiene por compatibilidad)
    function btnTecnicaMini() { return ''; }

    // ---- Catálogo ----
    function cargarCatalogo(cb) {
      if (estadoGlobal.catalogo && estadoGlobal.catalogo.length) { if (cb) cb(); return; }
      const grid = document.getElementById('gridCatalogo');
      if (grid) grid.innerHTML = esqueleto('cuadricula', 8, 'Cargando biblioteca');
      GS().withSuccessHandler(res => {
        if (!res || !res.success) {
          if (grid) grid.innerHTML = `<p class="col-span-full text-rose-400 text-sm p-6 text-center">${escHtml((res && res.error) || 'No se pudo cargar la biblioteca.')}</p>`;
          return;
        }
        estadoGlobal.catalogo = res.items.map(a => ({
          id: String(a[0]), nombre: String(a[1]), grupo: String(a[2]), target: String(a[3]),
          zona: String(a[4]), equipo: String(a[5]), media: String(a[6]), nombreEs: String(a[7] || '')
        }));
        if (cb) cb();
      }).obtenerCatalogoEjercicios();
    }
    const nombreEsDe = e => (e.nombreEs || e.nombre).toUpperCase();

    let filaCatalogoDestino = null;     // tarjeta del constructor a reemplazar (null = crear una nueva)
    let limiteCatalogo = 40;
    function abrirCatalogo(destino) {
      filaCatalogoDestino = destino || null;
      document.getElementById('modalCatalogo').classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      cargarCatalogo(() => { poblarFiltrosCatalogo(); reiniciarCatalogo(); });
    }
    function abrirCatalogoParaFila(btn) { abrirCatalogo(btn.closest('.fila-rutina')); }
    function cerrarModalCatalogo() {
      document.getElementById('modalCatalogo').classList.add('hidden');
      document.body.style.overflow = '';
      filaCatalogoDestino = null;
    }

    function poblarFiltrosCatalogo() {
      const selZona = document.getElementById('catFiltroZona');
      if (!selZona || selZona.options.length > 1) return;
      const zonas = [...new Set(estadoGlobal.catalogo.map(e => e.zona).filter(Boolean))];
      const op = (v, m) => `<option value="${escHtml(v)}">${escHtml(trCat(m, v))}</option>`;
      selZona.innerHTML = '<option value="">Todas las zonas</option>' +
        zonas.sort((a, b) => trCat(ZONAS_ES, a).localeCompare(trCat(ZONAS_ES, b))).map(z => op(z, ZONAS_ES)).join('');
    }

    // Deja en el selector de equipo SOLO el equipo que existe para lo que el coach
    // está buscando (grupo muscular escrito y/o zona elegida). Si lo que tenía
    // seleccionado ya no aplica, lo limpia y vuelve a "Todo el equipo".
    function refrescarEquipoDisponible(base) {
      const selEq = document.getElementById('catFiltroEquipo');
      if (!selEq) return '';
      const equipos = [...new Set(base.map(e => e.equipo).filter(Boolean))]
        .sort((a, b) => trCat(EQUIPOS_ES, a).localeCompare(trCat(EQUIPOS_ES, b)));
      const previo = selEq.value;
      const sigue = equipos.indexOf(previo) !== -1 ? previo : '';
      const firma = equipos.join('|');
      if (selEq.dataset.firma !== firma) {
        selEq.dataset.firma = firma;
        const cuenta = eq => base.reduce((n, e) => n + (e.equipo === eq ? 1 : 0), 0);
        selEq.innerHTML = '<option value="">Todo el equipo' + (equipos.length ? ' (' + equipos.length + ')' : '') + '</option>' +
          equipos.map(eq => `<option value="${escHtml(eq)}">${escHtml(trCat(EQUIPOS_ES, eq))} · ${cuenta(eq)}</option>`).join('');
        selEq.disabled = equipos.length === 0;
      }
      if (selEq.value !== sigue) selEq.value = sigue;
      return sigue;
    }

    function reiniciarCatalogo() {
      limiteCatalogo = 40;
      const sc = document.getElementById('scrollCatalogo'); if (sc) sc.scrollTop = 0;
      renderCatalogo();
    }
    function masCatalogo() { limiteCatalogo += 40; renderCatalogo(); }

    function renderCatalogo() {
      const grid = document.getElementById('gridCatalogo');
      if (!grid || !estadoGlobal.catalogo.length) return;
      const q = normBusq(document.getElementById('catBuscar').value.trim());
      const zona = document.getElementById('catFiltroZona').value;
      // 1) Filtro por texto + zona: define qué ejercicios están en juego.
      const base = estadoGlobal.catalogo.filter(e => {
        if (zona && e.zona !== zona) return false;
        if (!q) return true;
        return normBusq([e.nombre, e.nombreEs, trCat(GRUPOS_ES, e.grupo), e.grupo, e.target, trCat(EQUIPOS_ES, e.equipo)].join(' ')).includes(q);
      });
      // 2) El selector de equipo solo ofrece el equipo que esos ejercicios usan.
      const eq = refrescarEquipoDisponible(base);
      const filtrados = eq ? base.filter(e => e.equipo === eq) : base;
      const visibles = filtrados.slice(0, limiteCatalogo);
      document.getElementById('catContador').innerText = filtrados.length + ' ejercicio' + (filtrados.length === 1 ? '' : 's') +
        (filtrados.length > visibles.length ? ' · mostrando ' + visibles.length : '');
      document.getElementById('catMasCont').classList.toggle('hidden', filtrados.length <= visibles.length);
      if (!visibles.length) {
        grid.innerHTML = '<p class="col-span-full text-slate-400 text-sm p-6 text-center">Sin resultados. Prueba con otro nombre, zona o equipo.</p>';
        return;
      }
      grid.innerHTML = visibles.map(e => `
        <div onclick="elegirEjercicioCatalogo('${escHtml(e.id)}')" class="bg-slate-950 border border-slate-800 hover:border-sky-500/70 active:border-sky-400 rounded-xl overflow-hidden cursor-pointer transition shadow-md">
          <div class="relative w-full bg-white" style="aspect-ratio:1/1">
            <img src="${urlMini(e.media)}" loading="lazy" decoding="async" alt="" class="w-full h-full object-contain p-1">
            <button data-id="${escHtml(e.id)}" data-nombre="${escHtml(nombreEsDe(e))}" data-media="${escHtml(e.media)}"
              onclick="event.stopPropagation(); abrirModalEjercicio(this.dataset.id, this.dataset.nombre, this.dataset.media)"
              class="absolute top-1.5 right-1.5 w-8 h-8 bg-slate-950/90 border border-sky-500/60 text-sky-300 rounded-full text-sm font-black" title="Cómo se hace">${ico('circle-help', 'w-4 h-4')}</button>
          </div>
          <div class="p-2">
            <p class="text-xs font-extrabold text-white leading-tight uppercase">${escHtml(nombreEsDe(e))}</p>
            <p class="text-[11px] text-sky-300/90 italic leading-tight mt-0.5">EN · ${escHtml(e.nombre)}</p>
            <p class="text-[11px] text-slate-400 font-semibold mt-1 uppercase tracking-wide">${escHtml(trCat(GRUPOS_ES, e.grupo))} · ${escHtml(trCat(EQUIPOS_ES, e.equipo))}</p>
          </div>
        </div>`).join('');
    }

    function elegirEjercicioCatalogo(id) {
      const e = estadoGlobal.catalogo.find(x => x.id === id);
      if (!e) { cerrarModalCatalogo(); return; }
      if (typeof filaCatalogoDestino === 'function') {   // modo «elegir»: por ejemplo, ejercicios del ranking
        const alElegir = filaCatalogoDestino;
        cerrarModalCatalogo();
        alElegir(e);
        return;
      }
      const card = filaCatalogoDestino || crearTarjetaConstructor();
      llenarTarjetaConEjercicio(card, e);
      mostrarToast('✅ ' + nombreEsDe(e) + ' agregado');
      cerrarModalCatalogo();
      setTimeout(() => card.scrollIntoView({ behavior: modoScroll(), block: 'center' }), 150);
    }

    // ---- Modal "Cómo se hace" ----
    let ejercicioModalId = null;
    const cacheDetalleEj = {};   // detalle ya traído del servidor: evita volver a pedirlo
    function abrirModalEjercicio(id, nombre, media) {
      if (!id) return;
      ejercicioModalId = id;
      const modal = document.getElementById('modalEjercicio');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      document.getElementById('ejNombre').innerText = nombre || 'EJERCICIO';
      document.getElementById('ejNombreEn').textContent = '';
      document.getElementById('ejEditarEs').classList.add('hidden');
      const gif = document.getElementById('ejGif');
      gif.src = urlGif(media);
      document.getElementById('ejChips').innerHTML = '';
      document.getElementById('ejInstr').innerHTML = esqueleto('texto', 1, 'Cargando instrucciones');
      if (cacheDetalleEj[id]) { pintarDetalleEjercicio(id, nombre, media, cacheDetalleEj[id]); return; }
      GS().withSuccessHandler(d => {
        if (!d || !d.success) {
          if (ejercicioModalId === id) document.getElementById('ejInstr').innerHTML = `<p class="text-rose-400 text-sm">${escHtml((d && d.error) || 'No se pudo cargar el detalle.')}</p>`;
          return;
        }
        cacheDetalleEj[id] = d;
        if (ejercicioModalId !== id) return;
        pintarDetalleEjercicio(id, nombre, media, d);
      }).obtenerDetalleEjercicio(id);
    }

    function pintarDetalleEjercicio(id, nombre, media, d) {
      {
        const gif = document.getElementById('ejGif');
        if (!media && d.media) gif.src = urlGif(d.media);
        if (!nombre) document.getElementById('ejNombre').innerText = (d.nombreEs || d.nombre).toUpperCase();
        document.getElementById('ejNombreEn').textContent = 'EN · ' + d.nombre;
        if (esCoach()) {
          document.getElementById('ejInputEs').value = (d.nombreEs || '').toUpperCase();
          document.getElementById('ejEditarEs').classList.remove('hidden');
        }
        const chip = (txt, cls, icono) => `<span class="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-1 rounded-md border ${cls}">${icono ? ico(icono, 'w-3.5 h-3.5') : ''}${escHtml(txt)}</span>`;
        document.getElementById('ejChips').innerHTML =
          chip(trCat(GRUPOS_ES, d.grupo), 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', 'target') +
          chip(trCat(ZONAS_ES, d.zona), 'bg-purple-500/10 text-purple-300 border-purple-500/30', 'map-pin') +
          chip(trCat(EQUIPOS_ES, d.equipo), 'bg-sky-500/10 text-sky-300 border-sky-500/30', 'dumbbell');
        document.getElementById('ejInstr').innerHTML = d.pasos && d.pasos.length
          ? '<ol class="list-decimal pl-5 space-y-2 text-sm text-slate-200 leading-relaxed">' + d.pasos.map(p => `<li>${escHtml(p)}</li>`).join('') + '</ol>'
          : '<p class="text-slate-400 text-sm">Este ejercicio no tiene instrucciones registradas.</p>';
      }
    }

    // Trae por adelantado el detalle de los ejercicios del día: al tocar «Cómo se hace» ya está listo
    function precargarDetallesDia() {
      const ids = [...new Set((estadoGlobal.rutinaActual || [])
        .filter(r => normalizarDia(r.dia) === normalizarDia(estadoGlobal.diaSeleccionado) && r.idEjercicio)
        .map(r => String(r.idEjercicio)))].filter(id => !cacheDetalleEj[id]);
      if (!ids.length) return;
      GS().withSuccessHandler(res => {
        if (res && res.success && res.items) Object.keys(res.items).forEach(k => { cacheDetalleEj[k] = res.items[k]; });
      }).obtenerDetallesEjercicios(ids);
    }

    function cerrarModalEjercicio() {
      document.getElementById('modalEjercicio').classList.add('hidden');
      document.getElementById('ejGif').src = '';
      if (document.getElementById('modalCatalogo').classList.contains('hidden')) document.body.style.overflow = '';
      ejercicioModalId = null;
    }
    function guardarNombreEs() {
      const id = ejercicioModalId;
      const valor = document.getElementById('ejInputEs').value.trim().toUpperCase();
      if (!id || !valor) return;
      const btn = document.getElementById('btnGuardarNombreEs');
      btn.disabled = true; btn.innerText = '...';
      GS().withSuccessHandler(res => {
        btn.disabled = false; btn.innerText = 'Guardar';
        if (!res || !res.success) { avisar((res && res.error) || 'No se pudo guardar.', 'error'); return; }
        const e = estadoGlobal.catalogo.find(x => x.id === id);
        if (e) e.nombreEs = res.nombreEs;
        document.getElementById('ejNombre').innerText = res.nombreEs.toUpperCase();
        if (!document.getElementById('modalCatalogo').classList.contains('hidden')) renderCatalogo();
        mostrarToast('✅ ' + res.mensaje);
      }).actualizarNombreEsEjercicio(id, valor);
    }


    // ==================== PROGRESO SEMANAL ====================
    // Los pesos y ejercicios marcados se guardan por SEMANA ISO (no por fecha). Se conservan en el
    // dispositivo hasta que el alumno los sube; al subirlos quedan en PROGRESO_SEMANAL.
    function claveStorageProg(p) { return 'proseg_' + (estadoGlobal.user ? estadoGlobal.user.id : 'X') + '_' + p.semanaISO; }

    function datosServidorSemana(semanaISO) {
      const s = (estadoGlobal.semanas || []).find(x => x.semanaISO === semanaISO);
      const datos = {};
      if (s) s.registros.forEach(r => { datos[r.dia + '|' + r.clave] = r.valor; });
      return { datos, ts: s ? s.ts : null };
    }

    function inicializarProgresoLocal() {
      const sem = infoSemana(fechaLocalISO());
      const srv = datosServidorSemana(sem.semanaISO);
      let local = null;
      try { local = JSON.parse(LS.get('proseg_' + estadoGlobal.user.id + '_' + sem.semanaISO) || 'null'); } catch (e) {}
      const hayLocal = !!(local && local.dirty && local.datos);
      // B12: lo local solo gana si es MÁS NUEVO que lo ya subido desde otro dispositivo
      const localGana = hayLocal && (!srv.ts || !local.ts || String(local.ts) > String(srv.ts));
      estadoGlobal.progLocal = {
        semanaISO: sem.semanaISO, numero: sem.numero, rango: sem.rango,
        datos: localGana ? Object.assign({}, srv.datos, local.datos) : Object.assign({}, srv.datos),
        dirty: localGana, enviado: srv.ts, soloLectura: false, subiendo: false
      };
    }

    function inicializarProgresoCoach() {
      const sem = infoSemana(fechaLocalISO());
      const srv = datosServidorSemana(sem.semanaISO);
      estadoGlobal.progLocal = {
        semanaISO: sem.semanaISO, numero: sem.numero, rango: sem.rango,
        datos: srv.datos, dirty: false, enviado: srv.ts, soloLectura: true, subiendo: false
      };
    }

    function asegurarSemanaLocal() {
      const p = estadoGlobal.progLocal;
      if (!p || p.soloLectura || !estadoGlobal.user) return p;
      if (infoSemana(fechaLocalISO()).semanaISO !== p.semanaISO) inicializarProgresoLocal();   // cambió la semana con la app abierta
      return estadoGlobal.progLocal;
    }

    function leerProg(k) {
      const p = asegurarSemanaLocal();
      if (!p) return null;
      const v = p.datos[k];
      return (v === undefined || v === null || v === '') ? null : String(v);
    }

    function escribirProg(k, v) {
      const p = asegurarSemanaLocal();
      if (!p) return;
      if (p.soloLectura) { mostrarToast('Solo el alumno puede registrar su progreso.'); return; }
      const val = String(v === null || v === undefined ? '' : v).slice(0, 40);
      if (val === '' || val === 'false') delete p.datos[k]; else p.datos[k] = val;
      p.dirty = true;
      if (/_ok$/.test(k) && typeof registrarMarcaHoy === 'function') registrarMarcaHoy(k, val === 'true');
      LS.set(claveStorageProg(p), JSON.stringify({ dirty: true, ts: new Date().toISOString(), datos: p.datos }));
      actualizarEstadoSubida();
      if (!document.getElementById('vista-alumno-INICIO').classList.contains('hidden')) renderPanelHoy();
    }

    // Clave estable por ejercicio (permite comparar semanas aunque cambie el orden de la rutina)
    function basesEjerciciosDia(ejercicios) {
      const usados = {};
      return ejercicios.map(r => {
        const b = normalizarDia(r.ejercicio).replace(/[^A-Z0-9 ]/g, '').trim().replace(/\s+/g, '_') || 'EJERCICIO';
        usados[b] = (usados[b] || 0) + 1;
        return usados[b] > 1 ? b + '~' + usados[b] : b;
      });
    }

    /** Cuántos ejercicios de la rutina tienen TODAS sus series marcadas esta semana. */
    function ejerciciosCompletosSemana() {
      const rutina = estadoGlobal.rutinaActual || [];
      let total = 0;
      DIAS_SEMANA.forEach(dia => {
        const diaNorm = normalizarDia(dia);
        const ejs = rutina.filter(r => normalizarDia(r.dia) === diaNorm);
        const bases = basesEjerciciosDia(ejs);
        ejs.forEach((r, i) => { if (estadoEjercicioSemana(diaNorm, bases[i], r).completo) total++; });
      });
      return total;
    }

    function actualizarEstadoSubida() {
      const el = document.getElementById('barraSemanal');
      const p = estadoGlobal.progLocal;
      if (!el || !p) return;
      const fmt = ts => { try { return new Date(ts).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ts; } };
      const n = Object.keys(p.datos).length;
      let estado, clase;
      if (p.soloLectura) { estado = p.enviado ? 'Última subida del alumno: ' + fmt(p.enviado) : 'El alumno aún no subió esta semana'; clase = 'text-slate-400'; }
      else if (p.dirty) { estado = '' + ico('triangle-alert', 'w-4 h-4') + ' Tienes cambios sin subir'; clase = 'text-amber-400'; }
      else if (p.enviado) { estado = '' + ico('circle-check', 'w-4 h-4') + ' Subido el ' + fmt(p.enviado); clase = 'text-emerald-400'; }
      else { estado = 'Aún no subes esta semana'; clase = 'text-slate-400'; }
      // El botón aparece solo si hay al menos UN ejercicio con todas sus series completas y algo sin subir
      const completos = p.soloLectura ? 0 : ejerciciosCompletosSemana();
      const puedeSubir = !p.soloLectura && (p.subiendo || (p.dirty && completos > 0));
      if (!p.soloLectura && p.dirty && completos === 0) { estado = 'Completa al menos un ejercicio (todas sus series ✓) para subir tu semana'; clase = 'text-slate-400'; }
      const boton = !puedeSubir ? '' :
        `<button id="btnSubirSemana" onclick="subirProgresoSemanal()" ${p.subiendo ? 'disabled' : ''} class="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition">${p.subiendo ? 'Subiendo...' : '' + ico('upload', 'w-4 h-4') + ' Subir progreso semanal'}</button>`;
      el.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div>
            <p class="text-xs font-extrabold text-white">Semana ${p.numero} · ${escHtml(p.rango)}</p>
            <p class="text-xs ${clase}">${estado} · ${n} registro${n === 1 ? '' : 's'}</p>
          </div>
          ${boton}
        </div>`;
    }

    function subirProgresoSemanal() {
      const p = asegurarSemanaLocal();
      if (!p || p.soloLectura || p.subiendo) return;
      const registros = Object.keys(p.datos).map(k => {
        const i = k.indexOf('|');
        return { dia: k.slice(0, i), clave: k.slice(i + 1), valor: p.datos[k] };
      });
      if (!registros.length) return avisar('Aún no registraste pesos ni marcaste ejercicios esta semana.', 'atencion');
      if (!ejerciciosCompletosSemana()) return avisar('Completa al menos un ejercicio (todas sus series ✓) antes de subir tu semana.', 'atencion');
      p.subiendo = true;
      actualizarEstadoSubida();
      GS().withSuccessHandler(res => {
        p.subiendo = false;
        if (!res || !res.success) { actualizarEstadoSubida(); return avisar((res && res.error) || 'No se pudo subir el progreso.', 'error'); }
        p.dirty = false;
        p.enviado = res.semana.ts;
        LS.set(claveStorageProg(p), JSON.stringify({ dirty: false, datos: p.datos }));
        const lista = (estadoGlobal.semanas || []).filter(s => s.semanaISO !== res.semana.semanaISO);
        lista.push(res.semana);
        lista.sort((a, b) => (a.semanaISO < b.semanaISO ? -1 : 1));
        estadoGlobal.semanas = lista;
        actualizarEstadoSubida();
        renderComparadorSemanas();
        mostrarToast('✅ ' + res.mensaje);
      }).guardarProgresoSemanal({ idAlumno: estadoGlobal.user.id, fechaRef: fechaLocalISO(), registros });
    }

    // ==================== COMPARATIVA SEMANA vs SEMANA ====================
    function ordenDia(d) { return DIAS_SEMANA.findIndex(x => normalizarDia(x) === normalizarDia(d)); }
    function nombreDia(d) { return DIAS_SEMANA.find(x => normalizarDia(x) === normalizarDia(d)) || d; }
    // La clave guardada es "DIA|EJERCICIO::campo", así que recorto todo lo que va
    // antes del último "|" para no repetir el día dentro del nombre del ejercicio.
    function nombreEjercicio(base) {
      const s = String(base);
      return s.slice(s.lastIndexOf('|') + 1).replace(/~\d+$/, '').replace(/_/g, ' ');
    }

    function agruparSemana(semana) {
      const m = {};
      ((semana && semana.registros) || []).forEach(r => {
        const i = r.clave.indexOf('::');
        if (i < 0) return;
        const base = r.clave.slice(0, i), campo = r.clave.slice(i + 2), k = r.dia + '|' + base;
        const o = m[k] || (m[k] = { dia: r.dia, base, carga: '', ok: false, cargas: {}, series: {}, seriesOk: {} });
        if (campo === 'carga') o.carga = r.valor;
        else if (campo === 'ok') o.ok = r.valor === 'true';
        else {
          const mm = /^carga_d(\d+)$/.exec(campo);
          const ms = /^s(\d+)_peso$/.exec(campo);
          const mo = /^s(\d+)_ok$/.exec(campo);
          if (mm) o.cargas[+mm[1]] = r.valor;
          else if (ms) o.series[+ms[1]] = r.valor;
          else if (mo && r.valor === 'true') o.seriesOk[+mo[1]] = true;
        }
      });
      return m;
    }
    function textoCarga(o) {
      if (!o) return '—';
      const drops = Object.keys(o.cargas).sort((a, b) => a - b).map(k => o.cargas[k]);
      return (drops.length ? drops.join(' → ') : o.carga) || (o.ok ? 'Completado' : '—');
    }
    // El peso que representa la semana es la SERIE MÁS PESADA del ejercicio.
    function valorNumerico(o) {
      if (!o) return null;
      const fuentes = Object.keys(o.series || {}).map(k => o.series[k])
        .concat(Object.keys(o.cargas || {}).map(k => o.cargas[k]));
      if (o.carga) fuentes.push(o.carga);
      const nums = fuentes.map(v => parseFloat(String(v).replace(',', '.'))).filter(n => !isNaN(n));
      return nums.length ? Math.max.apply(null, nums) : null;
    }
    /** "82.5 kg" para la tarjeta comparativa. */
    function textoPeso(o) {
      const n = valorNumerico(o);
      if (n !== null) return (Math.round(n * 100) / 100) + ' kg';
      return (o && o.ok) ? 'Completado' : '—';
    }
    /** ¿Terminó ese ejercicio esa semana? (marca de ejercicio o todas sus series) */
    function ejercicioHecho(o) {
      if (!o) return false;
      if (o.ok) return true;
      const nS = Object.keys(o.series || {}).length;
      return nS > 0 && Object.keys(o.seriesOk || {}).length >= nS;
    }

    function renderComparadorSemanas() {
      const cont = document.getElementById('contSemanal');
      if (!cont) return;
      const semanas = (estadoGlobal.semanas || []).slice().sort((a, b) => (a.semanaISO < b.semanaISO ? -1 : 1));
      if (!semanas.length) {
        cont.innerHTML = '<div class="p-6 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-sm">Todavía no hay progreso semanal subido. Cuando el alumno suba su primera semana, aparecerá aquí.</div>';
        return;
      }
      const prev = id => (document.getElementById(id) || {}).value;
      const desc = semanas.slice().reverse();
      const existe = v => desc.some(s => s.semanaISO === v);
      const selB = existe(prev('selSemB')) ? prev('selSemB') : desc[0].semanaISO;
      const selA = existe(prev('selSemA')) ? prev('selSemA') : (desc[1] || desc[0]).semanaISO;
      const selD = prev('selSemDia') || 'TODOS';
      const opts = sel => desc.map(s => `<option value="${escHtml(s.semanaISO)}" ${s.semanaISO === sel ? 'selected' : ''}>Semana ${s.numero} (${s.anio}) · ${escHtml(s.rango)}</option>`).join('');
      const optsDia = '<option value="TODOS">Todos los días</option>' +
        DIAS_SEMANA.map(d => `<option value="${normalizarDia(d)}" ${normalizarDia(d) === selD ? 'selected' : ''}>${d}</option>`).join('');
      const fmtTs = ts => { try { return new Date(ts).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
      const cls = 'w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400';
      const lbl = 'block text-xs text-slate-400 mb-1';

      cont.innerHTML = `
        <div class="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h4 class="text-sm sm:text-base font-bold text-emerald-400 uppercase tracking-wider">${ico('calendar', 'w-4 h-4')} Comparativa por semanas</h4>
            <p class="text-xs text-slate-400">Elige dos semanas del calendario para ver cómo cambió cada carga.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><label class="${lbl}">Semana A (base)</label><select id="selSemA" onchange="actualizarTablaSemanas()" class="${cls}">${opts(selA)}</select></div>
            <div><label class="${lbl}">Semana B (comparar)</label><select id="selSemB" onchange="actualizarTablaSemanas()" class="${cls}">${opts(selB)}</select></div>
            <div><label class="${lbl}">Día de rutina</label><select id="selSemDia" onchange="actualizarTablaSemanas()" class="${cls}">${optsDia}</select></div>
          </div>
          <div id="resumenSemanas" class="grid grid-cols-1 sm:grid-cols-3 gap-3"></div>
          <div id="tablaSemanas"></div>
          <div id="zonaReporteAlumno"></div>
          <details class="bg-slate-950 border border-slate-800 rounded-xl">
            <summary class="p-3 text-xs font-bold text-slate-300 cursor-pointer">Semanas subidas (${semanas.length})</summary>
            <ul class="px-3 pb-3 text-xs text-slate-400 space-y-1">
              ${desc.map(s => `<li class="flex justify-between gap-2"><span class="text-emerald-400 font-bold">Semana ${s.numero} · ${escHtml(s.rango)}</span><span>${s.registros.length} registros · ${escHtml(fmtTs(s.ts))}</span></li>`).join('')}
            </ul>
          </details>
        </div>`;
      actualizarTablaSemanas();
      // El alumno genera su propio reporte desde aquí; el coach ya lo tiene en el expediente.
      const zona = document.getElementById('zonaReporteAlumno');
      if (zona && !esCoach() && estadoGlobal.user && estadoGlobal.user.id) {
        zona.innerHTML = bloqueReportePDF(estadoGlobal.user.id, false);
      }
    }

    function actualizarTablaSemanas() {
      const eA = document.getElementById('selSemA'), eB = document.getElementById('selSemB'), eD = document.getElementById('selSemDia');
      if (!eA || !eB || !eD) return;
      const semanas = estadoGlobal.semanas || [];
      const sA = semanas.find(s => s.semanaISO === eA.value), sB = semanas.find(s => s.semanaISO === eB.value);
      const gA = agruparSemana(sA), gB = agruparSemana(sB);
      const filtro = eD.value;
      const diaDe = k => (gA[k] || gB[k]).dia;
      // El orden de las claves es el orden en que el alumno registró la rutina,
      // así las tarjetas salen como el ejercicio aparece en el día, no alfabéticas.
      const ordenReg = {};
      Object.keys(gB).concat(Object.keys(gA)).forEach((k, i) => { if (ordenReg[k] === undefined) ordenReg[k] = i; });
      const claves = Array.from(new Set(Object.keys(gA).concat(Object.keys(gB))))
        .filter(k => filtro === 'TODOS' || normalizarDia(diaDe(k)) === filtro)
        .sort((x, y) => (ordenDia(diaDe(x)) - ordenDia(diaDe(y))) || (ordenReg[x] - ordenReg[y]));

      const pcts = [];
      const etiq = s => 'Sem. ' + (s ? s.numero : '-') + (s && s.rango ? ' · ' + String(s.rango).slice(0, 5) : '');
      const etA = etiq(sA), etB = etiq(sB);
      const filas = claves.map(k => {
        const oA = gA[k], oB = gB[k], o = oA || oB;
        const nA = valorNumerico(oA), nB = valorNumerico(oB);
        const pill = 'text-[11px] font-black px-2 py-0.5 rounded-full border whitespace-nowrap';
        let cambio = `<span class="${pill} bg-slate-800/60 text-slate-400 border-slate-700">—</span>`;
        if (nA !== null && nB !== null) {
          const d = Math.round((nB - nA) * 100) / 100;
          const pct = nA > 0 ? Math.round((nB - nA) / nA * 100) : null;
          if (nA > 0) pcts.push((nB - nA) / nA * 100);
          const txt = (d > 0 ? '+' : '') + d + ' kg' + (pct !== null ? ` (${pct > 0 ? '+' : ''}${pct}%)` : '');
          cambio = d > 0 ? `<span class="${pill} bg-emerald-500/15 text-emerald-400 border-emerald-500/40">${txt}</span>`
                 : d < 0 ? `<span class="${pill} bg-rose-500/15 text-rose-400 border-rose-500/40">${txt}</span>`
                 : `<span class="${pill} bg-slate-800/60 text-slate-400 border-slate-700">= igual</span>`;
        } else if (oB && !oA) cambio = `<span class="${pill} bg-sky-500/15 text-sky-400 border-sky-500/40">nuevo</span>`;
        else if (oA && !oB) cambio = `<span class="${pill} bg-amber-500/15 text-amber-400 border-amber-500/40">sin registro</span>`;
        const tick = hecho => hecho
          ? '<span class="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center justify-center shrink-0">✓</span>'
          : '<span class="w-4 h-4 rounded-full border border-slate-700 shrink-0"></span>';
        const lado = (x, etiqueta, acento) => `
          <div class="flex-1 min-w-0 bg-slate-950 border ${acento} rounded-xl p-2.5">
            <div class="flex items-center justify-between gap-1.5 mb-1.5">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">${escHtml(etiqueta)}</p>
              ${tick(ejercicioHecho(x))}
            </div>
            <p class="text-base font-black leading-none ${x ? 'text-white' : 'text-slate-400'}">${escHtml(textoPeso(x))}</p>
          </div>`;
        return `
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md shrink-0">${escHtml(nombreDia(o.dia))}</span>
              ${cambio}
            </div>
            <p class="text-sm font-extrabold text-white uppercase leading-tight mb-3">${escHtml(nombreEjercicio(o.base))}</p>
            <div class="flex items-stretch gap-2">
              ${lado(oA, etA, 'border-slate-800')}
              <span class="self-center text-slate-400 text-sm font-black shrink-0">→</span>
              ${lado(oB, etB, 'border-emerald-500/30')}
            </div>
          </div>`;
      }).join('');

      const resumen = g => {
        const arr = Object.keys(g).filter(k => filtro === 'TODOS' || normalizarDia(g[k].dia) === filtro).map(k => g[k]);
        return { total: arr.length, ok: arr.filter(o => ejercicioHecho(o)).length };
      };
      const rA = resumen(gA), rB = resumen(gB);
      const media = pcts.length ? (pcts.reduce((a, b) => a + b, 0) / pcts.length) : null;
      const card = (t, v, sub, c) => `<div class="bg-slate-950 border border-slate-800 rounded-xl p-3"><span class="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">${t}</span><span class="block text-xl font-black ${c}">${v}</span><span class="block text-xs text-slate-400">${sub}</span></div>`;
      document.getElementById('resumenSemanas').innerHTML =
        card('Semana A · completados', rA.ok + '/' + rA.total, sA ? escHtml(sA.rango) : '', 'text-white') +
        card('Semana B · completados', rB.ok + '/' + rB.total, sB ? escHtml(sB.rango) : '', 'text-white') +
        card('Cambio medio de carga', media === null ? '—' : (media > 0 ? '+' : '') + media.toFixed(1) + '%', 'solo ejercicios con peso en ambas semanas', media === null ? 'text-slate-400' : media >= 0 ? 'text-emerald-400' : 'text-rose-400');

      const aviso = eA.value === eB.value ? '<p class="text-xs text-amber-400 mb-2">Elegiste la misma semana en A y B; selecciona dos distintas para ver cambios.</p>' : '';
      const leyenda = claves.length ? `<p class="text-xs text-slate-400 mb-3">${escHtml(etA)} (${sA ? escHtml(sA.rango) : ''}) → ${escHtml(etB)} (${sB ? escHtml(sB.rango) : ''})</p>` : '';
      document.getElementById('tablaSemanas').innerHTML = aviso + leyenda + (claves.length
        ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${filas}</div>`
        : '<p class="text-slate-400 text-xs p-3">No hay registros para el filtro elegido.</p>');
    }

    function comprimirImagen(file, maxWidth = 1000, quality = 0.8) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = err => reject(err);
        };
      });
    }

    function normalizarDia(str) {
      return String(str || '').trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function obtenerDiaActualSemana() {
      const mapa = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
      return mapa[new Date().getDay()];
    }

    function calcularIMCLocal() {
      const p = parseFloat(document.getElementById('evPeso').value);
      const t = parseFloat(document.getElementById('evTalla').value) / 100;
      if (p > 0 && t > 0) {
        document.getElementById('evImc').value = (p / (t * t)).toFixed(2);
      }
    }

    // ==================== LOGIN ====================
    async function iniciarSesion() {
      const u = document.getElementById('loginUser').value.trim();
      const p = document.getElementById('loginPass').value;
      const btn = document.getElementById('btnLogin');
      const err = document.getElementById('loginError');
      if (!u || !p) return;

      btn.innerText = 'Validando credenciales...';
      btn.disabled = true;
      err.classList.add('hidden');

      const hash = await sha256(p);
      GS()
        .withSuccessHandler(res => {
          btn.innerText = 'Ingresar al Sistema';
          btn.disabled = false;
          if (!res.success) {
            err.innerText = res.error + ' Si el problema persiste, comunícate con el Administrador.';
            err.classList.remove('hidden');
            return;
          }
          entrarConDatos(res);
        })
        .autenticarUsuario(u, hash);
    }

    // ==================== CACHÉ DE SESIÓN (la app abre al instante) ====================
    // Se guarda en el teléfono lo necesario para mostrar la app sin esperar al servidor.
    // NO se guardan las evaluaciones (datos médicos) ni las fotos: esas siempre vienen del servidor.
    // Todo se borra al cerrar sesión.
    const CLAVE_CACHE_SESION = 'proc_cache_sesion_v1';
    const MINUTOS_REFRESCO_AL_VOLVER = 3;

    function guardarCacheSesion(res) {
      try {
        if (!res || !res.user) return;
        const u = Object.assign({}, res.user); delete u.token;
        const snap = { ts: Date.now(), user: u, versionCatalogo: res.versionCatalogo || '' };
        if (u.rol === 'COACH') { snap.alumnos = res.alumnos || []; snap.plantillas = res.plantillas || []; }
        else { snap.rutina = res.rutina || []; snap.coach = res.coach || {}; snap.semanas = res.semanas || []; snap.checkins = estadoGlobal.checkins || []; }
        LS.set(CLAVE_CACHE_SESION, JSON.stringify(snap));
      } catch (e) {}
    }
    function leerCacheSesion() {
      try { const s = JSON.parse(LS.get(CLAVE_CACHE_SESION) || 'null'); return s && s.user && s.user.id ? s : null; }
      catch (e) { return null; }
    }
    function actualizarCacheCheckins(lista) {
      const s = leerCacheSesion();
      if (!s || !estadoGlobal.user || s.user.id !== estadoGlobal.user.id) return;
      s.checkins = lista || [];
      LS.set(CLAVE_CACHE_SESION, JSON.stringify(s));
    }

    /** Llegaron datos nuevos del servidor con la app ya abierta: actualiza solo lo que cambió. */
    function aplicarDatosFrescos(res) {
      if (!estadoGlobal.user || !res || !res.user || res.user.id !== estadoGlobal.user.id) { entrarConDatos(res); return; }
      const token = estadoGlobal.user.token;
      Object.assign(estadoGlobal.user, res.user, { token: token });
      guardarCacheSesion(res);
      if (res.user.rol === 'COACH') {
        const antes = JSON.stringify([estadoGlobal.alumnos || [], estadoGlobal.plantillas || []]);
        estadoGlobal.alumnos = res.alumnos || [];
        estadoGlobal.plantillas = res.plantillas || [];
        if (antes !== JSON.stringify([estadoGlobal.alumnos, estadoGlobal.plantillas])) {
          const elegidos = [...document.querySelectorAll('.select-alumnos')].map(s => s.value);
          actualizarSelectoresAlumnos();
          document.querySelectorAll('.select-alumnos').forEach((s, i) => { if (elegidos[i]) s.value = elegidos[i]; });
          actualizarSelectorPlantillas();
        }
        document.getElementById('coachWelcome').innerText = res.user.nombre;
        actualizarAvataresUI();
      } else {
        const firma = x => JSON.stringify([x.rutina || [], x.coach || {}, x.progreso || [], x.semanas || [], x.nivel || '', x.nombre || '', x.foto || '']);
        const antes = firma({ rutina: estadoGlobal.rutinaActual, coach: estadoGlobal.coachInfo, progreso: estadoGlobal.progresoActual,
          semanas: estadoGlobal.semanas, nivel: estadoGlobal._nivel, nombre: estadoGlobal._nombre, foto: estadoGlobal._foto });
        const ahora = firma({ rutina: res.rutina, coach: res.coach, progreso: res.progreso, semanas: res.semanas,
          nivel: res.user.nivel, nombre: res.user.nombre, foto: res.user.urlFotoPerfil });
        const rutinaCambio = JSON.stringify(estadoGlobal.rutinaActual || []) !== JSON.stringify(res.rutina || []);
        estadoGlobal.progresoActual = res.progreso || [];
        estadoGlobal.rutinaActual = res.rutina || [];
        estadoGlobal.semanas = res.semanas || [];
        estadoGlobal._nivel = res.user.nivel; estadoGlobal._nombre = res.user.nombre; estadoGlobal._foto = res.user.urlFotoPerfil;
        if (antes !== ahora) {
          inicializarPanelAlumno(res.user, res.progreso || [], res.rutina || [], res.coach || {}, { refresco: true });
          if (rutinaCambio && estadoGlobal._abiertaDesdeCache) mostrarToast('🔄 Tu coach actualizó tu rutina');
        }
      }
      if (window.ProCatalogo && res.versionCatalogo) window.ProCatalogo.verificar(res.versionCatalogo);
    }

    // Al volver a la app después de unos minutos, revisa en segundo plano si hay cambios
    let horaOcultaApp = 0;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { horaOcultaApp = Date.now(); return; }
      const token = estadoGlobal.user && estadoGlobal.user.token;
      if (!token || !horaOcultaApp || Date.now() - horaOcultaApp < MINUTOS_REFRESCO_AL_VOLVER * 60000) return;
      horaOcultaApp = 0;
      google.script.run
        .withFailureHandler(() => {})
        .withSuccessHandler(res => {
          if (res && res.success && res.user) aplicarDatosFrescos(res);
          else if (esErrorSesion(res)) sesionExpirada();
        })
        .restaurarSesion(token);
    });

    /** Abre el panel que corresponde (coach o alumno) con los datos que devuelve el servidor (o la caché). */
    function entrarConDatos(res, opciones) {
      opciones = opciones || {};
      estadoGlobal.user = res.user;
      estadoGlobal._abiertaDesdeCache = !!opciones.desdeCache;
      if (res.user && res.user.token) LS.set(CLAVE_TOKEN, res.user.token);
      if (!opciones.desdeCache) guardarCacheSesion(res);
      document.getElementById('loginView').classList.add('hidden');
      if (res.user.rol === 'COACH') {
        estadoGlobal.alumnos = res.alumnos || [];
        estadoGlobal.plantillas = res.plantillas || [];
        document.getElementById('coachWelcome').innerText = res.user.nombre;
        inicializarPanelCoach();
      } else {
        estadoGlobal.progresoActual = res.progreso || [];
        estadoGlobal.rutinaActual = res.rutina || [];
        estadoGlobal.semanas = res.semanas || [];
        estadoGlobal._nivel = res.user.nivel; estadoGlobal._nombre = res.user.nombre; estadoGlobal._foto = res.user.urlFotoPerfil;
        if (opciones.desdeCache && Array.isArray(res.checkins)) estadoGlobal.checkins = res.checkins;
        inicializarPanelAlumno(res.user, res.progreso || [], res.rutina || [], res.coach || {});
      }
      if (!opciones.desdeCache && window.ProCatalogo && res.versionCatalogo) window.ProCatalogo.verificar(res.versionCatalogo);
    }

    /**
     * Al abrir o recargar la app: si hay una sesión guardada (7 días), entra sin pedir contraseña.
     * Si además hay datos guardados en el teléfono, los muestra AL INSTANTE y en paralelo pide al
     * servidor la versión actual; cuando llega, actualiza solo lo que cambió.
     */
    const quitarSplash = () => { try { if (window.ocultarSplash) window.ocultarSplash(); } catch (e) {} };
    function intentarRestaurarSesion() {
      const token = LS.get(CLAVE_TOKEN);
      if (!token || estadoGlobal.user) { quitarSplash(); return; }
      const cache = leerCacheSesion();
      const btn = document.getElementById('btnLogin');
      const listo = () => { quitarSplash(); if (btn) { btn.disabled = false; btn.innerText = 'Ingresar al Sistema'; } };
      if (cache) {
        entrarConDatos(Object.assign({}, cache, { success: true, user: Object.assign({}, cache.user, { token: token }), progreso: [] }), { desdeCache: true });
        quitarSplash();
      } else if (btn) {
        btn.disabled = true; btn.innerText = 'Restaurando tu sesión...';
      }
      google.script.run
        .withFailureHandler(() => {                  // sin conexión: se conserva el token para el próximo intento
          listo();
          if (cache) mostrarToast('📶 Sin conexión: estás viendo tu última información guardada.');
        })
        .withSuccessHandler(res => {
          listo();
          if (res && res.success && res.user) { if (estadoGlobal.user) aplicarDatosFrescos(res); else entrarConDatos(res); return; }
          LS.del(CLAVE_TOKEN);                       // sesión vencida o anulada: pide usuario y contraseña
          LS.del(CLAVE_CACHE_SESION);
          if (estadoGlobal.user) { cerrarSesion(true); avisar('Tu sesión expiró o se cerró desde otro dispositivo. Vuelve a ingresar.', 'error'); }
        })
        .restaurarSesion(token);
    }
    document.addEventListener('DOMContentLoaded', intentarRestaurarSesion);

    // ==================== NAVEGACIÓN BARRA LATERAL Y MÓVIL ====================
    function toggleSidebarMovil() {
      const sb = document.getElementById('sidebarAlumno');
      const ov = document.getElementById('sidebarOverlay');
      const estaAbierto = !sb.classList.contains('-translate-x-full');
      if (estaAbierto) {
        sb.classList.add('-translate-x-full');
        ov.classList.add('hidden');
      } else {
        sb.classList.remove('-translate-x-full');
        ov.classList.remove('hidden');
      }
    }

    function navegarAlumno(vista) {
      document.querySelectorAll('.vista-alumno-sec').forEach(sec => sec.classList.add('hidden'));
      const target = document.getElementById(`vista-alumno-${vista}`);
      if (target) target.classList.remove('hidden');

      const TITULOS = { INICIO: 'Hoy', ENTRENAMIENTO: 'Entrenar', HISTORIAL: 'Progreso', RECORDS: 'Récords', PERFIL: 'Perfil' };
      document.getElementById('tituloSeccionMovil').textContent = TITULOS[vista] || vista;
      if (vista === 'INICIO') { renderPanelHoy(); renderCardCheckin(); }
      if (vista === 'PERFIL') renderPerfilAlumno();
      if (vista === 'RECORDS') cargarRecords('contenedorRecordsAlumno');

      document.querySelectorAll('.nav-btn-side').forEach(btn => {
        btn.className = 'nav-btn-side w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-slate-300 hover:bg-slate-800';
      });
      const activeSide = document.getElementById(`nav-side-${vista}`);
      if (activeSide) {
        activeSide.className = 'nav-btn-side w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20';
      }

      document.querySelectorAll('.nav-btn-bot').forEach(btn => {
        btn.classList.remove('text-emerald-400'); btn.classList.add('text-slate-400');
        const marca = btn.querySelector('.marca-activa'); if (marca) marca.remove();
      });
      document.querySelectorAll('.nav-btn-side, .nav-btn-bot').forEach(b => b.removeAttribute('aria-current'));
      [document.getElementById(`nav-side-${vista}`), document.getElementById(`nav-bot-${vista}`)].forEach(b => { if (b) b.setAttribute('aria-current', 'page'); });
      const activeBot = document.getElementById(`nav-bot-${vista}`);
      if (activeBot) {
        activeBot.classList.remove('text-slate-400'); activeBot.classList.add('text-emerald-400');
        activeBot.insertAdjacentHTML('afterbegin', '<span class="marca-activa absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-emerald-400"></span>');
      }

      document.getElementById('sidebarAlumno').classList.add('-translate-x-full');
      document.getElementById('sidebarOverlay').classList.add('hidden');

      if (vista === 'HISTORIAL') {
        setTimeout(() => inicializarGraficosSeparados(), 60);
      }
      window.scrollTo({ top: 0, behavior: modoScroll() });
    }


    // ==================== PANTALLA «HOY» ====================
    const DIAS_CORTOS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    function estadoDiaSemana(dia) {
      const diaN = normalizarDia(dia);
      const total = (estadoGlobal.rutinaActual || []).filter(r => normalizarDia(r.dia) === diaN).length;
      const datos = (estadoGlobal.progLocal && estadoGlobal.progLocal.datos) || {};
      let hechos = 0, actividad = false;
      Object.keys(datos).forEach(k => {
        if (!k.startsWith(diaN + '|')) return;
        actividad = true;
        if (k.endsWith('::ok') && String(datos[k]) === 'true') hechos++;
      });
      return { total, hechos: Math.min(hechos, total), actividad };
    }
    function rachaSemanas() {
      const con = new Set((estadoGlobal.semanas || []).filter(s => (s.registros || []).length).map(s => s.semanaISO));
      const p = estadoGlobal.progLocal;
      if (p && p.datos && Object.keys(p.datos).length) con.add(p.semanaISO);
      let racha = 0;
      const d = new Date();
      for (let i = 0; i < 104; i++) {
        const w = infoSemana(fechaLocalISO(d)).semanaISO;
        if (con.has(w)) racha++;
        else if (i > 0) break;
        d.setDate(d.getDate() - 7);
      }
      return racha;
    }
    
    function renderPanelHoy() {
      const hero = document.getElementById('hoyHero');
      if (!hero || !estadoGlobal.user) return;
      const hoy = obtenerDiaActualSemana();
      const rutina = estadoGlobal.rutinaActual || [];
      const ejHoy = rutina.filter(r => normalizarDia(r.dia) === normalizarDia(hoy));
      const sem = infoSemana(fechaLocalISO());
      try {
        const f = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
        document.getElementById('fechaHoyTxt').textContent = f.charAt(0).toUpperCase() + f.slice(1) + ' · Semana ' + sem.numero;
      } catch (e) {}

      // --- Tarjeta principal ---
      if (ejHoy.length) {
        const est = estadoDiaSemana(hoy);
        const pct = est.total ? Math.round(est.hechos / est.total * 100) : 0;
        const musculos = [...new Set(ejHoy.map(r => String(r.musculo || '').trim().toUpperCase()).filter(Boolean))].slice(0, 4);
        const minutos = Math.max(15, Math.round(ejHoy.reduce((t, r) => t + (parseInt(r.serie) || 3) * (40 + (parseInt(r.descanso) || 60)), 0) / 60 / 5) * 5);
        const minis = ejHoy.filter(r => r.media).slice(0, 5).map(r =>
          `<img src="${urlMini(r.media)}" loading="lazy" class="w-11 h-11 rounded-xl bg-white object-contain border-2 border-slate-900 -ml-2 first:ml-0" alt="">`).join('');
        const textoBtn = pct >= 100 ? '✓ Entrenamiento completado' : est.hechos > 0 ? `Continuar entrenamiento · ${est.hechos}/${est.total}` : 'Empezar entrenamiento';
        hero.innerHTML = `
          <div class="bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-5">
            <p class="text-xs font-bold text-emerald-300 uppercase tracking-wider">Entrenamiento de hoy · ${escHtml(hoy)}</p>
            <h3 class="text-xl font-extrabold text-white mt-1 leading-tight">${escHtml(ejHoy[0].nombreRutina || 'Tu rutina')}</h3>
            <div class="flex flex-wrap gap-1.5 mt-2.5">${musculos.map(m => `<span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-950/70 text-slate-300 border border-slate-800">${escHtml(m)}</span>`).join('')}</div>
            <div class="flex items-center justify-between gap-3 mt-4">
              <div class="flex items-center">${minis}</div>
              <p class="text-xs text-slate-400 font-semibold text-right">${ejHoy.length} ejercicios<br>~${minutos} min</p>
            </div>
            ${est.hechos ? `<div class="mt-4 h-1.5 bg-slate-950 rounded-full overflow-hidden"><div class="h-full bg-emerald-400 rounded-full" style="width:${pct}%"></div></div>` : ''}
            <button onclick="irAEntrenarHoy()" class="mt-4 w-full ${pct >= 100 ? 'bg-slate-950 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-500 text-slate-950'} font-extrabold text-base py-4 rounded-2xl active:scale-[0.98] transition flex items-center justify-center gap-2">
              ${pct >= 100 ? '' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>'}${textoBtn}
            </button>
          </div>`;
      } else {
        const idxHoy = DIAS_SEMANA.findIndex(d => normalizarDia(d) === normalizarDia(hoy));
        let prox = null;
        for (let i = 1; i <= 7 && !prox; i++) {
          const d = DIAS_SEMANA[(idxHoy + i) % 7];
          if (rutina.some(r => normalizarDia(r.dia) === normalizarDia(d))) prox = d;
        }
        hero.innerHTML = `
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Hoy · ${escHtml(hoy)}</p>
            <h3 class="text-xl font-extrabold text-white mt-1">${rutina.length ? 'Día de descanso' : 'Aún no tienes rutina'}</h3>
            <p class="text-sm text-slate-400 mt-1.5">${rutina.length
              ? 'Recupera, hidrátate y duerme bien.' + (prox ? ` Tu próximo entrenamiento es el <b class="text-white">${escHtml(prox.toLowerCase())}</b>.` : '')
              : 'Tu coach te asignará una rutina muy pronto.'}</p>
            ${prox ? `<button onclick="navegarAlumno('ENTRENAMIENTO'); seleccionarDiaRutina('${prox}')" class="mt-4 w-full bg-slate-950 text-emerald-300 border border-slate-800 font-bold text-sm py-3.5 rounded-2xl">Ver rutina del ${escHtml(prox.toLowerCase())}</button>` : ''}
          </div>`;
      }

      // --- Semana ---
      const celdas = DIAS_SEMANA.map((d, i) => {
        const e = estadoDiaSemana(d);
        const esHoy = normalizarDia(d) === normalizarDia(hoy);
        let marca;
        if (e.total && e.hechos >= e.total) marca = '<span class="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-sm font-black">✓</span>';
        else if (e.actividad) marca = '<span class="w-8 h-8 rounded-full border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-[11px] font-black">' + (e.total ? Math.round(e.hechos / e.total * 100) + '%' : '•') + '</span>';
        else if (e.total) marca = '<span class="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span></span>';
        else marca = '<span class="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 text-xs">—</span>';
        return `<button onclick="navegarAlumno('ENTRENAMIENTO'); seleccionarDiaRutina('${d}')" class="flex flex-col items-center gap-1.5">
          <span class="text-xs font-bold ${esHoy ? 'text-emerald-400' : 'text-slate-400'}">${DIAS_CORTOS[i]}</span>${marca}
          <span class="w-1 h-1 rounded-full ${esHoy ? 'bg-emerald-400' : 'bg-transparent'}"></span></button>`;
      }).join('');
      document.getElementById('hoySemana').innerHTML = `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-extrabold text-white">Esta semana</h2>
            <span class="text-xs text-slate-400 font-semibold">${escHtml(sem.rango)}</span>
          </div>
          <div class="grid grid-cols-7">${celdas}</div>
        </div>`;

      // --- Indicadores ---
      const programados = DIAS_SEMANA.filter(d => estadoDiaSemana(d).total).length;
      const entrenados = DIAS_SEMANA.filter(d => estadoDiaSemana(d).actividad).length;
      const racha = rachaSemanas();
      const ult = (estadoGlobal.progresoActual || []).slice(-1)[0];
      const tile = (valor, etiqueta) => `<div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <p class="text-xl font-black text-white leading-none">${valor}</p><p class="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-1.5">${etiqueta}</p></div>`;
      document.getElementById('hoyStats').innerHTML =
        tile(racha ? '🔥 ' + racha : '0', racha === 1 ? 'Semana seguida' : 'Semanas seguidas') +
        tile(`${entrenados}<span class="text-slate-400 text-sm">/${programados}</span>`, 'Días esta semana') +
        tile(ult && ult.peso !== '' ? `${ult.peso}<span class="text-slate-400 text-sm"> kg</span>` : '—', 'Peso actual');
    }

    // ==================== CHECK-IN SEMANAL ====================
    const CARAS = ['😫', '😕', '😐', '🙂', '🔥'];
    function renderCardCheckin() {
      const cont = document.getElementById('hoyCheckin'); if (!cont) return;
      const sem = infoSemana(fechaLocalISO());
      const lista = estadoGlobal.checkins || [];
      const deEstaSemana = lista.find(c => c.semanaISO === sem.semanaISO);
      if (deEstaSemana) {
        cont.innerHTML = `
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs font-bold text-emerald-400 uppercase tracking-wider">✓ Check-in enviado</p>
                <p class="text-xs text-slate-400 mt-0.5">${escHtml(deEstaSemana.fecha)} · Energía ${CARAS[(parseInt(deEstaSemana.energia) || 3) - 1]} · Sueño ${CARAS[(parseInt(deEstaSemana.sueno) || 3) - 1]}${deEstaSemana.peso ? ' · ' + escHtml(deEstaSemana.peso) + ' kg' : ''}</p>
              </div>
              <button onclick="abrirHojaCheckin()" class="shrink-0 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">Editar</button>
            </div>
            ${deEstaSemana.respuesta ? `<div class="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3"><p class="text-[11px] font-bold text-emerald-300 uppercase">Respuesta de tu coach</p><p class="text-sm text-white mt-1">${escHtml(deEstaSemana.respuesta)}</p></div>` : '<p class="text-xs text-slate-400 mt-2">Tu coach aún no responde.</p>'}
          </div>`;
      } else {
        cont.innerHTML = `
          <button onclick="abrirHojaCheckin()" class="w-full text-left bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition">
            <span class="w-11 h-11 rounded-xl bg-emerald-500/15 text-xl flex items-center justify-center shrink-0">${ico('clipboard-list', 'w-6 h-6')}</span>
            <span class="min-w-0"><span class="block text-sm font-extrabold text-white">Check-in de la semana</span><span class="block text-xs text-slate-400">Cuéntale a tu coach cómo te fue · 1 minuto</span></span>
            <span class="ml-auto text-emerald-400 font-black">›</span>
          </button>`;
      }
    }
    function pintarEscala(id, valor) {
      document.getElementById(id).innerHTML = CARAS.map((c, i) => `<button type="button" data-v="${i + 1}" onclick="elegirEscala('${id}', ${i + 1})"
        class="py-2.5 rounded-xl border text-xl ${valor === i + 1 ? 'bg-emerald-500/20 border-emerald-400' : 'bg-slate-950 border-slate-800'}">${c}</button>`).join('');
    }
    function elegirEscala(id, v) { document.getElementById(id).dataset.valor = v; pintarEscala(id, v); }
    function abrirHojaCheckin() {
      const sem = infoSemana(fechaLocalISO());
      const previo = (estadoGlobal.checkins || []).find(c => c.semanaISO === sem.semanaISO) || {};
      document.getElementById('ckSemanaTxt').textContent = 'Semana ' + sem.numero + ' · ' + sem.rango;
      const ult = (estadoGlobal.progresoActual || []).slice(-1)[0];
      document.getElementById('ckPeso').value = previo.peso || '';
      document.getElementById('ckPeso').placeholder = ult && ult.peso ? 'Última evaluación: ' + ult.peso + ' kg' : 'Ej. 78.5';
      document.getElementById('ckMolestias').value = previo.molestias || '';
      document.getElementById('ckNota').value = previo.nota || '';
      elegirEscala('ckEnergia', parseInt(previo.energia) || 3);
      elegirEscala('ckSueno', parseInt(previo.sueno) || 3);
      document.getElementById('hojaCheckin').classList.remove('hidden');
    }
    function cerrarHojaCheckin() { document.getElementById('hojaCheckin').classList.add('hidden'); }
    function enviarCheckin() {
      const btn = document.getElementById('btnEnviarCheckin');
      btn.disabled = true; btn.innerText = 'Enviando...';
      GS().withSuccessHandler(res => {
        btn.disabled = false; btn.innerText = 'Enviar a mi coach';
        if (!res || !res.success) { mostrarToast('❌ ' + ((res && res.error) || 'No se pudo enviar.')); return; }
        estadoGlobal.checkins = res.checkins || [];
        cerrarHojaCheckin(); renderCardCheckin();
        mostrarToast('✅ ' + res.mensaje);
      }).guardarCheckinSemanal(estadoGlobal.user.id, {
        peso: document.getElementById('ckPeso').value.trim(),
        energia: document.getElementById('ckEnergia').dataset.valor || '3',
        sueno: document.getElementById('ckSueno').dataset.valor || '3',
        molestias: document.getElementById('ckMolestias').value.trim(),
        nota: document.getElementById('ckNota').value.trim()
      });
    }
    function cargarCheckinsAlumno() {
      if (!estadoGlobal.user) return;
      GS().withSuccessHandler(res => { if (res && res.success) { estadoGlobal.checkins = res.checkins || []; actualizarCacheCheckins(estadoGlobal.checkins); renderCardCheckin(); } }).obtenerCheckinsAlumno(estadoGlobal.user.id);
    }
 
    function irAEntrenarHoy() {
      navegarAlumno('ENTRENAMIENTO');
      seleccionarDiaRutina(obtenerDiaActualSemana());
      // v18: «Empezar / Continuar entrenamiento» abre el modo guiado (si el día no está terminado)
      const est = estadoDiaSemana(obtenerDiaActualSemana());
      if (est.total && est.hechos < est.total && typeof abrirModoGuiado === 'function') { abrirModoGuiado(); return; }
      setTimeout(() => { const el = document.getElementById('contenedorRutinaAlumno'); if (el) el.scrollIntoView({ behavior: modoScroll(), block: 'start' }); }, 80);
    }

    function renderPerfilAlumno() {
      const u = estadoGlobal.user; if (!u) return;
      document.getElementById('perfilNombre').textContent = u.nombre || '';
      document.getElementById('perfilUsuario').textContent = '@' + (u.usuario || '');
      document.getElementById('perfilNivel').textContent = u.nivel || 'Sin nivel';
      document.getElementById('perfilCoach').textContent = 'Coach: ' + ((estadoGlobal.coachInfo && estadoGlobal.coachInfo.nombre) || '—');
      actualizarAvataresUI();
    }
