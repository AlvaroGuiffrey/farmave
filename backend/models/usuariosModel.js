var pool = require('./db');
var md5 = require('md5');

async function buscarUsuarioPorUsuarioYClave(usuario, clave) {
    try {
        var query = "SELECT * FROM usuarios WHERE usuario=? AND clave=? LIMIT 1"; 
        var rows = await pool.query(query, [usuario, md5(clave)]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function buscarUsuarioPorId(id) {
    try {
        var query = "SELECT * FROM usuarios WHERE id=?"; 
        var rows = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function buscarUsuarioPorUsuario(usuario) {
    try {
        var query = "SELECT * FROM usuarios WHERE usuario=?"; 
        var rows = await pool.query(query, [usuario]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function buscarUsuarios() {
    try {
        var query = "SELECT * FROM usuarios"; 
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function cantidadUsuarios() {
    try {
        var query = "SELECT COUNT(*) AS total FROM usuarios"; 
        var cant = await pool.query(query);
        return cant[0].total;
    } catch (error) {
        console.log(error);
    }
}

async function agregarUsuario(obj) {
    try {
        var query = "INSERT INTO usuarios SET ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function eliminarUsuarioPorId(id) {
    try {
        var query = "DELETE FROM usuarios WHERE id = ?";
        var rows = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarUsuarioPorId(obj, id) {
    try {
        var query = "UPDATE usuarios SET ? WHERE id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { buscarUsuarioPorUsuarioYClave, buscarUsuarioPorId, buscarUsuarioPorUsuario, 
                    buscarUsuarios, cantidadUsuarios, agregarUsuario, eliminarUsuarioPorId, 
                    modificarUsuarioPorId }
