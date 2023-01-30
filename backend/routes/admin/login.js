var express = require('express');
var router = express.Router();
var md5 = require('md5');
var logger = require('morgan')
var path = require('path')

var usuariosModel = require('./../../models/usuariosModel');

/* GET login. */
router.get('/', function(req, res, next) {
  
  let title = "FarmaVE-Login";
  res.render('admin/login/login', { 
    layout: 'admin/layout',
    usuario: req.session.nombre,
    title
   });
});

/* GET logout. */
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  
  let title = "FarmaVE-Login";
  res.render('admin/login/login', { 
    layout: 'admin/layout',
    suceso: true,
    mensajeSuceso: '¡Gracias por visitarnos!. Ud a finalizado su sesión.',
    title
  });
});

/* POST login */
router.post('/', async (req, res, next) => {
  try {
    var usuario = req.body.usuario;
    var clave = req.body.clave;
    let title = "FarmaVE-Login";
    
    var data = await usuariosModel.buscarUsuarioPorUsuarioYClave(usuario, clave);

    if (data != undefined) {
      req.session.id_usuario = data.id;
      req.session.nombre = data.usuario;
      req.session.tipo = data.tipo;

      res.redirect('/admin/novedades');
    } else {
        res.render('admin/login/login', {
        layout: 'admin/layout',
        error: true,
        mensaje: 'Usuario y/o Contraseña incorrecta o inexistente.',
        title
      });
    }
  } catch (error) {
    console.log(error);
  }

})

/* GET cambiar contraseña. */
router.get('/cambiar', async (req, res, next) => {
  var cantidad = await usuariosModel.cantidadUsuarios();
  var estado = "";
  let title = "FarmaVE-Usuarios";
 
  res.render('admin/login/cambiar', {
    layout: 'admin/layout',
    cantidad,
    estado,
    title
  });

})

/* POST cambiar contraseña en la DB. */
router.post('/cambiar', async (req, res, next) => {
  try {
    var cantidad = await usuariosModel.cantidadUsuarios();
    let title = "FarmaVE-Usuarios";

    if (req.body.usuario != "" && req.body.pass != "" &&
        req.body.passNueva != "" && req.body.passRep != "") {

      var data = await usuariosModel.buscarUsuarioPorUsuarioYClave(req.body.usuario, req.body.pass);

      if (data != undefined) {
        
        if (req.body.passNueva != req.body.passRep) {
          res.render('admin/login/login', {
            layout: 'admin/layout',
            cantidad,
            error: true,
            mensaje: 'Las contraseñas nuevas ingresadas son diferentes.',
            info: true,
            mensajeInfo: 'Para modificar contraseña vuelva a intentarlo.',
            title
          });
        }
      
        let obj = {
          usuario: data.usuario,
          clave: md5(req.body.passNueva),
          tipo: data.tipo,
          estado: data.estado
        }  
        console.log(data.id);
        console.log(obj);

        await usuariosModel.modificarUsuarioPorId(obj, data.id);

        res.render('admin/login/login', {
          layout: 'admin/layout',
          cantidad,
          suceso: true,
          mensajeSuceso: '¡Modificó su contraseña con EXITO!.',
          info: true,
          mensajeInfo: 'Para ingresar debe loguearse.',
          title
        });

      } else {
        res.render('admin/login/login', {
          layout: 'admin/layout',
          error: true,
          mensaje: 'Usuario y/o Contraseña incorrecta o inexistente.',
          title
        });
      }
        
    } else {
      res.render('admin/login/login', {
        layout: 'admin/layout',
        error: true,
        mensaje: 'Todos los datos deben estar completos.',
        title
       });
    }           
       
  } catch (error) {
    console.log(error);
    let title = "FarmaVE-Loguin";
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true,
      mensaje: 'No se cambió la contraseña.',
      title
    });
  }
})

module.exports = router;
