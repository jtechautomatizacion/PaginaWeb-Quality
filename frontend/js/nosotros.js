(function () {
    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function getImageUrl(imagenPath) {
        if (!imagenPath) return 'https://placehold.co/640x480/e9edf5/e9edf5';
        if (/^https?:\/\//.test(imagenPath)) return imagenPath;
        return 'https://api.grouptqualityc.com.pe' + (imagenPath.startsWith('/') ? imagenPath : '/' + imagenPath);
    }

    var slidesContainer = document.getElementById('contenedor-nosotros-slides');
    var visionContainer = document.getElementById('contenedor-vision');
    var misionContainer = document.getElementById('contenedor-mision');
    var certsContainer = document.getElementById('contenedor-certificaciones-nosotros');

    if (slidesContainer || visionContainer || misionContainer || certsContainer) {
        fetch(window.API_BASE + '/api/nosotros_bloques')
            .then(function (res) { return res.json(); })
            .then(function (bloques) {
                var byClave = {};
                bloques.forEach(function (b) { byClave[b.clave] = b; });

                if (slidesContainer) {
                    var slides = [byClave.slide1, byClave.slide2].filter(Boolean);
                    slidesContainer.innerHTML = slides.map(function (s, i) {
                        return '<div class="carousel-item' + (i === 0 ? ' active' : '') + '">'
                            + '<div class="row">'
                            + '<div class="col-md-6 col-sm-12 col-12">'
                            + '<div class="div-text-slide">'
                            + '<h2 class="h2_title">' + escapeHtml(s.titulo) + '</h2>'
                            + '<p>' + (s.contenido || '') + '</p>'
                            + '</div></div>'
                            + '<div class="col-md-6 col-sm-12 col-12">'
                            + '<img src="' + escapeHtml(getImageUrl(s.imagen)) + '" class="d-block w-100" style="border-radius: 10px;" alt="' + escapeHtml(s.titulo) + '">'
                            + '</div></div></div>';
                    }).join('');
                }

                function pintarVisMis(container, bloque, imgWidth) {
                    if (!container || !bloque) return;
                    container.innerHTML = '<div class="vis-mis-alig">'
                        + '<img src="' + escapeHtml(getImageUrl(bloque.imagen)) + '" width="' + imgWidth + '" alt="' + escapeHtml(bloque.titulo) + '">'
                        + '<div>'
                        + '<h2 class="h2_title">' + escapeHtml(bloque.titulo) + '</h2>'
                        + '<span>' + (bloque.contenido || '') + '</span>'
                        + '</div></div>';
                }
                pintarVisMis(visionContainer, byClave.vision, 80);
                pintarVisMis(misionContainer, byClave.mision, 70);

                if (certsContainer && byClave.certificaciones) {
                    var c = byClave.certificaciones;
                    certsContainer.innerHTML = '<div class="iso-alig">'
                        + '<img src="' + escapeHtml(getImageUrl(c.imagen)) + '" width="80" alt="' + escapeHtml(c.titulo) + '">'
                        + '<div>'
                        + '<h2 class="h2_title">' + escapeHtml(c.titulo) + '</h2>'
                        + '<span>' + (c.contenido || '') + '</span>'
                        + '</div></div>';
                }
            })
            .catch(function () {});
    }

    var valoresContainer = document.getElementById('contenedor-valores');
    if (valoresContainer) {
        fetch(window.API_BASE + '/api/nosotros_valores')
            .then(function (res) { return res.json(); })
            .then(function (valores) {
                valoresContainer.innerHTML = valores.map(function (v) {
                    return '<div class="col-md-4 col-sm-4 col-6 estra-ubic mt-3">'
                        + '<i class="' + escapeHtml(v.icono_fa) + '" style="font-size: 60px; color: var(--gtqc-blue-deep);"></i>'
                        + '<span>' + escapeHtml(v.nombre) + '</span>'
                        + '</div>';
                }).join('');
            })
            .catch(function () {});
    }

    var trayectoriaContainer = document.getElementById('contenedor-trayectoria');
    if (trayectoriaContainer) {
        fetch(window.API_BASE + '/api/nosotros_trayectoria')
            .then(function (res) { return res.json(); })
            .then(function (items) {
                trayectoriaContainer.innerHTML = items.map(function (t) {
                    var enlace = t.enlace_texto && t.enlace_url
                        ? '<a href="' + escapeHtml(t.enlace_url) + '" class="btn-transparent-wt-bsc">' + escapeHtml(t.enlace_texto) + ' <i class="fas fa-trophy"></i></a>'
                        : '';
                    return '<div class="col-md-4 col-sm-4 col-6 tray-ubic">'
                        + '<h2>+ <span class="counter">' + escapeHtml(t.numero) + '</span>' + (t.sufijo ? ' ' + escapeHtml(t.sufijo) : '') + '</h2>'
                        + '<span>' + escapeHtml(t.etiqueta) + '</span>'
                        + enlace
                        + '</div>';
                }).join('');
            })
            .catch(function () {});
    }

    var staffContainer = document.getElementById('contenedor-staff-nosotros');
    if (staffContainer) {
        fetch(window.API_BASE + '/api/nosotros_staff')
            .then(function (res) { return res.json(); })
            .then(function (staff) {
                staffContainer.innerHTML = staff.map(function (p) {
                    return '<div class="col-md-4 col-sm-6 col-12 mt-3">'
                        + '<div class="old-highlight-box text-center">'
                        + '<img src="' + escapeHtml(getImageUrl(p.imagen)) + '" alt="' + escapeHtml(p.nombre) + '" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 14px; border: 3px solid var(--gtqc-blue-deep); display: block;">'
                        + '<h3>' + escapeHtml(p.nombre) + '</h3>'
                        + '<p style="color: var(--gtqc-blue-deep);"><strong>' + escapeHtml(p.cargo) + '</strong></p>'
                        + '<p style="text-align: left;">' + escapeHtml(p.descripcion) + '</p>'
                        + '</div></div>';
                }).join('');
            })
            .catch(function () {});
    }
})();
