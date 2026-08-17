const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ ok: false, message: 'No autorizado. Inicia sesion nuevamente.' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, message: 'Sesion invalida o expirada. Inicia sesion nuevamente.' });
    }
}

module.exports = { requireAuth };
