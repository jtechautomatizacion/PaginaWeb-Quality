const { makeCollectionRouter } = require('./collection.routes');

module.exports = makeCollectionRouter({
    table: 'cursos',
    itemName: 'curso',
    defaultImagen: 'https://placehold.co/84x56/eceff4/eceff4',
    extraFields: (body, existente) => ({
        modalidad: body.modalidad !== undefined ? body.modalidad : (existente ? existente.modalidad : ''),
        duracion: body.duracion !== undefined ? body.duracion : (existente ? existente.duracion : ''),
        nivel: body.nivel !== undefined ? body.nivel : (existente ? existente.nivel : ''),
        inversion: body.inversion !== undefined ? body.inversion : (existente ? existente.inversion : ''),
        docente_id: body.docente_id ? body.docente_id : (existente ? existente.docente_id : null),
        contenido: body.contenido !== undefined ? body.contenido : (existente ? existente.contenido : '')
    })
});
