function parseDocenteSlug() {
    const match = window.location.pathname.match(/(docentes)\/([a-z0-9-]+)\/?$/);
    return match ? { tipo: match[1], slug: match[2] } : null;
}

async function renderDocente(slug) {
    try {
        const res = await fetch(`api/docentes?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error('Docente no encontrado');
        const docente = await res.json();

        const docenteName = docente.nombre || 'Docente';
        const docenteRole = docente.role || '';
        const docenteBio = docente.bio || '';
        const docentePhoto = docente.photo || 'https://placehold.co/250x250/D4E3F0/D4E3F0';
        const docenteLinkedin = docente.linkedin || '';
        const cursos = docente.cursos || [];

        const tabInicial = window.location.hash === '#cursos' ? 'cursos' : 'informacion';

        const html = `
<section class="pi-section-head" style="background: linear-gradient(135deg, #45629C 0%, #5B74A7 100%); padding: 60px 0; color: white;">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-3 text-center mb-md-0 mb-4">
                <img src="${docentePhoto}" alt="${docenteName}" style="width: 250px; height: 250px; border-radius: 20px; object-fit: cover; box-shadow: 0 12px 28px rgba(0,0,0,0.2); border: 4px solid white;">
            </div>
            <div class="col-md-9 pl-md-5">
                <h1 style="font-size: 36px; font-weight: 900; margin: 0 0 12px; color: white;">${docenteName}</h1>
                <p style="font-size: 18px; font-weight: 800; text-transform: uppercase; margin: 0 0 20px; opacity: 0.95; letter-spacing: 0.05em;">${docenteRole}</p>
                <p style="font-size: 15px; line-height: 1.7; margin: 0; opacity: 0.9;">${docenteBio}</p>
                ${docenteLinkedin ? `<a href="${docenteLinkedin}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; color: white; text-decoration: none; font-weight: 700;">
                    <i class="fab fa-linkedin-in"></i> Ver perfil en LinkedIn
                </a>` : ''}
            </div>
        </div>
    </div>
</section>

<section class="pi-section-content">
    <div class="container">
        <div class="pi-tabs-wrapper">
            <div class="pi-tabs-nav">
                <button class="pi-tab-btn${tabInicial === 'informacion' ? ' is-active' : ''}" data-tab="informacion">Información</button>
                <button class="pi-tab-btn${tabInicial === 'cursos' ? ' is-active' : ''}" data-tab="cursos">Cursos que dicta <span class="pi-tab-badge">${cursos.length}</span></button>
            </div>

            <div id="tab-informacion" class="pi-tab-panel${tabInicial === 'informacion' ? ' is-active' : ''}" data-tab="informacion">
                <div class="pi-body-content">
                    <h3 style="font-size: 22px; font-weight: 900; color: #0F2B5B; margin: 0 0 20px;">Información Profesional</h3>
                    <p>${docenteBio}</p>
                </div>
            </div>

            <div id="tab-cursos" class="pi-tab-panel${tabInicial === 'cursos' ? ' is-active' : ''}" data-tab="cursos">
                <div class="pi-body-content">
                    <h3 style="font-size: 22px; font-weight: 900; color: #0F2B5B; margin: 0 0 20px;">Cursos que dicta</h3>
                    <ul class="pi-list" style="list-style: none; padding: 0; margin: 0;">
                        ${cursos.map(c => `
                        <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                            <a href="cursos/${c.slug}" style="color: #45629C; text-decoration: none; font-weight: 600; font-size: 15px;">
                                <i class="fas fa-graduation-cap" style="margin-right: 8px; color: #EF9E4D;"></i>
                                ${c.titulo}
                            </a>
                        </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
        `;

        document.getElementById('docentes-root').innerHTML = html;

        document.querySelectorAll('.pi-tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                document.querySelectorAll('.pi-tab-btn').forEach(b => b.classList.remove('is-active'));
                document.querySelectorAll('.pi-tab-panel').forEach(p => p.classList.remove('is-active'));
                this.classList.add('is-active');
                document.getElementById(`tab-${tabName}`).classList.add('is-active');
            });
        });

    } catch (e) {
        console.error('Error loading docente:', e);
        document.getElementById('docentes-root').innerHTML = '<div class="container mt-5"><p>Error cargando los datos del docente.</p></div>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const parsed = parseDocenteSlug();
    if (parsed) {
        renderDocente(parsed.slug);
    }
});
