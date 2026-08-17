const express = require('express');
const pool = require('../config/database');

const router = express.Router();
const COLECCIONES = ['servicios', 'proyectos', 'investigacion', 'cursos'];

router.get('/', async (req, res) => {
    const tipo = req.query.tipo || 'overview';

    if (tipo === 'overview') {
        const resumen = {};
        for (const col of COLECCIONES) {
            const [[data]] = await pool.query(
                `SELECT COUNT(*) as total, SUM(CASE WHEN estado='draft' THEN 1 ELSE 0 END) as borradores FROM \`${col}\``
            );
            const total = Number(data.total);
            const borradores = Number(data.borradores || 0);
            resumen[col] = { total, publicados: total - borradores, borradores };
        }
        return res.status(200).json({ ok: true, data: resumen });
    }

    if (tipo === 'drafts') {
        const result = {};
        for (const col of COLECCIONES) {
            const [rows] = await pool.query(
                `SELECT id, titulo, slug, fecha FROM \`${col}\` WHERE estado='draft' ORDER BY timestamp DESC`
            );
            result[col] = rows;
        }
        return res.status(200).json({ ok: true, data: result });
    }

    if (tipo === 'cursos-sin-docente') {
        const [rows] = await pool.query(
            "SELECT id, titulo, slug, fecha FROM cursos WHERE docente_id IS NULL AND estado='published' ORDER BY timestamp DESC"
        );
        return res.status(200).json({ ok: true, data: rows });
    }

    if (tipo === 'docentes-sin-cursos') {
        const [rows] = await pool.query(
            "SELECT d.id, d.titulo, d.slug, COUNT(c.id) as cursos FROM docentes d LEFT JOIN cursos c ON c.docente_id=d.id AND c.estado='published' WHERE d.estado='published' GROUP BY d.id HAVING COUNT(c.id)=0"
        );
        return res.status(200).json({ ok: true, data: rows });
    }

    res.status(400).json({ ok: false, message: 'Tipo de reporte inválido.' });
});

module.exports = router;
