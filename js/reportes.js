const collectionNames = {
    servicios: 'Servicios',
    proyectos: 'Proyectos',
    investigacion: 'Investigación',
    cursos: 'Cursos'
};

async function loadReports() {
    try {
        const [overview, drafts, cursosSinDocente, docentesSinCursos] = await Promise.all([
            fetch('api/reportes.php?tipo=overview').then(r => r.json()),
            fetch('api/reportes.php?tipo=drafts').then(r => r.json()),
            fetch('api/reportes.php?tipo=cursos-sin-docente').then(r => r.json()),
            fetch('api/reportes.php?tipo=docentes-sin-cursos').then(r => r.json())
        ]);

        if (overview.ok) renderKpis(overview.data);
        if (drafts.ok) renderDrafts(drafts.data);
        if (cursosSinDocente.ok) renderCursosSinDocente(cursosSinDocente.data);
        if (docentesSinCursos.ok) renderDocentesSinCursos(docentesSinCursos.data);
    } catch (err) {
        console.error('Error cargando reportes:', err);
        document.getElementById('kpisContainer').innerHTML = '<p style="color:#ff6b6b; text-align:center; grid-column: 1/-1;">Error cargando reportes</p>';
    }
}

function renderKpis(data) {
    const total = Object.values(data).reduce((sum, col) => sum + col.total, 0);
    const borradores = Object.values(data).reduce((sum, col) => sum + col.borradores, 0);
    const publicados = Object.values(data).reduce((sum, col) => sum + col.publicados, 0);

    const container = document.getElementById('kpisContainer');
    container.innerHTML = `
        <div class="report-kpi">
            <div class="report-kpi__label">Total contenido</div>
            <div class="report-kpi__value">${total}</div>
        </div>
        <div class="report-kpi">
            <div class="report-kpi__label">Publicados</div>
            <div class="report-kpi__value">${publicados}</div>
        </div>
        <div class="report-kpi">
            <div class="report-kpi__label">Borradores</div>
            <div class="report-kpi__value" style="color:#ff9800;">${borradores}</div>
        </div>
        <div class="report-kpi">
            <div class="report-kpi__label">% Publicado</div>
            <div class="report-kpi__value">${total > 0 ? Math.round(publicados / total * 100) : 0}%</div>
        </div>
    `;
}

function renderDrafts(data) {
    const container = document.getElementById('draftsContainer');
    let html = '';
    let totalDrafts = 0;

    for (const [coleccion, items] of Object.entries(data)) {
        if (!Array.isArray(items) || items.length === 0) continue;

        totalDrafts += items.length;
        html += `<div style="margin-bottom:20px;">
            <h5 style="font-size:13px; font-weight:600; color:#22d3ee; margin-bottom:12px; text-transform:uppercase;">
                <i class="fas fa-${getIconClass(coleccion)}"></i> ${collectionNames[coleccion]} (${items.length})
            </h5>
            <div style="display:grid; gap:8px;">`;

        items.forEach(item => {
            html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:rgba(34,211,238,0.05); border-radius:6px; border-left:3px solid #ff9800;">
                <div>
                    <div style="font-size:13px; font-weight:500; color:#e0e0e0;">${item.titulo}</div>
                    <div style="font-size:11px; color:#999; margin-top:4px;">${item.slug}</div>
                </div>
                <a href="javascript:void(0)" onclick="window.open('${coleccion}/${item.slug}', '_blank')" style="color:#22d3ee; text-decoration:none; font-size:12px; white-space:nowrap; margin-left:10px;">Ver →</a>
            </div>`;
        });

        html += '</div></div>';
    }

    if (totalDrafts === 0) {
        html = '<p style="color:#22d3ee; text-align:center; padding:20px;"><i class="fas fa-check-circle"></i> Sin contenido sin publicar</p>';
    }

    container.innerHTML = html;
}

function renderCursosSinDocente(data) {
    const container = document.getElementById('cursosContainer');

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p style="color:#22d3ee; text-align:center; padding:20px;"><i class="fas fa-check-circle"></i> Todos los cursos tienen docente</p>';
        return;
    }

    let html = `<div style="display:grid; gap:8px; width:100%;">`;
    data.forEach(curso => {
        html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:rgba(255,107,107,0.1); border-radius:6px; border-left:3px solid #ff6b6b;">
            <div>
                <div style="font-size:13px; font-weight:500; color:#e0e0e0;">${curso.titulo}</div>
                <div style="font-size:11px; color:#999; margin-top:4px;">${curso.slug}</div>
            </div>
            <a href="cursos_admin.html" style="color:#ff6b6b; text-decoration:none; font-size:12px; white-space:nowrap; margin-left:10px;">Asignar →</a>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

function renderDocentesSinCursos(data) {
    const container = document.getElementById('docentesContainer');

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p style="color:#22d3ee; text-align:center; padding:20px;"><i class="fas fa-check-circle"></i> Todos los docentes tienen cursos</p>';
        return;
    }

    let html = `<div style="display:grid; gap:8px; width:100%;">`;
    data.forEach(docente => {
        html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:rgba(255,193,7,0.1); border-radius:6px; border-left:3px solid #ffc107;">
            <div>
                <div style="font-size:13px; font-weight:500; color:#e0e0e0;">${docente.titulo}</div>
                <div style="font-size:11px; color:#999; margin-top:4px;">${docente.slug}</div>
            </div>
            <a href="cursos_admin.html" style="color:#ffc107; text-decoration:none; font-size:12px; white-space:nowrap; margin-left:10px;">Crear curso →</a>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

function getIconClass(collection) {
    const icons = {
        servicios: 'cogs',
        proyectos: 'project-diagram',
        investigacion: 'book',
        cursos: 'graduation-cap'
    };
    return icons[collection] || 'file';
}

document.addEventListener('DOMContentLoaded', loadReports);
