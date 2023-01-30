var express = require('express');
var router = express.Router();
var md5 = require('md5');
var usuariosModel = require('./../../models/usuariosModel');

/* GET admin usuarios. */
router.get('/', async function(req, res, next) {
  var usuarios = await usuariosModel.buscarUsuarios();
  var cantidad = await usuariosModel.cantidadUsuarios();
  let title = "FarmaVE-Usuarios";
    
  if (req.session.nombre != "") {
    
    if (req.session && req.session.tipo == 3)
      res.render('admin/usuarios', { 
        layout: 'admin/layout',
        usuario: req.session.nombre,
        usuarios,
        cantidad,
        title
      });
    else
      res.render('admin/usuarios', { 
        layout: 'admin/layout',
        usuario: req.session.nombre,
        alerta: true,
        alertaTipo: "warning",
        mensaje: "Solo un usuario administrador puede ingresar a Usuarios.",
        cantidad,
        title
      });
       
  } else {
      res.render('admin/login', {
        layout: 'admin/layout',
        error: true
      });
  }
});

/* GET agregar usuario. */
router.get('/agregarUsuario', async (req, res, next) => {
  if (req.session.nombre != "") {
    var cantidad = await usuariosModel.cantidadUsuarios();
    var estado = "";
    let title = "FarmaVE-Usuarios";
   
    res.render('admin/agregarUsuario', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      alerta: false,
      alertaTipo: "info",
      mensaje: "",
      estado,
      title
    });
  } else {
    res.render('admin/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* POST agregar usuario a la DB. */
router.post('/agregarUsuario', async (req, res, next) => {
  try {
    if (req.body.usuario != "" && req.body.clave != "" ) {
      let obj = {
        usuario: req.body.usuario,
        clave: md5(req.body.clave),
        tipo: req.body.tipo,
        estado: 1
      }
      await usuariosModel.agregarUsuario(obj);
      res.redirect('/admin/usuarios');  
    } else {
      let title = "FarmaVE-Usuarios";
      res.render('admin/agregarUsuario', {
        layout: 'admin/layout',
        alerta: true,
        alertaTipo: "warning",
        mensaje: 'Todos los campos son requeridos.',
        title 
      });
    }
  } catch (error) {
    console.log(error);
    let title = "FarmaVE-Usuarios";
    res.render('admin/agregarUsuario', {
      layout: 'admin/layout',
      alerta: true,
      alertaTipo: "danger",
      mensaje: 'No se cargó la novedad.',
      title 
    });
  }
})

/* GET eliminar usuario. */
router.get('/eliminarUsuario/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    if (req.session.tipo == 3) {
      var id = req.params.id;
      await usuariosModel.eliminarUsuarioPorId(id);
      res.redirect('/admin/usuarios'); 
    } else {
      var usuarios = await usuariosModel.buscarUsuarios();
      var cantidad = await usuariosModel.cantidadUsuarios();
      let title = "FarmaVE-Usuarios";

      res.render('admin/usuarios', {
        layout: 'admin/layout',
        alerta: true,
        alertaTipo: "info",
        mensaje: "No tiene autorización para ELIMINAR una Novedad.",
        usuarios,
        cantidad,
        title
      });
    }
        
  } else {
    res.render('admin/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* GET editar usuario. */
router.get('/editarUsuario/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var id = req.params.id;
    var cantidad = await usuariosModel.cantidadUsuarios();
    var dato = await usuariosModel.buscarUsuarioPorId(id);
    var estado = sel1 = sel2 = sel3 = "";
    let title = "FarmaVE-Usuarios";

    switch (dato.tipo) {
      case 1:
        sel1 = "selected";
        break;
      case 2:
        sel2 = "selected";
        break;
      case 3:
        sel3 = "selected";
        break;
      default:
        sel1 = sel2 = sel3 = "";
        break;
    }
        
    res.render('admin/editarUsuario', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      dato,
      sel1, sel2, sel3,
      alerta: false,
      alertaTipo: "info",
      mensaje: "",
      estado,
      title
    });
      
  } else {
    res.render('admin/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* POST editar novedad. */
router.post('/editarUsuario', async (req, res, next) => {
  try {
    let obj = {
      usuario: req.body.usuario,
      clave: md5(req.body.clave),
      tipo: req.body.tipo,
      estado: 1
    }
    await usuariosModel.modificarUsuarioPorId(obj, req.body.id);
    res.redirect('/admin/usuarios');

  } catch (error) {
    console.log(error);
    var id = req.body.id;
    var cantidad = await usuariosModel.cantidadUsuarios();
    var dato = await usuariosModel.buscarUsuarioPorId(id);
    var estado = "";
    var mensaje = "No se pudo modificar este Usuario.";
    let title = "FarmaVE-Usuarios";

    var estado = sel1 = sel2 = sel3 = "";
    switch (dato.tipo) {
      case 1:
        sel1 = "selected";
        break;
      case 2:
        sel2 = "selected";
        break;
      case 3:
        sel3 = "selected";
        break;
      default:
        sel1 = sel2 = sel3 = "";
        break;
    }
         
    res.render('admin/editarUsuario', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      dato,
      sel1, sel2, sel3,
      alerta: false,
      alertaTipo: "info",
      mensaje: "",
      estado,
      title
    });
  }
  
})

module.exports = router;
