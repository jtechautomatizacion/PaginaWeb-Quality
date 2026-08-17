const pool = require('../config/database');
const bcrypt = require('bcryptjs');

function isBcryptHash(value) {
    return typeof value === 'string' && value.startsWith('$2');
}

async function findByUsername(usuario) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return rows[0] || null;
}

async function verifyPassword(usuarioRow, plainPassword) {
    if (isBcryptHash(usuarioRow.contrasena)) {
        return bcrypt.compare(plainPassword, usuarioRow.contrasena);
    }
    const matches = usuarioRow.contrasena === plainPassword;
    if (matches) {
        const hash = await bcrypt.hash(plainPassword, 10);
        await pool.query('UPDATE usuarios SET contrasena = ? WHERE id = ?', [hash, usuarioRow.id]);
    }
    return matches;
}

async function setPassword(id, newPlainPassword) {
    const hash = await bcrypt.hash(newPlainPassword, 10);
    await pool.query('UPDATE usuarios SET contrasena = ?, contrasena_changed = 1 WHERE id = ?', [hash, id]);
}

module.exports = { findByUsername, verifyPassword, setPassword };
