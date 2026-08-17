(function () {
    var serviciosMosaico = document.getElementById('contenedor-servicios-mosaico');
    var serviciosGrid = document.getElementById('contenedor-servicios');
    var proyectosTrack = document.getElementById('contenedor-proyectos');
    var proyectosGrid = document.getElementById('contenedor-proyectos-publico');
    var investigacionGrid = document.getElementById('contenedor-investigacion');

    var IMAGENES_SERVICIOS = ['assets/servicios/servicios1.png', 'assets/servicios/servicios2.png', 'assets/servicios/servicios3.png', 'assets/servicios/servicios4.png'];
    var IMAGENES_PROYECTOS = ['assets/proyectos/proyecto1.png', 'assets/proyectos/proyecto2.png', 'assets/proyectos/proyecto3.png'];

    function imagenServicio(i) { return IMAGENES_SERVICIOS[i % IMAGENES_SERVICIOS.length]; }
    function imagenProyecto(i) { return IMAGENES_PROYECTOS[i % IMAGENES_PROYECTOS.length]; }
    function imagenDe(item, fallback) { return item && item.imagen ? item.imagen : fallback; }

    if (serviciosMosaico) {
        ApiClient.fetch(window.API_BASE + '/api/servicios')
            .then(function (servicios) {
                serviciosMosaico.innerHTML = servicios.map(function (s, i) {
                    return '<a href="servicios/' + s.slug + '" class="hm-service-card">'
                        + '<img src="' + imagenDe(s, imagenServicio(i)) + '" alt="' + s.titulo + '" class="hm-service-card__image">'
                        + '<div class="hm-service-card__body">'
                        + '<h3 class="hm-service-card__title">' + s.titulo + '</h3>'
                        + '<p class="hm-service-card__summary">' + s.resumen + '</p>'
                        + '<span class="hm-service-card__link">Ver mas detalles <i class="fas fa-arrow-right"></i></span>'
                        + '</div></a>';
                }).join('');
            })
            .catch(function () {});
    }

    if (serviciosGrid) {
        ApiClient.fetch(window.API_BASE + '/api/servicios')
            .then(function (servicios) {
                serviciosGrid.innerHTML = servicios.map(function (s, i) {
                    return '<div class="col-md-4 col-sm-6 col-12 mt-2">'
                        + '<div class="div-box-slide-md">'
                        + '<a href="servicios/' + s.slug + '" class="btn-brochure-serv"><i class="fas fa-arrow-right"></i> Ver servicio</a>'
                        + '<div class="efect-zoom-img">'
                        + '<a href="servicios/' + s.slug + '"><img src="' + imagenDe(s, imagenServicio(i)) + '" class="div-box-slide-md__image" alt="' + s.titulo + '"></a>'
                        + '</div>'
                        + '<div class="div-box-slide-md__body">'
                        + '<h4><a href="servicios/' + s.slug + '">' + s.titulo.toUpperCase() + '</a></h4>'
                        + '<p>' + s.resumen + '</p>'
                        + '<a href="servicios/' + s.slug + '" class="div-box-slide-md__link">Ver mas detalles <i class="fas fa-arrow-right"></i></a>'
                        + '</div></div></div>';
                }).join('');
            })
            .catch(function () {});
    }

    if (proyectosTrack) {
        ApiClient.fetch(window.API_BASE + '/api/proyectos')
            .then(function (proyectos) {
                proyectosTrack.innerHTML = proyectos.map(function (p, i) {
                    return '<div class="hm-carousel__card">'
                        + '<div class="hm-project-card">'
                        + '<div class="hm-project-card__body">'
                        + '<h3 class="hm-project-card__title">' + p.titulo + '</h3>'
                        + '<p class="hm-project-card__summary">' + p.resumen + '</p>'
                        + '<div class="hm-project-card__meta">'
                        + '<strong><i class="fas fa-map-marker-alt"></i> ' + p.ubicacion + '</strong>'
                        + '<span><i class="far fa-calendar-alt"></i> ' + p.fecha + '</span>'
                        + '</div></div>'
                        + '<div class="hm-project-card__image"><img src="' + imagenDe(p, imagenProyecto(i)) + '" alt="' + p.titulo + '"></div>'
                        + '</div></div>';
                }).join('');
            })
            .catch(function () {});
    }

    if (proyectosGrid) {
        var categoriasList = document.getElementById('proyectos-categorias');
        ApiClient.fetch(window.API_BASE + '/api/proyectos')
            .then(function (proyectos) {
                proyectosGrid.innerHTML = proyectos.map(function (p, i) {
                    var wa = 'https://api.whatsapp.com/send?phone=' + window.APP_CONFIG.whatsappNumber + '&text=' + encodeURIComponent('Hola, quisiera informacion sobre: ' + p.titulo);
                    return '<div class="mosaic-tile" data-category="' + (p.categoria || '') + '">'
                        + '<a class="mosaic-tile__imglink" href="proyectos/' + p.slug + '" aria-label="' + p.titulo + '">'
                        + '<img src="' + imagenDe(p, imagenProyecto(i)) + '" alt="' + p.titulo + '" loading="lazy">'
                        + '</a>'
                        + '<div class="mosaic-tile__overlay">'
                        + '<span class="mosaic-tile__title">' + p.titulo + '</span>'
                        + '<span class="mosaic-tile__divider"></span>'
                        + '<div class="mosaic-tile__actions">'
                        + '<a class="tile-action tile-action--view" href="proyectos/' + p.slug + '" aria-label="Ver proyecto" title="Ver proyecto"><i class="fas fa-eye"></i></a>'
                        + '<a class="tile-action tile-action--wa" href="' + wa + '" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp"><i class="fab fa-whatsapp"></i></a>'
                        + '</div></div></div>';
                }).join('');

                if (categoriasList) {
                    var counts = {};
                    proyectos.forEach(function (p) {
                        if (!p.categoria) return;
                        counts[p.categoria] = (counts[p.categoria] || 0) + 1;
                    });
                    var categorias = Object.keys(counts).sort();
                    categoriasList.innerHTML = '<li><button type="button" class="cat-filter-btn is-active" data-cat-filter="*">Todas <span class="cat-count">' + proyectos.length + '</span></button></li>'
                        + categorias.map(function (cat) {
                            return '<li><button type="button" class="cat-filter-btn" data-cat-filter="' + cat + '">' + cat + ' <span class="cat-count">' + counts[cat] + '</span></button></li>';
                        }).join('');
                }

                var btns = document.querySelectorAll('.cat-filter-btn');
                var empty = document.querySelector('[data-empty]');
                btns.forEach(function (b) {
                    b.addEventListener('click', function () {
                        btns.forEach(function (x) { x.classList.remove('is-active'); });
                        b.classList.add('is-active');
                        var f = b.getAttribute('data-cat-filter');
                        var shown = 0;
                        document.querySelectorAll('.mosaic-tile[data-category]').forEach(function (t) {
                            var match = (f === '*' || t.getAttribute('data-category') === f);
                            t.style.display = match ? '' : 'none';
                            if (match) shown++;
                        });
                        if (empty) empty.hidden = shown !== 0;
                    });
                });
            })
            .catch(function () {});
    }

    if (investigacionGrid) {
        var investigacionCategoriasList = document.getElementById('investigacion-categorias');
        ApiClient.fetch(window.API_BASE + '/api/investigacion')
            .then(function (items) {
                var publicados = items.filter(function (i) { return i.estado !== 'draft'; });
                investigacionGrid.innerHTML = publicados.map(function (i) {
                    var wa = 'https://api.whatsapp.com/send?phone=' + window.APP_CONFIG.whatsappNumber + '&text=' + encodeURIComponent('Hola, quisiera informacion sobre: ' + i.titulo);
                    return '<div class="mosaic-tile" data-category="">'
                        + '<a class="mosaic-tile__imglink" href="investigacion/' + i.slug + '" aria-label="' + i.titulo + '">'
                        + '<img src="' + i.imagen + '" alt="' + i.titulo + '" loading="lazy">'
                        + '</a>'
                        + '<div class="mosaic-tile__overlay">'
                        + '<span class="mosaic-tile__title">' + i.titulo + '</span>'
                        + '<span class="mosaic-tile__divider"></span>'
                        + '<div class="mosaic-tile__actions">'
                        + '<a class="tile-action tile-action--view" href="investigacion/' + i.slug + '" aria-label="Ver articulo" title="Ver articulo"><i class="fas fa-eye"></i></a>'
                        + '<a class="tile-action tile-action--wa" href="' + wa + '" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp"><i class="fab fa-whatsapp"></i></a>'
                        + '</div></div></div>';
                }).join('');

                if (investigacionCategoriasList) {
                    investigacionCategoriasList.innerHTML = '<li><button type="button" class="cat-filter-btn is-active" data-cat-filter="*">Todas <span class="cat-count">' + publicados.length + '</span></button></li>';
                }
            })
            .catch(function () {});
    }
})();

