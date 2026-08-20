// El backend vive en un host distinto al frontend (VPS vs cPanel), asi que la
// base de la API no puede ser relativa. En local apunta al backend de desarrollo
// (backend/server.js, PORT=4000); en cualquier otro host, al VPS de produccion.
(function () {
    if (window.API_BASE) return;
    var host = window.location.hostname;
    var esLocal = (host === 'localhost' || host === '127.0.0.1');
    window.API_BASE = esLocal ? 'http://localhost:4000' : 'https://api.grouptqualityc.com.pe';
})();
