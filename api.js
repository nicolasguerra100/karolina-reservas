// Conexión del sitio con el sistema de reservas en Google (Apps Script).
// Archivo generado por construir-web.js: no editar a mano.
const API_URL = 'https://script.google.com/macros/s/AKfycbzIHF7Yv7WYuPdwj9XdPgyC6Q4xt6X1CvD5DJ7OdoErJ0V3NWtpuBEJy1t6LLR6VMYX/exec';

// fetch sin cookies de Google: así no falla aunque el navegador tenga varias cuentas abiertas
function llamarApi(fn, args) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita la verificación previa de CORS
    body: JSON.stringify({ fn: fn, args: args }),
  })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(r => { if (!r.ok) throw new Error(r.error || 'Error del servidor'); return r.data; });
}

// Imita google.script.run para reutilizar el mismo código de las páginas de Apps Script
window.google = {
  script: {
    get run() {
      const h = {};
      const p = new Proxy({}, {
        get: (t, k) => {
          if (k === 'withSuccessHandler') return f => { h.ok = f; return p; };
          if (k === 'withFailureHandler') return f => { h.err = f; return p; };
          return (...a) => {
            llamarApi(k, a).then(d => h.ok && h.ok(d), e => (h.err ? h.err(e) : console.error(e)));
          };
        },
      });
      return p;
    },
  },
};
