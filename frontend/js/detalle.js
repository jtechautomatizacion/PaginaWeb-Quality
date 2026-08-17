(function () {
    var WHATSAPP_NUMBER = window.APP_CONFIG.whatsappNumber;
    var CORREO = window.APP_CONFIG.correo;
    var TIPOS = window.APP_CONFIG.collections;

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    function waLink(mensaje) {
        return 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(mensaje);
    }

    function leerTipoYSlugDesdeRuta() {
        var pathMatch = decodeURIComponent(window.location.pathname)
            .match(/\/(servicios|proyectos|investigacion|cursos)\/([a-z0-9-]+)\/?$/);
        if (pathMatch) return { tipo: pathMatch[1], slug: pathMatch[2] };

        var params = new URLSearchParams(window.location.search);
        return { tipo: params.get('tipo'), slug: params.get('slug') };
    }

    function mostrarNoEncontrado(backHref) {
        var root = document.getElementById('detalle-root');
        if (!root) return;
        root.innerHTML = '<div class="svc-not-found">'
            + '<h2 class="h2_title">No se encontro el contenido solicitado</h2>'
            + '<p>Es posible que el enlace haya cambiado o el elemento ya no este disponible.</p>'
            + '<a href="' + (backHref || 'inicio.html') + '" class="svc-btn svc-btn--primary">Volver</a>'
            + '</div>';
    }

    function renderRelacionados(tipo, config, otros) {
        if (!otros.length) return '';
        var cards = otros.map(function (item) {
            var img = (tipo === 'servicios' && item.intro_imagen) ? item.intro_imagen : item.imagen;
            return '<a href="' + tipo + '/' + escapeHtml(item.slug) + '" class="svc-related-card">'
                + '<img src="' + escapeHtml(resolveApiUrl(img)) + '" alt="' + escapeHtml(item.titulo) + '" class="svc-related-card__image">'
                + '<div class="svc-related-card__body">'
                + '<h4>' + escapeHtml(item.titulo) + '</h4>'
                + '<p>' + escapeHtml(item.resumen) + '</p>'
                + '<span class="svc-related-card__link">Ver detalle <i class="fas fa-arrow-right"></i></span>'
                + '</div></a>';
        }).join('');

        return '<section class="svc-section svc-section--alt">'
            + '<div class="container">'
            + '<div class="svc-section__head">'
            + '<div class="svc-section__eyebrow">Seguir explorando</div>'
            + '<h2 class="svc-section__title">Otros ' + config.label.toLowerCase() + '</h2>'
            + '</div>'
            + '<div class="svc-related">' + cards + '</div>'
            + '</div></section>';
    }

    function renderIncluye(item) {
        var incluye;
        try { incluye = JSON.parse(item.incluye || '[]'); } catch (e) { incluye = []; }
        if (!incluye.length) return '';
        var items = incluye.map(function (texto) {
            return '<div class="svc-include-item">'
                + '<div class="svc-include-item__icon"><i class="fas fa-check"></i></div>'
                + '<div class="svc-include-item__text">' + escapeHtml(texto) + '</div>'
                + '</div>';
        }).join('');
        return '<section class="svc-section svc-section--alt">'
            + '<div class="container">'
            + '<div class="svc-section__head">'
            + '<div class="svc-section__eyebrow">Lo que incluye</div>'
            + '<h2 class="svc-section__title">Ensayos y alcance del servicio</h2>'
            + '<p class="svc-section__lead">Cada proyecto se adapta a la norma aplicable y a los requerimientos tecnicos del cliente.</p>'
            + '</div>'
            + '<div class="svc-includes">' + items + '</div>'
            + '</div></section>';
    }

    function renderGaleria(item) {
        var galeria;
        try { galeria = JSON.parse(item.galeria || '[]'); } catch (e) { galeria = []; }
        if (!galeria.length) return '';
        var figuras = galeria.map(function (g) {
            return '<figure class="svc-gallery__item">'
                + '<img src="' + escapeHtml(g.imagen) + '" alt="' + escapeHtml(g.titulo) + '" loading="lazy">'
                + '<figcaption>'
                + '<strong>' + escapeHtml(g.titulo) + '</strong>'
                + '<span>' + escapeHtml(g.norma) + '</span>'
                + '</figcaption></figure>';
        }).join('');
        return '<section class="svc-section svc-section--alt">'
            + '<div class="container">'
            + '<div class="svc-section__head">'
            + '<div class="svc-section__eyebrow">Ensayos del servicio</div>'
            + '<h2 class="svc-section__title">Galeria tecnica de ensayos</h2>'
            + '<p class="svc-section__lead">Algunos de los ensayos que ejecutamos en este servicio bajo norma INACAL/ASTM/NTP.</p>'
            + '</div>'
            + '<div class="svc-gallery">' + figuras + '</div>'
            + '</div></section>';
    }

    var FASES = '<section class="svc-section">'
        + '<div class="container">'
        + '<div class="svc-section__head">'
        + '<div class="svc-section__eyebrow">Metodologia</div>'
        + '<h2 class="svc-section__title">Fases de ejecucion del servicio</h2>'
        + '<p class="svc-section__lead">Trabajamos bajo un proceso estandarizado de campo, laboratorio y gabinete para asegurar resultados trazables y defendibles tecnicamente.</p>'
        + '</div>'
        + '<div class="svc-phases">'
        + '<div class="svc-phase-card"><div class="svc-phase-card__icon"><i class="fas fa-hard-hat"></i></div><h3>Trabajos de Campo</h3><p>Reconocimiento, muestreo y ensayos in situ siguiendo criterios ASTM y NTP, con equipos calibrados y personal tecnico certificado.</p></div>'
        + '<div class="svc-phase-card"><div class="svc-phase-card__icon"><i class="fas fa-flask"></i></div><h3>Trabajos de Laboratorio</h3><p>Ensayos normalizados bajo la acreditacion INACAL NTP-ISO/IEC 17025:2017, con trazabilidad y control QA/QC en todas las etapas.</p></div>'
        + '<div class="svc-phase-card"><div class="svc-phase-card__icon"><i class="fas fa-chart-line"></i></div><h3>Trabajos de Gabinete</h3><p>Analisis, calculos e informe tecnico con recomendaciones ejecutivas para la toma de decisiones de ingenieria y obra.</p></div>'
        + '</div></div></section>';

    var BENEFICIOS = '<section class="svc-section svc-section--alt">'
        + '<div class="container">'
        + '<div class="svc-section__head">'
        + '<div class="svc-section__eyebrow">¿Por que elegirnos?</div>'
        + '<h2 class="svc-section__title">Respaldo certificado para proyectos de alta exigencia</h2>'
        + '</div>'
        + '<div class="svc-benefits">'
        + '<div class="svc-benefit"><i class="fas fa-certificate"></i><h4>Acreditacion INACAL LE-234</h4><p>Laboratorio acreditado bajo NTP-ISO/IEC 17025:2017.</p></div>'
        + '<div class="svc-benefit"><i class="fas fa-award"></i><h4>ISO 9001, 14001, 45001 y 37001</h4><p>Sistema integrado de calidad, medio ambiente, seguridad y antisoborno certificado.</p></div>'
        + '<div class="svc-benefit"><i class="fas fa-user-tie"></i><h4>Personal certificado ACI</h4><p>Profesionales acreditados por el American Concrete Institute y NRMCA.</p></div>'
        + '<div class="svc-benefit"><i class="fas fa-file-contract"></i><h4>Informes con respaldo normativo</h4><p>Resultados trazables, metodologia ASTM/NTP y recomendaciones ejecutivas.</p></div>'
        + '</div></div></section>';

    var VALORES_PROYECTO = [
        ['fa-briefcase', 'Experiencia'], ['fa-lightbulb', 'Innovacion'], ['fa-bolt', 'Eficiencia'],
        ['fa-handshake', 'Compromiso'], ['fa-award', 'Calidad'], ['fa-project-diagram', 'Sinergia'],
        ['fa-comments', 'Comunicacion'], ['fa-shield-alt', 'Responsabilidad']
    ];

    // Config declarativa de las variantes tipo-portafolio (proyectos, cursos, investigacion).
    // Cada entrada describe solo lo que varia entre tipos; el layout comun vive en renderPortfolioItem.
    var PORTFOLIO_TIPOS = {
        proyectos: {
            crumbLabel: 'Proyecto',
            campos: function (item) {
                var campos = [];
                if (item.ubicacion) campos.push(['Ubicacion', item.ubicacion]);
                if (item.empresa) campos.push(['Empresa', item.empresa]);
                if (item.categoria) campos.push(['Ensayo', item.categoria]);
                if (item.fecha_admin) campos.push(['Publicado', item.fecha_admin]);
                campos.push(['Detalles', 'Group Total Quality Control - Ingenieros']);
                return campos;
            },
            body: function (item) {
                return item.contenido || item.resumen || '';
            }
        },
        cursos: {
            crumbLabel: 'Curso',
            campos: function (item) {
                var campos = [];
                if (item.modalidad) campos.push(['Modalidad', item.modalidad]);
                if (item.duracion) campos.push(['Duracion', item.duracion]);
                if (item.nivel) campos.push(['Nivel', item.nivel]);
                if (item.inversion) campos.push(['Inversion', item.inversion]);
                if (item.docente_nombre) campos.push(['Docente', item.docente_nombre]);
                if (item.fecha) campos.push(['Publicado', item.fecha]);
                campos.push(['Detalles', 'Group Total Quality Control - Ingenieros']);
                return campos;
            },
            body: function (item) {
                return item.contenido || item.resumen || '';
            },
            ctaStack: function (mensajeWa) {
                return '<div class="course-cta-stack">'
                    + '<a class="course-cta course-cta--wa" href="' + waLink(mensajeWa) + '" target="_blank" rel="noopener">'
                    + '<i class="fab fa-whatsapp"></i><span class="cc-text"><span class="cc-label">Consulta por WhatsApp</span><span class="cc-sub">' + window.APP_CONFIG.whatsappDisplay + '</span></span>'
                    + '</a>'
                    + '<a class="course-cta course-cta--form" href="contacto.html">'
                    + '<i class="fas fa-file-alt"></i><span class="cc-text"><span class="cc-label">Solicitar informacion</span><span class="cc-sub">Formulario de contacto</span></span>'
                    + '</a>'
                    + '</div>';
            }
        },
        investigacion: {
            crumbLabel: 'Articulo',
            campos: function (item) {
                var campos = [];
                campos.push(['Docente', item.docente || 'Aseguramiento de Calidad Group TQC']);
                if (item.fecha) campos.push(['Publicado', item.fecha]);
                campos.push(['Detalles', 'Group Total Quality Control - Ingenieros']);
                return campos;
            },
            body: function (item) {
                return item.contenido || item.resumen || '';
            }
        }
    };

    function renderPortfolioItem(tipo, config, item, otros) {
        var pConfig = PORTFOLIO_TIPOS[tipo];
        document.title = item.titulo + ' | Group Total Quality Control';
        var mensajeWa = 'Hola, quisiera informacion sobre: ' + item.titulo;

        var camposHtml = pConfig.campos(item).map(function (c) {
            return '<li><span class="pi-field-label">' + escapeHtml(c[0]) + ':</span> <span>' + escapeHtml(c[1]) + '</span></li>';
        }).join('');

        var valoresHtml = VALORES_PROYECTO.map(function (v) {
            return '<li><i class="fas ' + v[0] + '"></i> ' + v[1].toUpperCase() + '</li>';
        }).join('');

        var cuerpo = pConfig.body(item);
        var ctaStackHtml = pConfig.ctaStack ? pConfig.ctaStack(mensajeWa) : '';

        var fotosHtml = '<a href="' + escapeHtml(resolveApiUrl(item.imagen)) + '" target="_blank" rel="noopener"><img src="' + escapeHtml(resolveApiUrl(item.imagen)) + '" alt="' + escapeHtml(item.titulo) + '" loading="lazy"></a>';

        var relacionadosHtml = otros.map(function (o) {
            return '<a class="mosaic-tile" href="' + tipo + '/' + escapeHtml(o.slug) + '">'
                + '<img src="' + escapeHtml(resolveApiUrl(o.imagen)) + '" alt="' + escapeHtml(o.titulo) + '" loading="lazy">'
                + '<div class="mosaic-tile__overlay"><span class="mosaic-tile__title">' + escapeHtml(o.titulo) + '</span></div>'
                + '</a>';
        }).join('');

        var root = document.getElementById('detalle-root');
        root.innerHTML =
            '<section class="portfolio-item-shell"><div class="container">'
            + '<ol class="breadcrumb pi-breadcrumb">'
            + '<li class="breadcrumb-item"><a href="inicio.html">Inicio</a></li>'
            + '<li class="breadcrumb-item"><a href="' + config.backHref + '">' + escapeHtml(config.label) + '</a></li>'
            + '<li class="breadcrumb-item active">' + escapeHtml(pConfig.crumbLabel) + '</li>'
            + '</ol>'
            + '<h1 class="pi-super-title">' + escapeHtml(config.label.toUpperCase()) + '</h1>'
            + '<div class="pi-main row">'
            + '<div class="pi-media col-lg-6"><div class="pi-image-wrap">'
            + '<div class="pi-cover-slider"><div class="pi-slider-track">'
            + '<figure class="pi-slide is-active"><img src="' + escapeHtml(resolveApiUrl(item.imagen)) + '" alt="' + escapeHtml(item.titulo) + '"></figure>'
            + '</div></div>'
            + '<div class="pi-image-caption">Group Total Quality Control - Laboratorio, peritaje y consultoria tecnica.</div>'
            + '</div></div>'
            + '<div class="pi-info col-lg-6">'
            + '<h2 class="pi-title">' + escapeHtml(item.titulo) + '</h2>'
            + '<div class="pi-excerpt">' + (item.resumen || '') + '</div>'
            + '<ul class="pi-fields">' + camposHtml + '</ul>'
            + ctaStackHtml
            + '<ul class="pi-values">' + valoresHtml + '</ul>'
            + '</div></div>'
            + '<div class="pi-cta-bar">'
            + '<div class="pi-cta-text">Group Total Quality Control - Laboratorio, peritaje y consultoria tecnica.</div>'
            + '<a class="pi-cta-button" href="contacto.html"><i class="fas fa-rocket"></i> Escribenos</a>'
            + '</div>'
            + '<div class="pi-tabs" data-pi-tabs>'
            + '<div class="pi-tabs-nav" role="tablist">'
            + '<button type="button" class="pi-tab-btn is-active" data-pi-tab="descripcion" role="tab" aria-selected="true">Descripcion</button>'
            + '<button type="button" class="pi-tab-btn" data-pi-tab="fotos" role="tab" aria-selected="false">Fotos</button>'
            + '</div>'
            + '<div class="pi-tab-panel is-active" data-pi-panel="descripcion" role="tabpanel"><div class="pi-body-content">' + cuerpo + '</div></div>'
            + '<div class="pi-tab-panel" data-pi-panel="fotos" role="tabpanel">'
            + '<p class="pi-fotos-sub">Group Total Quality Control - Laboratorio, peritaje y consultoria tecnica.</p>'
            + '<div class="pi-fotos-grid">' + fotosHtml + '</div>'
            + '</div></div>'
            + (relacionadosHtml ? '<div class="pi-related"><h3 class="pi-section-title">Tambien te podria interesar</h3><div class="mosaic-grid">' + relacionadosHtml + '</div></div>' : '')
            + '</div></section>';

        var tabRoot = root.querySelector('[data-pi-tabs]');
        if (tabRoot) {
            var btns = tabRoot.querySelectorAll('[data-pi-tab]');
            var panels = tabRoot.querySelectorAll('[data-pi-panel]');
            btns.forEach(function (b) {
                b.addEventListener('click', function () {
                    btns.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
                    panels.forEach(function (x) { x.classList.remove('is-active'); });
                    b.classList.add('is-active');
                    b.setAttribute('aria-selected', 'true');
                    var panel = tabRoot.querySelector('[data-pi-panel="' + b.getAttribute('data-pi-tab') + '"]');
                    if (panel) panel.classList.add('is-active');
                });
            });
        }
    }

    function renderItem(tipo, config, item, otros) {
        document.title = item.titulo + ' | Group Total Quality Control';
        var imagenMostrada = (tipo === 'servicios' && item.intro_imagen) ? item.intro_imagen : item.imagen;

        var mensajeWa = 'Hola, quisiera mas informacion sobre "' + item.titulo + '" de Group Total Quality Control.';

        var metaChips = '';
        if (tipo === 'proyectos' && item.ubicacion) {
            metaChips += '<span><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(item.ubicacion) + '</span>';
        }
        if (item.fecha) {
            metaChips += '<span><i class="far fa-calendar-alt"></i> ' + escapeHtml(item.fecha) + '</span>';
        }

        var root = document.getElementById('detalle-root');
        root.innerHTML =
            '<section class="svc-hero">'
            + '<div class="container">'
            + '<div class="svc-hero__crumbs">'
            + '<a href="inicio.html">Inicio</a><span>/</span>'
            + '<a href="' + config.backHref + '">' + escapeHtml(config.label) + '</a><span>/</span>'
            + '<span>' + escapeHtml(item.titulo) + '</span>'
            + '</div>'
            + '<span class="svc-hero__eyebrow"><i class="fas fa-award"></i> &nbsp;' + escapeHtml(config.singular) + ' Group Total Quality Control</span>'
            + '<h1>' + escapeHtml(item.titulo) + '</h1>'
            + '<div>' + (item.resumen || '') + '</div>'
            + '<div class="svc-hero__ctas">'
            + '<a href="' + waLink(mensajeWa) + '" target="_blank" rel="noopener" class="svc-btn svc-btn--wa svc-btn--lg"><i class="fab fa-whatsapp"></i> Solicitar por WhatsApp</a>'
            + '<a href="#solicitar-cotizacion" class="svc-btn svc-btn--outline svc-btn--lg"><i class="fas fa-file-alt"></i> Cotizar en linea</a>'
            + '</div></div></section>'

            + '<section class="svc-section">'
            + '<div class="container">'
            + '<div class="svc-intro">'
            + '<div class="svc-intro__copy">'
            + '<div class="svc-section__eyebrow">Descripcion</div>'
            + '<h2 class="svc-section__title" style="text-align:left; margin-bottom:18px;">' + escapeHtml(item.titulo) + '</h2>'
            + (metaChips ? '<div class="svc-intro__meta">' + metaChips + '</div>' : '')
            + '<div>' + (item.resumen || '') + '</div>'
            + '<div style="margin-top:22px; display:flex; flex-wrap:wrap; gap:10px;">'
            + '<a href="' + waLink(mensajeWa) + '" target="_blank" rel="noopener" class="svc-btn svc-btn--wa"><i class="fab fa-whatsapp"></i> Hablar con un asesor</a>'
            + (tipo === 'servicios' ? '<a href="assets/files/brochure-group-total-quality-control.pdf" target="_blank" class="svc-btn svc-btn--primary"><i class="fas fa-file-pdf"></i> Descargar Brochure</a>' : '')
            + '</div></div>'
            + '<div class="svc-intro__image"><img src="' + escapeHtml(resolveApiUrl(imagenMostrada)) + '" alt="' + escapeHtml(item.titulo) + '"></div>'
            + '</div></div></section>'

            + (tipo === 'servicios' && item.contenido ? '<section class="svc-section"><div class="container"><div class="svc-section__head"><h2 class="svc-section__title">Informacion completa del servicio</h2></div><div class="svc-body-content">' + item.contenido + '</div></div></section>' : '')
            + (tipo === 'servicios' ? renderIncluye(item) + renderGaleria(item) + FASES + BENEFICIOS : '')

            + '<section class="svc-section svc-section--alt">'
            + '<div class="container">'
            + '<div class="svc-cta">'
            + '<div class="svc-cta__text">'
            + '<h2>¿Listo para dar el siguiente paso?</h2>'
            + '<p>Nuestro equipo te contactara en menos de 24 horas con informacion personalizada sobre "' + escapeHtml(item.titulo) + '".</p>'
            + '</div>'
            + '<div class="svc-cta__actions">'
            + '<a href="' + waLink(mensajeWa) + '" target="_blank" rel="noopener" class="svc-btn svc-btn--wa svc-btn--lg"><i class="fab fa-whatsapp"></i> WhatsApp directo</a>'
            + '</div></div></div></section>'

            + '<section class="svc-section svc-form-section" id="solicitar-cotizacion">'
            + '<div class="container">'
            + '<div class="svc-section__head">'
            + '<div class="svc-section__eyebrow">Solicitar informacion</div>'
            + '<h2 class="svc-section__title">Cuentanos que necesitas</h2>'
            + '<p class="svc-section__lead">Completa el formulario o escribenos por WhatsApp. Un asesor comercial te respondera en menos de 24 horas.</p>'
            + '</div>'
            + '<div class="svc-form-grid">'
            + '<div class="svc-form-card">'
            + '<h3>Formulario de contacto</h3>'
            + '<p>Te contactamos con la propuesta tecnica y economica.</p>'
            + '<form id="svc-form" novalidate="">'
            + '<div class="form-group"><label for="svc-nombre">Nombres y Apellidos *</label>'
            + '<input type="text" class="form-control" id="svc-nombre" placeholder="Ingresa tu nombre completo" autocomplete="name" required></div>'
            + '<div class="row">'
            + '<div class="col-md-6"><div class="form-group"><label for="svc-correo">Correo *</label>'
            + '<input type="email" class="form-control" id="svc-correo" placeholder="tu@correo.com" autocomplete="email" required></div></div>'
            + '<div class="col-md-6"><div class="form-group"><label for="svc-telefono">Telefono / WhatsApp *</label>'
            + '<input type="tel" class="form-control" id="svc-telefono" placeholder="+51 ..." autocomplete="tel" required></div></div>'
            + '</div>'
            + '<div class="form-group"><label for="svc-mensaje">Detalle de tu proyecto *</label>'
            + '<textarea class="form-control" id="svc-mensaje" placeholder="Describenos tu proyecto, ubicacion y plazos." required></textarea></div>'
            + '<button type="submit" class="svc-form-btn"><i class="fas fa-paper-plane"></i> &nbsp;Enviar por WhatsApp</button>'
            + '<p class="svc-form-note">* Campos obligatorios. Al enviar se abrira WhatsApp con tu mensaje prellenado.</p>'
            + '<p class="svc-form-success" id="svc-form-success">Se abrio WhatsApp con tu mensaje. ¡Gracias por escribirnos!</p>'
            + '</form></div>'
            + '<div class="svc-contact-card">'
            + '<h3>Contacto directo</h3>'
            + '<div class="svc-contact-row"><i class="fab fa-whatsapp"></i><div><strong>WhatsApp comercial</strong>'
            + '<a href="' + waLink(mensajeWa) + '" target="_blank" rel="noopener">' + window.APP_CONFIG.whatsappDisplay + '</a></div></div>'
            + '<div class="svc-contact-row"><i class="fas fa-envelope"></i><div><strong>Correo</strong>'
            + '<a href="mailto:' + CORREO + '">' + CORREO + '</a></div></div>'
            + '<div class="svc-contact-row"><i class="fas fa-map-marker-alt"></i><div><strong>Sede central</strong>'
            + '<span>Jr. Miguel Grau Nro. 01, Pilcomayo, Huancayo, Junin.</span></div></div>'
            + '<div class="svc-contact-row"><i class="far fa-clock"></i><div><strong>Horario</strong>'
            + '<span>Lunes a viernes 8:00 - 18:00<br>Sabados 8:00 - 13:00</span></div></div>'
            + '<div class="svc-quick-ctas">'
            + '<a href="' + waLink(mensajeWa) + '" target="_blank" rel="noopener" class="svc-btn svc-btn--wa"><i class="fab fa-whatsapp"></i> Escribir por WhatsApp</a>'
            + '</div></div>'
            + '</div></div></section>'

            + renderRelacionados(tipo, config, otros);

        var form = document.getElementById('svc-form');
        if (form) {
            form.addEventListener('submit', function (ev) {
                ev.preventDefault();
                var nombre = document.getElementById('svc-nombre').value.trim();
                var correo = document.getElementById('svc-correo').value.trim();
                var telefono = document.getElementById('svc-telefono').value.trim();
                var mensaje = document.getElementById('svc-mensaje').value.trim();
                if (!nombre || !correo || !telefono || !mensaje) return;

                var texto = 'Hola, quisiera mas informacion sobre "' + item.titulo + '".\n'
                    + 'Nombre: ' + nombre + '\nCorreo: ' + correo + '\nTelefono: ' + telefono
                    + '\nDetalle: ' + mensaje;
                window.open(waLink(texto), '_blank', 'noopener');

                var success = document.getElementById('svc-form-success');
                if (success) success.classList.add('is-visible');
                form.reset();
            });
        }
    }

    var ruta = leerTipoYSlugDesdeRuta();
    var tipo = ruta.tipo;
    var slug = ruta.slug;
    var config = TIPOS[tipo];

    if (!config || !slug) {
        mostrarNoEncontrado('inicio.html');
        return;
    }

    var docentesPromise = (tipo === 'cursos') ? ApiClient.fetch(window.API_BASE + '/api/docentes').catch(function () { return []; }) : Promise.resolve([]);

    Promise.all([ApiClient.fetch(config.apiUrl), docentesPromise])
        .then(function (results) {
            var items = results[0];
            var docentes = results[1];
            var docenteById = {};
            docentes.forEach(function (d) { docenteById[d.id] = d.titulo; });

            var publicados = (items || []).filter(function (i) { return i.estado !== 'draft'; });
            publicados.forEach(function (i) {
                if (i.docente_id && docenteById[i.docente_id]) i.docente_nombre = docenteById[i.docente_id];
            });
            var item = publicados.find(function (i) { return i.slug === slug; });
            if (!item) {
                mostrarNoEncontrado(config.backHref);
                return;
            }
            var otros = publicados.filter(function (i) { return i.slug !== slug; }).slice(0, 3);
            if (PORTFOLIO_TIPOS[tipo]) {
                renderPortfolioItem(tipo, config, item, otros);
            } else {
                renderItem(tipo, config, item, otros);
            }
        })
        .catch(function () { mostrarNoEncontrado(config.backHref); });

    window.addEventListener('popstate', function () { window.location.reload(); });
})();
