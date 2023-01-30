var pool = require('./db');

async function buscarReservas() {
    try {
        var query = "SELECT * FROM reservas ORDER BY id desc"; 
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function buscarReservasDeCliente(id_cliente) {
    try {
        var query = "SELECT * FROM reservas WHERE id_cliente = ? ORDER BY id desc"; 
        var rows = await pool.query(query, [id_cliente]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function buscarReservasDeClientePorEstado(id_cliente, estado) {
    try {
        var query = "SELECT * FROM reservas WHERE id_cliente = ? AND estado = ? ORDER BY id desc"; 
        var rows = await pool.query(query, [id_cliente, estado]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function cantidadReservas() {
    try {
        var query = "SELECT COUNT(*) AS total FROM reservas"; 
        var cant = await pool.query(query);
        return cant[0].total;
    } catch (error) {
        console.log(error);
    }
}

async function buscarReservaPorId(id) {
    try {
        var query = "SELECT * FROM reservas WHERE id = ?"; 
        var rows = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function agregarReserva(obj) {
    try {
        var query = "INSERT INTO reservas SET ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function eliminarReservaPorId(id) {
    try {
        var query = "DELETE FROM reservas WHERE id = ?";
        var rows = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarReservaPorId(obj, id) {
    try {
        var query = "UPDATE reservas SET ? WHERE id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarReservaEstadoPorId(estado, id) {
    try {
        var query = "UPDATE reservas SET estado = ? WHERE id = ?";
        var rows = await pool.query(query, [estado, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { buscarReservas, buscarReservasDeCliente, buscarReservasDeClientePorEstado, 
                buscarReservaPorId, agregarReserva, eliminarReservaPorId, cantidadReservas, 
                modificarReservaPorId, modificarReservaEstadoPorId }
