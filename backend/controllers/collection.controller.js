const collectionModel = require('../models/collection.model');

function makeCollectionController({ table, itemName, defaultImagen, extraFields, getBySlugFn }) {
    return {
        async list(req, res) {
            try {
                if (req.query.slug && getBySlugFn) {
                    const item = await getBySlugFn(req.query.slug);
                    if (!item) return res.status(404).json({ ok: false, message: 'No encontrado.' });
                    return res.status(200).json(item);
                }
                const rows = await collectionModel.getAll(table);
                res.status(200).json(rows);
            } catch (err) {
                res.status(500).json({ ok: false, message: `No se pudo leer ${table}.` });
            }
        },

        async create(req, res) {
            if (!req.body.titulo) {
                return res.status(400).json({ ok: false, message: 'El titulo es requerido.' });
            }
            try {
                const item = await collectionModel.create(table, defaultImagen, req.body, extraFields);
                res.status(201).json({ ok: true, [itemName]: item });
            } catch (err) {
                res.status(500).json({ ok: false, message: `No se pudo crear el registro en ${table}.` });
            }
        },

        async update(req, res) {
            if (!req.body.titulo) {
                return res.status(400).json({ ok: false, message: 'El titulo es requerido.' });
            }
            try {
                const item = await collectionModel.update(table, req.query.id, req.body, extraFields);
                if (!item) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });
                res.status(200).json({ ok: true, [itemName]: item });
            } catch (err) {
                res.status(500).json({ ok: false, message: `No se pudo actualizar el registro en ${table}.` });
            }
        },

        async remove(req, res) {
            try {
                const ok = await collectionModel.remove(table, req.query.id);
                if (!ok) return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });
                res.status(200).json({ ok: true });
            } catch (err) {
                res.status(500).json({ ok: false, message: `No se pudo eliminar el registro en ${table}.` });
            }
        }
    };
}

module.exports = { makeCollectionController };
