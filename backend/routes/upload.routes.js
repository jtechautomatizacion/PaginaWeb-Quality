const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { UPLOADS_ROOT, PROJECT_ROOT, deleteIfUploaded } = require('../utils/uploadedFile');

const router = express.Router();
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
const ALLOWED_TABLES = ['servicios', 'proyectos', 'cursos', 'investigacion', 'acreditaciones', 'clientes', 'nosotros_staff', 'nosotros_bloques', 'docentes'];
const IMAGE_SIGNATURES = [
    Buffer.from([0xff, 0xd8, 0xff]), // jpg
    Buffer.from([0x89, 0x50, 0x4e, 0x47]), // png
    Buffer.from('GIF87a'), Buffer.from('GIF89a'), // gif
    Buffer.from('RIFF') // webp (RIFF....WEBP)
];

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES } });

function isValidImage(buffer) {
    return IMAGE_SIGNATURES.some((sig) => buffer.slice(0, sig.length).equals(sig));
}

router.post('/', upload.single('file'), (req, res) => {
    const tabla = req.body.tabla || '';
    if (!ALLOWED_TABLES.includes(tabla)) {
        return res.status(400).json({ ok: false, message: 'Coleccion no valida.' });
    }

    if (!req.file) {
        return res.status(400).json({ ok: false, message: 'No se recibio ningun archivo.' });
    }

    const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
        return res.status(400).json({ ok: false, message: 'Formato no permitido. Usa JPG, PNG, GIF, WEBP o PDF.' });
    }

    let archivoTipo = 'imagen';
    if (ext === 'pdf') {
        archivoTipo = 'pdf';
        if (req.file.buffer.slice(0, 5).toString('utf8') !== '%PDF-') {
            return res.status(400).json({ ok: false, message: 'El archivo no es un PDF valido.' });
        }
    } else if (!isValidImage(req.file.buffer)) {
        return res.status(400).json({ ok: false, message: 'El archivo no es una imagen valida.' });
    }

    const uploadsDir = path.join(UPLOADS_ROOT, tabla);
    fs.mkdirSync(uploadsDir, { recursive: true });

    const nombreArchivo = `${tabla}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    fs.writeFileSync(path.join(uploadsDir, nombreArchivo), req.file.buffer);

    const urlPublica = `assets/uploads/${tabla}/${nombreArchivo}`;
    deleteIfUploaded(req.body.anterior || '');

    res.status(200).json({ ok: true, url: urlPublica, tipo: archivoTipo });
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ ok: false, message: 'El archivo supera el limite de 10MB.' });
    }
    res.status(500).json({ ok: false, message: 'No se pudo guardar el archivo.' });
});

module.exports = router;
