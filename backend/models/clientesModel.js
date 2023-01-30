var pool = require('./db');

async function buscarClientes() {
    try {
        var query = "SELECT * FROM clientes ORDER BY apellido, nombres asc"; 
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function buscarClientesActivos() {
    try {
        var query = "SELECT * FROM clientes WHERE estado = 1 ORDER BY apellido, nombres asc"; 
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function buscarClientesPorIdUsuario(id_usuario) {
    try {
        var query = "SELECT * FROM clientes WHERE id_usuario = ? ORDER BY apellido, nombres asc"; 
        var rows = await pool.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function cantidadClientes() {
    try {
        var query = "SELECT COUNT(*) AS total FROM clientes"; 
        var cant = await pool.query(query);
        return cant[0].total;
    } catch (error) {
        console.log(error);
    }
}

async function buscarClientePorId(id) {
    try {
        var query = "SELECT * FROM clientes WHERE id = ?"; 
        var rows = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function buscarClientePorIdUsuario(id_usuario) {
    try {
        var query = "SELECT * FROM clientes WHERE id_usuario = ?"; 
        var rows = await pool.query(query, [id_usuario]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function agregarCliente(obj) {
    try {
        var query = "INSERT INTO clientes SET ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function eliminarClientePorId(id) {
    try {
        var query = "DELETE FROM clientes WHERE id = ?";
        var rows = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarClientePorId(obj, id) {
    try {
        var query = "UPDATE clientes SET ? WHERE id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { buscarClientes, buscarClientePorId, buscarClientesActivos, buscarClientesPorIdUsuario, 
                    buscarClientePorIdUsuario, agregarCliente, eliminarClientePorId, cantidadClientes, 
                    modificarClientePorId }
