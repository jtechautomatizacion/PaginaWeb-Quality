const { makeCollectionRouter } = require('./collection.routes');

module.exports = makeCollectionRouter({
    table: 'investigacion',
    itemName: 'articulo',
    defaultImagen: 'https://placehold.co/84x56/eceff4/eceff4',
    extraFields: (body, existente) => ({
        contenido: body.contenido !== undefined ? body.contenido : (existente ? existente.contenido : ''),
        docente: body.docente !== undefined ? body.docente : (existente ? existente.docente : '')
    })
});