(function () {
    var heroSlides = document.querySelector('.hm-hero__slides');
    if (!heroSlides) return;

    ApiClient.fetch(window.API_BASE + '/api/servicios')
        .then(function (servicios) {
            var destacados = servicios.filter(function (s) { return s.estado !== 'draft' && Number(s.destacado) === 1; }).slice(0, 4);
            if (!destacados.length) return;

            heroSlides.innerHTML = destacados.map(function (s, i) {
                return '<div class="hm-hero__slide' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '" style="background-image: url(\'' + (s.imagen || '') + '\');">'
                    + '<div class="container hm-hero__inner">'
                    + '<div class="hm-hero__content">'
                    + '<span class="hm-hero__eyebrow"><i class="fas fa-certificate"></i> INACAL LE-234 &middot; ISO 17025:2017</span>'
                    + '<h2 class="hm-hero__title">' + s.titulo + '</h2>'
                    + '<p class="hm-hero__summary">' + (s.resumen || '') + '</p>'
                    + '<div class="hm-hero__ctas">'
                    + '<a class="hm-btn hm-btn--red hm-btn--lg" href="servicios/' + s.slug + '">VER DETALLES <i class="fas fa-arrow-right"></i></a>'
                    + '<a class="hm-btn hm-btn--outline hm-btn--lg" href="contacto.html">COTIZA AQUI</a>'
                    + '</div></div></div></div>';
            }).join('');

            if (window.initHmHero) window.initHmHero();
        })
        .catch(function () {});
})();

