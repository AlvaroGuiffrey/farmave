var pool = require('./db');

async function buscarPromociones() {
    try {
        var query = "SELECT * FROM promociones ORDER BY id desc"; 
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function cantidadPromociones() {
    try {
        var query = "SELECT COUNT(*) AS total FROM promociones"; 
        var cant = await pool.query(query);
        return cant[0].total;
    } catch (error) {
        console.log(error);
    }
}

async function buscarPromocionesActivas() {
    try {
        var query = "SELECT * FROM promociones WHERE estado = 1 ORDER BY nombre"; 
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function buscarPromocionPorId(id) {
    try {
        var query = "SELECT * FROM promociones WHERE id = ?"; 
        var rows = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function agregarPromocion(obj) {
    try {
        var query = "INSERT INTO promociones SET ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function eliminarPromocionPorId(id) {
    try {
        var query = "DELETE FROM promociones WHERE id = ?";
        var rows = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarPromocionPorId(obj, id) {
    try {
        var query = "UPDATE promociones SET ? WHERE id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarCantidadPromocionPorId(cantidad, id) {
    try {
        var query = "UPDATE promociones SET cantidad = ? WHERE id = ?";
        var rows = await pool.query(query, [cantidad, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { buscarPromociones, buscarPromocionesActivas, buscarPromocionPorId, 
                    agregarPromocion, eliminarPromocionPorId, cantidadPromociones, 
                    modificarPromocionPorId, modificarCantidadPromocionPorId }
