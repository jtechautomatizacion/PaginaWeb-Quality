const express = require('express');
const pool = require('../config/database');
const { newTimestamp } = require('../utils/helpers');
const { deleteIfUploaded } = require('../utils/uploadedFile');

const router = express.Router();
const MAX_CLIENTES = 25;

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM clientes ORDER BY orden ASC');
    res.status(200).json(rows);
});

router.post('/', async (req, res) => {
    const nombre = (req.body.nombre || '').trim();
    const logoUrl = (req.body.logo_url || '').trim();
    if (!nombre || !logoUrl) {
        return res.status(400).json({ ok: false, message: 'El nombre y el logo son requeridos.' });
    }

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM clientes');
    if (total >= MAX_CLIENTES) {
        return res.status(400).json({ ok: false, message: `Ya alcanzaste el limite de ${MAX_CLIENTES} clientes. Elimina alguno antes de agregar otro.` });
    }

    const [[{ maxOrden }]] = await pool.query('SELECT COALESCE(MAX(orden), 0) AS maxOrden FROM clientes');
    const timestamp = newTimestamp();
    const item = { id: timestamp, nombre, logo_url: logoUrl, orden: maxOrden + 1, timestamp };

    await pool.query(
        'INSERT INTO clientes (id, nombre, logo_url, orden, timestamp) VALUES (?, ?, ?, ?, ?)',
        [item.id, item.nombre, item.logo_url, item.orden, item.timestamp]
    );
    res.status(201).json({ ok: true, cliente: item });
});

router.put('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    const nombre = (req.body.nombre !== undefined ? req.body.nombre : existente.nombre).trim();
    if (!nombre) return res.status(400).json({ ok: false, message: 'El nombre es requerido.' });

    const item = { id, nombre, logo_url: req.body.logo_url ? req.body.logo_url : existente.logo_url };

    await pool.query('UPDATE clientes SET nombre = ?, logo_url = ? WHERE id = ?', [item.nombre, item.logo_url, id]);
    res.status(200).json({ ok: true, cliente: Object.assign({}, existente, item) });
});

router.delete('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT logo_url FROM clientes WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
    deleteIfUploaded(existente.logo_url);
    res.status(200).json({ ok: true });
});

module.exports = router;
