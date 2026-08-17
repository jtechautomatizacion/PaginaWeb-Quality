const pool = require('../config/database');
const { slugify, todayDisplay, newTimestamp } = require('../utils/helpers');

async function getAll(table) {
    const [rows] = await pool.query(`SELECT * FROM \`${table}\` ORDER BY timestamp DESC`);
    return rows;
}

async function create(table, defaultImagen, body, extraFields) {
    const timestamp = newTimestamp();
    const item = Object.assign({
        id: timestamp,
        titulo: body.titulo,
        slug: slugify(body.titulo),
        resumen: body.resumen || '',
        imagen: body.imagen || defaultImagen,
        estado: body.estado === 'draft' ? 'draft' : 'published',
        fecha: todayDisplay(),
        timestamp
    }, extraFields ? extraFields(body, null) : {});

    const keys = Object.keys(item);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.map((k) => `\`${k}\``).join(', ');
    await pool.query(`INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`, keys.map((k) => item[k]));
    return item;
}

async function update(table, id, body, extraFields) {
    const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`, [id]);
    const existente = rows[0];
    if (!existente) return null;

    const actualizado = Object.assign({}, existente, {
        titulo: body.titulo,
        slug: slugify(body.titulo),
        resumen: body.resumen || '',
        imagen: body.imagen || existente.imagen,
        fecha: body.fecha || existente.fecha
    }, extraFields ? extraFields(body, existente) : {});

    const keys = Object.keys(actualizado).filter((k) => k !== 'id');
    const setClause = keys.map((k) => `\`${k}\` = ?`).join(', ');
    await pool.query(`UPDATE \`${table}\` SET ${setClause} WHERE id = ?`, [...keys.map((k) => actualizado[k]), id]);
    return actualizado;
}

async function remove(table, id) {
    const [result] = await pool.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
    return result.affectedRows > 0;
}

module.exports = { getAll, create, update, remove };
