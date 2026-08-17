const pool = require('../config/database');

async function getDetailBySlug(slug) {
    const [docenteRows] = await pool.query('SELECT * FROM docentes WHERE slug = ? LIMIT 1', [slug]);
    const docente = docenteRows[0];
    if (!docente) return null;

    const [cursos] = await pool.query(
        "SELECT id, titulo, slug FROM cursos WHERE docente_id = ? AND estado = 'published' ORDER BY fecha DESC",
        [docente.id]
    );

    return {
        nombre: docente.titulo,
        role: docente.role || '',
        bio: docente.bio || '',
        photo: docente.imagen || '',
        linkedin: docente.linkedin || '',
        cursos
    };
}

module.exports = { getDetailBySlug };
