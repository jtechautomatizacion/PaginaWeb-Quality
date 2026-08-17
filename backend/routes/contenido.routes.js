const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT clave, valor FROM contenido_sitio');
    const result = {};
    rows.forEach((row) => { result[row.clave] = row.valor; });
    res.status(200).json(result);
});

router.put('/', async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : null;
    if (!body) return res.status(400).json({ ok: false, message: 'Datos invalidos.' });

    for (const clave of Object.keys(body)) {
        const valor = String(body[clave]);
        await pool.query(
            'INSERT INTO contenido_sitio (clave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = ?',
            [String(clave), valor, valor]
        );
    }
    res.status(200).json({ ok: true });
});

module.exports = router;
