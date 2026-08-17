require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { requireAuth } = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
    console.error('FALTA JWT_SECRET en .env. El servidor no puede iniciar sin esta variable.');
    process.exit(1);
}

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PUBLIC_API_PATHS = ['/login', '/cambiar_contrasena'];
app.use('/api', (req, res, next) => {
    if (req.method === 'GET') return next();
    if (PUBLIC_API_PATHS.includes(req.path)) return next();
    return requireAuth(req, res, next);
});

app.use('/api/servicios', require('./routes/servicios.routes'));
app.use('/api/proyectos', require('./routes/proyectos.routes'));
app.use('/api/investigacion', require('./routes/investigacion.routes'));
app.use('/api/cursos', require('./routes/cursos.routes'));
app.use('/api/docentes', require('./routes/docentes.routes'));
app.use('/api/acreditaciones', require('./routes/acreditaciones.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/estadisticas', require('./routes/estadisticas.routes'));
app.use('/api/contenido', require('./routes/contenido.routes'));
app.use('/api/nosotros_bloques', require('./routes/nosotrosBloques.routes'));
app.use('/api/nosotros_valores', require('./routes/nosotrosValores.routes'));
app.use('/api/nosotros_staff', require('./routes/nosotrosStaff.routes'));
app.use('/api/nosotros_trayectoria', require('./routes/nosotrosTrayectoria.routes'));
app.use('/api/reportes', require('./routes/reportes.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api', require('./routes/usuarios.routes'));

app.use((req, res) => {
    res.status(404).json({ ok: false, message: 'Ruta no encontrada.' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
    console.log(`API backend escuchando en http://localhost:${PORT}`);
});
