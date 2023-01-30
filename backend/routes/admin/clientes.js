var express = require('express');
var router = express.Router();
var clientesModel = require('./../../models/clientesModel');
var usuariosModel = require('./../../models/usuariosModel');

/* GET admin clientes. */
router.get('/', async function(req, res, next) {
  if (req.session || req.session.nombre != "") {
    
    var clientes = "";
    if (req.session.tipo == 1) {
      clientes = await clientesModel.buscarClientesPorIdUsuario(req.session.id_usuario);
    } else {
      clientes = await clientesModel.buscarClientes();
    }
    
    var cantidad = await clientesModel.cantidadClientes();
    let title = "FarmaVE-Clientes";
    
    var autEditar = autEliminar = false;
    switch (req.session.tipo) {
      case 3:
        autEditar = autEliminar = true;
        btAgregar = true;
        break;
      case 2:
        autEditar = autEliminar = false;
        btAgregar = false;
        break;
      default:
        autEditar = autEliminar = true;
        btAgregar = false;
        break;
    }
    
    res.render('admin/clientes', { 
      layout: 'admin/layout',
      usuario: req.session.nombre,
      clientes,
      cantidad,
      autEditar,
      autEliminar,
      btAgregar,
      title
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});

/* GET agregar cliente. */
router.get('/agregar', async (req, res, next) => {
  if (req.session.nombre != "") {
    let title = "FarmaVE-Clientes";
    var cantidad = await clientesModel.cantidadClientes();
    var estado = "";
    
    if (req.session.tipo == 2) {
      var info = true;
      var mensajeInfo = "No tiene la autorización para agregar un cliente.";
      var estado = "disabled";
    }

    res.render('admin/cliente/agregar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      id_usuario: req.session.id_usuario,
      cantidad,
      info,
      mensajeInfo,
      estado,
      title
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* POST agregar cliente a la DB. */
router.post('/agregar', async (req, res, next) => {
  try {
    var cantidad = await clientesModel.cantidadClientes();

    if (req.body.nombres != "" && req.body.apellido != "" &&
        req.body.domicilio != "" && req.body.localidad != "" &&
        req.body.celular != "" && req.body.mail != "") {
        await clientesModel.agregarCliente(req.body);
        res.redirect('/admin/clientes');  
    } else {
      res.render('admin/cliente/agregar', {
        layout: 'admin/layout',
        cantidad,
        usuario: req.session.nombre,
        error: true,
        mensaje: 'Todos los campos son requeridos.',
        title
      });
    }
  } catch (error) {
    console.log(error);
    let title = "FarmaVE-Clientes";
    res.render('admin/cliente/agregar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      error: true,
      mensaje: 'No se cargó el cliente.',
      cantidad,
      title
    });
  }
})


/* GET ver cliente. */
router.get('/ver/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var cantidad = await clientesModel.cantidadClientes();
    var cliente = await clientesModel.buscarClientePorId(req.params.id);
    let title = "FarmaVE-Clientes";
          
    res.render('admin/cliente/ver', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      idCliente: req.params.id,
      cantidad,
      cliente,
      title
      
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* GET eliminar cliente. */
router.get('/eliminar/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    if (req.session.tipo == 3 || req.session.tipo == 1) {
      var id = req.params.id;
      
      await clientesModel.eliminarClientePorId(id);
      res.redirect('/admin/clientes'); 
    } else {
      var clientes = await clientesModel.buscarClientes();
      var cantidad = await clientesModel.cantidadClientes();
      let title = "FarmaVE-Clientes";

      res.render('admin/clientes', {
        layout: 'admin/layout',
        error: true,
        mensaje: "No tiene autorización para ELIMINAR una Promoción.",
        clientes,
        cantidad,
        title
      });
    }
        
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* GET editar cliente. */
router.get('/editar/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var id = req.params.id;
    var cantidad = await clientesModel.cantidadClientes();
    var cliente = await clientesModel.buscarClientePorId(id);
    var estado = "";
    let title = "FarmaVE-Clientes";
    
    if (req.session.tipo == 2) {
      var info = true;
      var mensajeInfo = "No puede EDITAR esta Promoción, no es cliente ni administrador.";
      var estado = "disabled";
    }
        
    console.log(req.params.id);
    
    res.render('admin/cliente/editar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      cliente,
      idCliente: req.params.id,
      info,
      mensajeInfo,
      estado,
      title
    });
      
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* POST editar cliente. */
router.post('/editar', async (req, res, next) => {
  try {
    
    let obj = {
      id_usuario: req.body.id_usuario,  
      nombres: req.body.nombres,
      apellido: req.body.apellido,
      domicilio: req.body.domicilio,
      localidad: req.body.localidad,
      celular: req.body.celular,
      mail: req.body.mail,
      estado: req.body.estado
    }

    await clientesModel.modificarClientePorId(obj, req.body.id);
    res.redirect('/admin/clientes');

  } catch (error) {
    console.log(error);
    var id = req.body.id;
    var cantidad = await clientesModel.cantidadClientes();
    var cliente = await clientesModel.buscarClientePorId(id);
    var estado = "";
    var mensaje = "No se pudo modificar este Cliente.";
    let title = "FarmaVE-Clientes";
         
    res.render('admin/cliente/editar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      cliente,
      idCliente: req.body.id,
      error: true,
      mensaje,
      estado,
      title
    });
  }
  
})

module.exports = router;
