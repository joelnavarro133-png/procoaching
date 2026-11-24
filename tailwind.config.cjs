// Estilos de Tailwind ya preparados (v15): antes se compilaban en el teléfono en cada apertura con cdn.tailwindcss.com.
// Se regeneran solos al publicar (GitHub Actions). Para regenerarlos a mano:
//   npx tailwindcss@3.4.19 -c tailwind.config.cjs -i web/css/tailwind-entrada.css -o web/css/tailwind.css --minify
// ===== SISTEMA VISUAL «DEPORTIVO LIMPIO» ===== Un solo color de acento. Para cambiarlo, edita ACENTO (escala 50-950).
const ACENTO = { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22' };
const CALIDO = { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f',950:'#451a03' };
module.exports = {
  content: ['./web/index.html', './web/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] },
      colors: {
        // Todos los tonos decorativos pasan al acento; se conservan rojo/rosa (errores) y ámbar (avisos)
        emerald: ACENTO, sky: ACENTO, cyan: ACENTO, teal: ACENTO, blue: ACENTO, purple: ACENTO,
        violet: ACENTO, indigo: ACENTO, fuchsia: ACENTO, green: ACENTO, lime: ACENTO, orange: CALIDO,
        deep: '#020617', panel: '#0f172a',
        neon: { cyan: ACENTO[400], green: ACENTO[400], orange: CALIDO[400], purple: ACENTO[400] }
      },
      boxShadow: { 'neon-cyan': 'none', 'neon-green': 'none', 'neon-orange': 'none', 'hologram': '0 10px 30px rgba(0,0,0,.35)' }
    }
  }
};
