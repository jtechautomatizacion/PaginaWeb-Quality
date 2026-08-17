const express = require('express');
const pool = require('../config/database');
const { newTimestamp } = require('../utils/helpers');

const router = express.Router();
const TIPOS_VALIDOS = ['pdf', 'imagen'];

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM acreditaciones ORDER BY orden ASC');
    res.status(200).json(rows);
});

router.post('/', async (req, res) => {
    const titulo = (req.body.titulo || '').trim();
    if (!titulo) return res.status(400).json({ ok: false, message: 'El titulo es requerido.' });

    const [[{ maxOrden }]] = await pool.query('SELECT COALESCE(MAX(orden), 0) AS maxOrden FROM acreditaciones');
    const timestamp = newTimestamp();
    const item = {
        id: timestamp,
        titulo,
        descripcion: req.body.descripcion || '',
        archivo_url: req.body.archivo_url || '',
        archivo_tipo: TIPOS_VALIDOS.includes(req.body.archivo_tipo) ? req.body.archivo_tipo : '',
        orden: maxOrden + 1,
        timestamp
    };

    await pool.query(
        'INSERT INTO acreditaciones (id, titulo, descripcion, archivo_url, archivo_tipo, orden, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.titulo, item.descripcion, item.archivo_url, item.archivo_tipo, item.orden, item.timestamp]
    );
    res.status(201).json({ ok: true, acreditacion: item });
});

router.put('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT * FROM acreditaciones WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    const titulo = (req.body.titulo !== undefined ? req.body.titulo : existente.titulo).trim();
    if (!titulo) return res.status(400).json({ ok: false, message: 'El titulo es requerido.' });

    const item = {
        id,
        titulo,
        descripcion: req.body.descripcion !== undefined ? req.body.descripcion : existente.descripcion,
        archivo_url: req.body.archivo_url ? req.body.archivo_url : existente.archivo_url,
        archivo_tipo: TIPOS_VALIDOS.includes(req.body.archivo_tipo) ? req.body.archivo_tipo : existente.archivo_tipo
    };

    await pool.query(
        'UPDATE acreditaciones SET titulo = ?, descripcion = ?, archivo_url = ?, archivo_tipo = ? WHERE id = ?',
        [item.titulo, item.descripcion, item.archivo_url, item.archivo_tipo, id]
    );
    res.status(200).json({ ok: true, acreditacion: Object.assign({}, existente, item) });
});

router.delete('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [result] = await pool.query('DELETE FROM acreditaciones WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });
    res.status(200).json({ ok: true });
});

module.exports = router;
