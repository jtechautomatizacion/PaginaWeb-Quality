const express = require('express');
const pool = require('../config/database');
const { newTimestamp } = require('../utils/helpers');
const { deleteIfUploaded } = require('../utils/uploadedFile');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM nosotros_staff ORDER BY orden ASC');
    res.status(200).json(rows);
});

router.post('/', async (req, res) => {
    const nombre = (req.body.nombre || '').trim();
    const cargo = (req.body.cargo || '').trim();
    if (!nombre || !cargo) {
        return res.status(400).json({ ok: false, message: 'El nombre y el cargo son requeridos.' });
    }

    const [[{ maxOrden }]] = await pool.query('SELECT COALESCE(MAX(orden), 0) AS maxOrden FROM nosotros_staff');
    const timestamp = newTimestamp();
    const item = {
        id: timestamp,
        nombre,
        cargo,
        descripcion: req.body.descripcion || '',
        imagen: req.body.imagen || '',
        orden: maxOrden + 1,
        timestamp
    };

    await pool.query(
        'INSERT INTO nosotros_staff (id, nombre, cargo, descripcion, imagen, orden, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.nombre, item.cargo, item.descripcion, item.imagen, item.orden, item.timestamp]
    );
    res.status(201).json({ ok: true, staff: item });
});

router.put('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT * FROM nosotros_staff WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    const nombre = (req.body.nombre !== undefined ? req.body.nombre : existente.nombre).trim();
    const cargo = (req.body.cargo !== undefined ? req.body.cargo : existente.cargo).trim();
    if (!nombre || !cargo) {
        return res.status(400).json({ ok: false, message: 'El nombre y el cargo son requeridos.' });
    }

    const item = {
        id,
        nombre,
        cargo,
        descripcion: req.body.descripcion !== undefined ? req.body.descripcion : existente.descripcion,
        imagen: req.body.imagen ? req.body.imagen : existente.imagen
    };

    await pool.query(
        'UPDATE nosotros_staff SET nombre = ?, cargo = ?, descripcion = ?, imagen = ? WHERE id = ?',
        [item.nombre, item.cargo, item.descripcion, item.imagen, id]
    );
    res.status(200).json({ ok: true, staff: Object.assign({}, existente, item) });
});

router.delete('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT imagen FROM nosotros_staff WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    await pool.query('DELETE FROM nosotros_staff WHERE id = ?', [id]);
    deleteIfUploaded(existente.imagen);
    res.status(200).json({ ok: true });
});

module.exports = router;
