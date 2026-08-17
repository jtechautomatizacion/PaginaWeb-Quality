(function () {
    var API_BASE = window.API_BASE || 'http://localhost:4000';

    window.APP_CONFIG = {
        apiBase: API_BASE,
        whatsappNumber: '51920137591',
        whatsappDisplay: '+51 920 137 591',
        correo: 'responsablecomercial2@grouptqualityc.com.pe',
        collections: {
            servicios: { label: 'Servicios', singular: 'Servicio', backHref: 'servicios_publico.html', apiUrl: API_BASE + '/api/servicios' },
            proyectos: { label: 'Proyectos', singular: 'Proyecto', backHref: 'proyectos_publico.html', apiUrl: API_BASE + '/api/proyectos' },
            investigacion: { label: 'Investigacion', singular: 'Articulo', backHref: 'investigacion.html', apiUrl: API_BASE + '/api/investigacion' },
            cursos: { label: 'Cursos', singular: 'Curso', backHref: 'cursos_publico.html', apiUrl: API_BASE + '/api/cursos' }
        }
    };
})();
