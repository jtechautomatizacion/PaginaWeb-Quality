const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM nosotros_trayectoria ORDER BY orden ASC');
    res.status(200).json(rows);
});

router.put('/', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, message: 'ID requerido.' });

    const [rows] = await pool.query('SELECT * FROM nosotros_trayectoria WHERE id = ?', [id]);
    const existente = rows[0];
    if (!existente) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });

    const numero = (req.body.numero !== undefined ? req.body.numero : existente.numero).trim();
    const etiqueta = (req.body.etiqueta !== undefined ? req.body.etiqueta : existente.etiqueta).trim();
    if (!numero || !etiqueta) {
        return res.status(400).json({ ok: false, message: 'El numero y la etiqueta son requeridos.' });
    }

    const item = {
        id,
        numero,
        sufijo: req.body.sufijo !== undefined ? req.body.sufijo : existente.sufijo,
        etiqueta,
        enlace_texto: req.body.enlace_texto !== undefined ? req.body.enlace_texto : existente.enlace_texto,
        enlace_url: req.body.enlace_url !== undefined ? req.body.enlace_url : existente.enlace_url
    };

    await pool.query(
        'UPDATE nosotros_trayectoria SET numero = ?, sufijo = ?, etiqueta = ?, enlace_texto = ?, enlace_url = ? WHERE id = ?',
        [item.numero, item.sufijo, item.etiqueta, item.enlace_texto, item.enlace_url, id]
    );
    res.status(200).json({ ok: true, trayectoria: Object.assign({}, existente, item) });
});

module.exports = router;
