const { makeCollectionRouter } = require('./collection.routes');
const docentesModel = require('../models/docentes.model');

module.exports = makeCollectionRouter({
    table: 'docentes',
    itemName: 'docente',
    defaultImagen: 'https://placehold.co/250x250/D4E3F0/D4E3F0',
    getBySlugFn: docentesModel.getDetailBySlug,
    extraFields: (body, existente) => ({
        role: body.role !== undefined ? body.role : (existente ? existente.role : ''),
        bio: body.bio !== undefined ? body.bio : (existente ? existente.bio : ''),
        linkedin: body.linkedin !== undefined ? body.linkedin : (existente ? existente.linkedin : '')
    })
});
