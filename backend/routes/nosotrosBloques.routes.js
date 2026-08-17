const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM nosotros_bloques ORDER BY orden ASC');
    res.status(200).json(rows);
});

router.put('/', async (req, res) => {
    const clave = req.query.clave;
    if (!clave) return res.status(400).json({ ok: false, message: 'Clave requerida.' });

    const [rows] = await pool.query('SELECT * FROM nosotros_bloques WHERE clave = ?', [clave]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Bloque no encontrado.' });

    const titulo = (req.body.titulo !== undefined ? req.body.titulo : existente.titulo).trim();
    const contenido = req.body.contenido !== undefined ? req.body.contenido : existente.contenido;
    const imagen = req.body.imagen ? req.body.imagen : existente.imagen;

    if (!titulo) return res.status(400).json({ ok: false, message: 'El titulo es requerido.' });

    await pool.query('UPDATE nosotros_bloques SET titulo = ?, contenido = ?, imagen = ? WHERE clave = ?', [titulo, contenido, imagen, clave]);
    res.status(200).json({ ok: true, bloque: Object.assign({}, existente, { titulo, contenido, imagen }) });
});

module.exports = router;
