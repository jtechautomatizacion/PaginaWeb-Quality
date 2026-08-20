const path = require('node:path');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const USUARIOS_PATH = path.join(ROOT, 'usuarios.json');
const SERVICIOS_PATH = path.join(ROOT, 'servicios.json');
const PROYECTOS_PATH = path.join(ROOT, 'proyectos.json');
const INVESTIGACION_PATH = path.join(ROOT, 'investigacion.json');
const CURSOS_PATH = path.join(ROOT, 'cursos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    const allowedOrigins = ['https://grouptqualityc.com.pe', 'https://api.grouptqualityc.com.pe', 'http://localhost'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

const BLOCKED_PATHS = [/^\/\.env/i, /^\/\.git(\/|$)/i, /^\/usuarios\.json$/i];

app.use((req, res, next) => {
    if (BLOCKED_PATHS.some((pattern) => pattern.test(req.path))) {
        return res.status(403).send('Forbidden');
    }
    next();
});

app.get('/editor-admin', (req, res) => {
    res.sendFile(path.join(ROOT, 'editor_admin.html'));
});
app.get('/reportes-admin', (req, res) => {
    res.sendFile(path.join(ROOT, 'reportes_admin.html'));
});
app.get('/perfil-admin', (req, res) => {
    res.sendFile(path.join(ROOT, 'perfil_admin.html'));
});

app.use(express.static(ROOT, { extensions: ['html'] }));
app.use('/css', express.static(path.join(ROOT, 'css')));
app.use('/js', express.static(path.join(ROOT, 'js')));
app.use('/assets', express.static(path.join(ROOT, 'assets')));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ ok: false, message: 'Usuario y contrasena son requeridos.' });
    }

    let data;
    try {
        const raw = await fs.readFile(USUARIOS_PATH, 'utf-8');
        data = JSON.parse(raw);
    } catch (err) {
        return res.status(500).json({ ok: false, message: 'No se pudo verificar las credenciales.' });
    }

    const usuarioValido = (data.usuarios || []).some(
        (u) => u.usuario === username && u.contrasena === password
    );

    if (!usuarioValido) {
        return res.status(401).json({ ok: false, message: 'Usuario o contrasena incorrectos.' });
    }

    return res.status(200).json({ ok: true, redirect: '/admin.html' });
});

const ACCENT_MAP = { a: 'áàäâ', e: 'éèëê', i: 'íìïî', o: 'óòöô', u: 'úùüû', n: 'ñ' };

function slugify(text) {
    let result = String(text || '').toLowerCase();
    Object.keys(ACCENT_MAP).forEach((plain) => {
        ACCENT_MAP[plain].split('').forEach((accented) => {
            result = result.split(accented).join(plain);
        });
    });
    return result
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function todayDisplay() {
    const d = new Date();
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

function registerCollectionRoutes(apiName, itemName, filePath, defaultImagen, buildItem) {
    app.get('/api/' + apiName, (req, res) => {
        try {
            const raw = fsSync.readFileSync(filePath, 'utf-8');
            res.status(200).json(JSON.parse(raw));
        } catch (err) {
            res.status(500).json({ ok: false, message: 'No se pudo leer ' + apiName + '.json.' });
        }
    });

    app.post('/api/' + apiName, (req, res) => {
        const titulo = req.body.titulo;
        if (!titulo) {
            return res.status(400).json({ ok: false, message: 'El titulo es requerido.' });
        }

        let items;
        try {
            items = JSON.parse(fsSync.readFileSync(filePath, 'utf-8'));
        } catch (err) {
            items = [];
        }

        const timestamp = Date.now();
        const nuevoItem = Object.assign({
            id: timestamp,
            titulo,
            slug: slugify(titulo),
            resumen: req.body.resumen || '',
            imagen: req.body.imagen || defaultImagen,
            estado: req.body.estado === 'draft' ? 'draft' : 'published',
            fecha: todayDisplay(),
            timestamp
        }, buildItem ? buildItem(req.body) : {});

        items.push(nuevoItem);
        fsSync.writeFileSync(filePath, JSON.stringify(items, null, 2));

        const response = { ok: true };
        response[itemName] = nuevoItem;
        res.status(201).json(response);
    });

    app.put('/api/' + apiName + '/:id', (req, res) => {
        const titulo = req.body.titulo;
        if (!titulo) {
            return res.status(400).json({ ok: false, message: 'El titulo es requerido.' });
        }

        let items;
        try {
            items = JSON.parse(fsSync.readFileSync(filePath, 'utf-8'));
        } catch (err) {
            items = [];
        }

        const idx = items.findIndex((it) => String(it.id) === String(req.params.id));
        if (idx === -1) {
            return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });
        }

        const existente = items[idx];
        const actualizado = Object.assign({}, existente, {
            titulo,
            slug: slugify(titulo),
            resumen: req.body.resumen || '',
            imagen: req.body.imagen || existente.imagen
        }, buildItem ? buildItem(req.body) : {});

        items[idx] = actualizado;
        fsSync.writeFileSync(filePath, JSON.stringify(items, null, 2));

        const response = { ok: true };
        response[itemName] = actualizado;
        res.status(200).json(response);
    });

    app.delete('/api/' + apiName + '/:id', (req, res) => {
        let items;
        try {
            items = JSON.parse(fsSync.readFileSync(filePath, 'utf-8'));
        } catch (err) {
            items = [];
        }

        const filtered = items.filter((it) => String(it.id) !== String(req.params.id));
        if (filtered.length === items.length) {
            return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });
        }

        fsSync.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
        res.status(200).json({ ok: true });
    });
}

registerCollectionRoutes('servicios', 'servicio', SERVICIOS_PATH, 'https://placehold.co/640x480/e9edf5/e9edf5');
registerCollectionRoutes('proyectos', 'proyecto', PROYECTOS_PATH, 'https://placehold.co/600x400/e9edf5/e9edf5', (body) => ({
    ubicacion: body.ubicacion || '',
    fecha: body.fecha || ('Ejecutado en ' + new Date().getFullYear()),
    fecha_admin: todayDisplay()
}));
registerCollectionRoutes('investigacion', 'articulo', INVESTIGACION_PATH, 'https://placehold.co/84x56/eceff4/eceff4');
registerCollectionRoutes('cursos', 'curso', CURSOS_PATH, 'https://placehold.co/84x56/eceff4/eceff4');

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