(function () {
    var statsContainer = document.getElementById('contenedor-estadisticas');
    if (!statsContainer) return;

    ApiClient.fetch(window.API_BASE + '/api/estadisticas')
        .then(function (items) {
            statsContainer.innerHTML = items.map(function (e) {
                return '<div class="hm-stat">'
                    + '<div class="hm-stat__value">' + e.valor + '</div>'
                    + '<div class="hm-stat__label">' + e.etiqueta + '</div>'
                    + '</div>';
            }).join('');
        })
        .catch(function () {});
})();

(function () {
    var certsContainer = document.getElementById('contenedor-acreditaciones');
    if (!certsContainer) return;

    ApiClient.fetch(window.API_BASE + '/api/acreditaciones')
        .then(function (items) {
            certsContainer.innerHTML = items.map(function (a) {
                var icon = a.archivo_tipo === 'pdf' ? 'fa-file-pdf' : 'fa-image';
                var label = a.archivo_tipo === 'pdf' ? 'Descargar PDF' : 'Ver certificado';
                var link = a.archivo_url
                    ? '<a href="' + a.archivo_url + '" target="_blank" rel="noopener" class="hm-cert__link"><i class="fas ' + icon + '"></i> ' + label + '</a>'
                    : '';
                return '<div class="hm-cert">'
                    + '<h3>' + a.titulo + '</h3>'
                    + '<p>' + (a.descripcion || '') + '</p>'
                    + link
                    + '</div>';
            }).join('');
        })
        .catch(function () {});
})();

(function () {
    var textos = document.querySelectorAll('[data-content]');
    if (!textos.length) return;

    ApiClient.fetch(window.API_BASE + '/api/contenido')
        .then(function (data) {
            textos.forEach(function (el) {
                var clave = el.getAttribute('data-content');
                if (data[clave]) el.textContent = data[clave];
            });
        })
        .catch(function () {});
})();

(function () {
    var submenus = document.querySelectorAll('[data-submenu]');
    if (!submenus.length) return;

    submenus.forEach(function (ul) {
        var tipo = ul.getAttribute('data-submenu');
        var coleccion = window.APP_CONFIG.collections[tipo];
        if (!coleccion) return;
        ApiClient.fetch(coleccion.apiUrl)
            .then(function (items) {
                var publicados = items.filter(function (it) { return it.estado !== 'draft'; });
                if (!publicados.length) return;
                ul.innerHTML = publicados.map(function (it) {
                    return '<li><a href="' + tipo + '/' + it.slug + '"><span>' + it.titulo.toUpperCase() + '</span></a></li>';
                }).join('');
            })
            .catch(function () {});
    });
})();

(function () {
    var track = document.getElementById('contenedor-clientes-marquee');
    if (!track) return;

    ApiClient.fetch(window.API_BASE + '/api/clientes')
        .then(function (clientes) {
            if (!clientes.length) return;
            var itemsHtml = clientes.map(function (c) {
                return '<div class="hm-clients-marquee__item"><img src="' + c.logo_url + '" alt="' + c.nombre + '" loading="lazy"></div>';
            }).join('');
            track.innerHTML = itemsHtml + itemsHtml;
        })
        .catch(function () {});
})();
