const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM estadisticas ORDER BY orden ASC');
    res.status(200).json(rows);
});

router.put('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT * FROM estadisticas WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    const valor = (req.body.valor !== undefined ? req.body.valor : existente.valor).trim();
    const etiqueta = (req.body.etiqueta !== undefined ? req.body.etiqueta : existente.etiqueta).trim();
    if (!valor || !etiqueta) {
        return res.status(400).json({ ok: false, message: 'El valor y la etiqueta son requeridos.' });
    }

    await pool.query('UPDATE estadisticas SET valor = ?, etiqueta = ? WHERE id = ?', [valor, etiqueta, id]);
    res.status(200).json({ ok: true, estadistica: Object.assign({}, existente, { valor, etiqueta }) });
});

module.exports = router;
