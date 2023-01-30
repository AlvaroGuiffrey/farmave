var express = require('express');
var router = express.Router();
var md5 = require('md5');
var clientesModel = require('./../../models/clientesModel');
var usuariosModel = require('./../../models/usuariosModel');

/* GET cliente nuevo. */
router.get('/nuevo', async (req, res, next) => {
    var cantidad = await clientesModel.cantidadClientes();
    var estado = "";
    let title = "FarmaVE-Clientes";
    var info = true;
    var mensajeInfo = "¡Bienvenido!. Ingrese sus datos.";
  
    res.render('admin/cliente/nuevo', {
      layout: 'admin/layout',
      cantidad,
      info,
      mensajeInfo,
      estado,
      title
    });
  
  });

/* POST agregar cliente nuevo a la DB. */
router.post('/nuevo', async (req, res, next) => {
  try {
    var cantidad = await clientesModel.cantidadClientes();
    let title = "FarmaVE-Clientes";
    var conf = true;

    if (req.body.nombres != "" && req.body.apellido != "" &&
        req.body.domicilio != "" && req.body.localidad != "" &&
        req.body.celular != "" && req.body.mail != "" && req.body.usuario != "" &&
        req.body.pass != "" && req.body.passRep != "") {
        
        var usuario = await usuariosModel.buscarUsuarioPorUsuario(req.body.usuario);
        
        if (usuario) {
          conf = false;
          res.render('admin/cliente/nuevo', {
            layout: 'admin/layout',
            cantidad,
            error: true,
            mensaje: 'El usuario '+ req.body.usuario +' ya existe. Ingrese otro usuario.',
            title
          });
        }

        if (req.body.pass != req.body.passRep) {
          conf = false;
          res.render('admin/cliente/nuevo', {
            layout: 'admin/layout',
            cantidad,
            error: true,
            mensaje: 'Las contraseñas ingresadas son diferentes.',
            title
          });
        }

        if (conf) {
              
          let obj = {
            usuario: req.body.usuario,
            clave: md5(req.body.pass),
            tipo: 1,
            estado: 1
          }
          await usuariosModel.agregarUsuario(obj);
          var usuario = await usuariosModel.buscarUsuarioPorUsuario(req.body.usuario);

          let objCliente = {
            id_usuario: usuario.id,
            nombres: req.body.nombres,
            apellido: req.body.apellido,
            domicilio: req.body.domicilio, 
            localidad: req.body.localidad,
            celular: req.body.celular,
            mail: req.body.mail,
            estado: 1
          }
          await clientesModel.agregarCliente(objCliente);

          res.render('admin/login/login', {
            layout: 'admin/layout',
            info: true,
            mensajeInfo: 'Debe loguearse para iniciar sesión.',
            suceso: true,
            mensajeSuceso: '¡Bienvenido '+ req.body.nombres +', gracias por registrarse!.'
          }); 
        } else {
          res.render('admin/cliente/nuevo', {
            layout: 'admin/layout',
            cantidad,
            error: true,
            mensaje: 'Problema en datos ingresados.',
            title
          });
        }
      } else {
        res.render('admin/cliente/nuevo', {
          layout: 'admin/layout',
          cantidad,
          error: true,
          mensaje: 'Todos los campos son requeridos.',
          title
        });
    }
  } catch (error) {
    console.log(error);
    let title = "FarmaVE-Clientes";
    res.render('admin/cliente/nuevo', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      error: true,
      mensaje: 'No se cargó el cliente.',
      cantidad,
      title
    });
  }
})
  
  module.exports = router;
  