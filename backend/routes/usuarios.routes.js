const express = require('express');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuarios.model');
const { loginRateLimit, recordFailedAttempt, clearAttempts } = require('../middleware/loginRateLimit.middleware');

const router = express.Router();

router.post('/login', loginRateLimit, async (req, res) => {
    const username = (req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
        return res.status(400).json({ ok: false, message: 'Usuario y contrasena son requeridos.' });
    }

    const usuario = await usuariosModel.findByUsername(username);
    const valido = usuario && (await usuariosModel.verifyPassword(usuario, password));

    if (!valido) {
        recordFailedAttempt(req.__lockfile);
        return res.status(401).json({ ok: false, message: 'Usuario o contrasena incorrectos.' });
    }

    clearAttempts(req.__lockfile);

    const forceChange = !usuario.contrasena_changed;
    const token = jwt.sign({ id: usuario.id, usuario: usuario.usuario }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
        ok: true,
        token,
        redirect: forceChange ? 'cambiar_contrasena.html' : 'admin.html',
        force_change_password: forceChange
    });
});

router.post('/cambiar_contrasena', async (req, res) => {
    const username = (req.body.username || '').trim();
    const oldPassword = String(req.body.old_password || '');
    const newPassword = String(req.body.new_password || '');

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ ok: false, message: 'Todos los campos son requeridos.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ ok: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    const usuario = await usuariosModel.findByUsername(username);
    const valido = usuario && (await usuariosModel.verifyPassword(usuario, oldPassword));
    if (!valido) {
        return res.status(401).json({ ok: false, message: 'Usuario o contraseña actual incorrectos.' });
    }

    await usuariosModel.setPassword(usuario.id, newPassword);
    res.status(200).json({ ok: true, message: 'Contraseña actualizada correctamente.', redirect: 'admin.html' });
});

module.exports = router;
