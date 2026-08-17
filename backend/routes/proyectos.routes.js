const { makeCollectionRouter } = require('./collection.routes');
const { todayDisplay } = require('../utils/helpers');

module.exports = makeCollectionRouter({
    table: 'proyectos',
    itemName: 'proyecto',
    defaultImagen: 'https://placehold.co/600x400/e9edf5/e9edf5',
    extraFields: (body, existente) => ({
        ubicacion: body.ubicacion !== undefined ? body.ubicacion : (existente ? existente.ubicacion : ''),
        fecha: body.fecha || (existente ? existente.fecha : ('Ejecutado en ' + new Date().getFullYear())),
        fecha_admin: todayDisplay(),
        categoria: body.categoria !== undefined ? body.categoria : (existente ? existente.categoria : ''),
        empresa: body.empresa !== undefined ? body.empresa : (existente ? existente.empresa : ''),
        contenido: body.contenido !== undefined ? body.contenido : (existente ? existente.contenido : '')
    })
});
