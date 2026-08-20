(function () {
    var grid = document.getElementById('coursesGrid');
    if (!grid) return;

    var modalityList = document.getElementById('coursesModalityList');
    var levelList = document.getElementById('coursesLevelList');
    var docentesSection = document.getElementById('docentesSection');
    var docentesGrid = document.getElementById('docentesGrid');

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    function waLink(mensaje) {
        return 'https://api.whatsapp.com/send?phone=' + window.APP_CONFIG.whatsappNumber + '&text=' + encodeURIComponent(mensaje);
    }

    function getImageUrl(imagenPath) {
        if (!imagenPath) return 'https://placehold.co/640x480/e9edf5/e9edf5';
        if (/^https?:\/\//.test(imagenPath)) return imagenPath;
        return 'https://api.grouptqualityc.com.pe' + (imagenPath.startsWith('/') ? imagenPath : '/' + imagenPath);
    }

    function buildFilterList(container, group, counts, total) {
        if (!container) return;
        var values = Object.keys(counts).sort();
        var html = '<li><label class="courses-filter-opt is-active" data-filter-group="' + group + '" data-filter-value="*">'
            + '<input type="radio" name="' + group + '-filter" checked hidden>'
            + '<span class="cfo-box"></span><span class="cfo-label">Todas</span><span class="cfo-count">' + total + '</span>'
            + '</label></li>';
        html += values.map(function (v) {
            return '<li><label class="courses-filter-opt" data-filter-group="' + group + '" data-filter-value="' + escapeHtml(v) + '">'
                + '<input type="radio" name="' + group + '-filter" hidden>'
                + '<span class="cfo-box"></span><span class="cfo-label">' + escapeHtml(v) + '</span><span class="cfo-count">' + counts[v] + '</span>'
                + '</label></li>';
        }).join('');
        container.innerHTML = html;
    }

    function courseCardHtml(curso, index, docenteById) {
        var docente = curso.docente_id ? docenteById[curso.docente_id] : null;
        var modalidad = curso.modalidad || '';
        var nivel = curso.nivel || '';
        var titleAttr = curso.titulo.toLowerCase();
        var wa = waLink('Hola, quisiera informacion sobre el curso: ' + curso.titulo);

        var docenteBlock = docente
            ? '<div class="course-card__docencia">'
                + '<div class="ccd-avatar"><i class="fas fa-user-tie"></i></div>'
                + '<div class="ccd-info"><span class="ccd-label">DOCENCIA</span><strong class="ccd-name">' + escapeHtml(docente.titulo.toUpperCase()) + '</strong></div>'
                + '</div>'
            : '';

        var docenteBtn = docente
            ? '<button type="button" class="course-card__btn course-card__btn--docente js-open-docente"'
                + ' data-docente-name="' + escapeHtml(docente.titulo) + '"'
                + ' data-docente-role="' + escapeHtml(docente.role || '') + '"'
                + ' data-docente-bio="' + escapeHtml(docente.bio || '') + '"'
                + ' data-docente-photo="' + escapeHtml(getImageUrl(docente.imagen)) + '"'
                + ' data-docente-linkedin="' + escapeHtml(docente.linkedin || '') + '">'
                + '<i class="fas fa-user-tie"></i> Ver docente</button>'
            : '';

        return '<article class="course-card" data-modality="' + escapeHtml(modalidad) + '" data-level="' + escapeHtml(nivel) + '" data-title="' + escapeHtml(titleAttr) + '" data-index="' + index + '">'
            + docenteBlock
            + '<a class="course-card__imglink" href="cursos/' + curso.slug + '" aria-label="' + escapeHtml(curso.titulo) + '">'
            + '<img class="course-card__image" src="' + escapeHtml(getImageUrl(curso.imagen)) + '" alt="' + escapeHtml(curso.titulo) + '" loading="lazy">'
            + (modalidad ? '<div class="course-card__badge">' + escapeHtml(modalidad.toUpperCase()) + '</div>' : '')
            + '</a>'
            + '<div class="course-card__body">'
            + '<h3 class="course-card__title"><a href="cursos/' + curso.slug + '">' + escapeHtml(curso.titulo) + '</a></h3>'
            + '<div class="course-card__divider"></div>'
            + '<div class="course-card__meta">'
            + '<span class="ccm-date"><i class="far fa-calendar-alt"></i> ' + escapeHtml(curso.fecha || '') + '</span>'
            + '<span class="ccm-price">' + escapeHtml(curso.inversion || 'Cotizacion corporativa') + '</span>'
            + '</div>'
            + '<div class="course-card__actions">'
            + '<a class="course-card__btn course-card__btn--detail" href="cursos/' + curso.slug + '"><i class="fas fa-book-open"></i> Ver detalle</a>'
            + '<a class="course-card__btn course-card__btn--wa" href="' + wa + '" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>'
            + '</div>'
            + docenteBtn
            + '</div></article>';
    }

    function docenteCardHtml(docente, cursosDelDocente) {
        var bioCorta = (docente.bio || '').length > 180 ? docente.bio.slice(0, 180) + '...' : (docente.bio || '');
        var cursosHtml = cursosDelDocente.map(function (c) {
            return '<li><a href="cursos/' + c.slug + '"><i class="fas fa-graduation-cap"></i> ' + escapeHtml(c.titulo) + '</a></li>';
        }).join('');

        return '<article class="docente-card">'
            + '<a href="docentes/' + docente.slug + '#cursos" class="docente-card__link-wrap" aria-label="Ver perfil de ' + escapeHtml(docente.titulo) + '">'
            + '<div class="docente-card__photo"><img src="' + escapeHtml(getImageUrl(docente.imagen)) + '" alt="' + escapeHtml(docente.titulo) + '" loading="lazy"></div>'
            + '<div class="docente-card__body">'
            + '<h3 class="docente-card__name">' + escapeHtml(docente.titulo) + '</h3>'
            + '<p class="docente-card__role">' + escapeHtml(docente.role || '') + '</p>'
            + '<p class="docente-card__bio">' + escapeHtml(bioCorta) + '</p>'
            + '<div class="docente-card__courses"><strong>Cursos que dicta:</strong><ul>' + cursosHtml + '</ul></div>'
            + '<span class="docente-card__cta">Ver cursos <i class="fas fa-arrow-right"></i></span>'
            + '</div></a></article>';
    }

    Promise.all([
        ApiClient.fetch(window.API_BASE + '/api/cursos'),
        ApiClient.fetch(window.API_BASE + '/api/docentes')
    ]).then(function (results) {
        var cursos = (results[0] || []).filter(function (c) { return c.estado !== 'draft'; });
        var docentes = results[1] || [];

        var docenteById = {};
        docentes.forEach(function (d) { docenteById[d.id] = d; });

        var modalidadCounts = {};
        var nivelCounts = {};
        cursos.forEach(function (c) {
            if (c.modalidad) modalidadCounts[c.modalidad] = (modalidadCounts[c.modalidad] || 0) + 1;
            if (c.nivel) nivelCounts[c.nivel] = (nivelCounts[c.nivel] || 0) + 1;
        });

        grid.innerHTML = cursos.map(function (c, i) { return courseCardHtml(c, i, docenteById); }).join('');
        buildFilterList(modalityList, 'modality', modalidadCounts, cursos.length);
        buildFilterList(levelList, 'level', nivelCounts, cursos.length);

        if (docentesGrid && docentesSection) {
            var docentesConCursos = docentes
                .filter(function (d) { return d.estado !== 'draft'; })
                .map(function (d) {
                    var suyos = cursos.filter(function (c) { return c.docente_id === d.id; });
                    return { docente: d, cursos: suyos };
                })
                .filter(function (entry) { return entry.cursos.length > 0; });

            if (docentesConCursos.length) {
                docentesGrid.innerHTML = docentesConCursos.map(function (entry) {
                    return docenteCardHtml(entry.docente, entry.cursos);
                }).join('');
                docentesSection.hidden = false;
            }
        }

        if (window.initCoursesCatalog) window.initCoursesCatalog();
    }).catch(function () {});
})();
