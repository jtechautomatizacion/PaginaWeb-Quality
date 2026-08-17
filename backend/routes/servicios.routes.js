const { makeCollectionRouter } = require('./collection.routes');

module.exports = makeCollectionRouter({
    table: 'servicios',
    itemName: 'servicio',
    defaultImagen: 'https://placehold.co/640x480/e9edf5/e9edf5',
    extraFields: (body, existente) => ({
        contenido: body.contenido !== undefined ? body.contenido : (existente ? existente.contenido : null),
        incluye: body.incluye !== undefined ? JSON.stringify(body.incluye) : (existente ? (existente.incluye ?? '[]') : '[]'),
        galeria: body.galeria !== undefined ? JSON.stringify(body.galeria) : (existente ? (existente.galeria ?? '[]') : '[]'),
        intro_imagen: body.intro_imagen !== undefined ? body.intro_imagen : (existente ? existente.intro_imagen : ''),
        destacado: body.destacado !== undefined ? (body.destacado ? 1 : 0) : (existente ? Number(existente.destacado) || 0 : 0)
    })
});
