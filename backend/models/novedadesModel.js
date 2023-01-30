var pool = require('./db');

async function buscarNovedades() {
    try {
        var query = "SELECT * FROM novedades ORDER BY id desc"; 
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function cantidadNovedades() {
    try {
        var query = "SELECT COUNT(*) AS total FROM novedades"; 
        var cant = await pool.query(query);
        return cant[0].total;
    } catch (error) {
        console.log(error);
    }
}

async function buscarNovedadPorId(id) {
    try {
        var query = "SELECT * FROM novedades WHERE id = ?"; 
        var rows = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function agregarNovedad(obj) {
    try {
        var query = "INSERT INTO novedades SET ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function eliminarNovedadPorId(id) {
    try {
        var query = "DELETE FROM novedades WHERE id = ?";
        var rows = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarNovedadPorId(obj, id) {
    try {
        var query = "UPDATE novedades SET ? WHERE id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { buscarNovedades, buscarNovedadPorId, agregarNovedad, eliminarNovedadPorId, 
                    cantidadNovedades, modificarNovedadPorId }
