const express = require('express');
const pool = require('../config/database');
const { newTimestamp } = require('../utils/helpers');

const router = express.Router();
const MAX_VALORES = 6;

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM nosotros_valores ORDER BY orden ASC');
    res.status(200).json(rows);
});

router.post('/', async (req, res) => {
    const nombre = (req.body.nombre || '').trim();
    const iconoFa = (req.body.icono_fa || '').trim();
    if (!nombre || !iconoFa) {
        return res.status(400).json({ ok: false, message: 'El nombre y el icono son requeridos.' });
    }

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM nosotros_valores');
    if (total >= MAX_VALORES) {
        return res.status(400).json({ ok: false, message: `Ya alcanzaste el limite de ${MAX_VALORES} valores. Elimina alguno antes de agregar otro.` });
    }

    const [[{ maxOrden }]] = await pool.query('SELECT COALESCE(MAX(orden), 0) AS maxOrden FROM nosotros_valores');
    const timestamp = newTimestamp();
    const item = { id: timestamp, nombre, icono_fa: iconoFa, orden: maxOrden + 1, timestamp };

    await pool.query(
        'INSERT INTO nosotros_valores (id, nombre, icono_fa, orden, timestamp) VALUES (?, ?, ?, ?, ?)',
        [item.id, item.nombre, item.icono_fa, item.orden, item.timestamp]
    );
    res.status(201).json({ ok: true, valor: item });
});

router.put('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT * FROM nosotros_valores WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    const nombre = (req.body.nombre !== undefined ? req.body.nombre : existente.nombre).trim();
    const iconoFa = (req.body.icono_fa !== undefined ? req.body.icono_fa : existente.icono_fa).trim();
    if (!nombre || !iconoFa) {
        return res.status(400).json({ ok: false, message: 'El nombre y el icono son requeridos.' });
    }

    await pool.query('UPDATE nosotros_valores SET nombre = ?, icono_fa = ? WHERE id = ?', [nombre, iconoFa, id]);
    res.status(200).json({ ok: true, valor: Object.assign({}, existente, { nombre, icono_fa: iconoFa }) });
});

router.delete('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [result] = await pool.query('DELETE FROM nosotros_valores WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });
    res.status(200).json({ ok: true });
});

module.exports = router;
