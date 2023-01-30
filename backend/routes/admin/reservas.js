var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var promocionesModel = require('./../../models/promocionesModel');
var reservasModel = require('./../../models/reservasModel');
var clientesModel = require('./../../models/clientesModel');
var usuariosModel = require('./../../models/usuariosModel');


var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

/* GET admin reservas. */
router.get('/', async function(req, res, next) {
  if (req.session || req.session.nombre != "") {
    var reservas = '';
    if (req.session.tipo == 1) {
      cliente = await clientesModel.buscarClientePorIdUsuario(req.session.id_usuario);
      reservas = await reservasModel.buscarReservasDeCliente(cliente.id);
    } else {
      reservas = await reservasModel.buscarReservas();
    }
    var cantidad = await reservasModel.cantidadReservas();
    let title = "FarmaVE-Reservas";
   
    var autEditar = autEliminar = false;
    switch (req.session.tipo) {
      case 3:
        autEditar = autEliminar = true;
        btAgregar = true;
        break;
      case 2:
        autEditar = autEliminar = true;
        btAgregar = true;
        break;
      default:
        autEditar = autEliminar = true;
        btAgregar = false;
        break;
    }

      
    /* Codigo con problemas: no puedo buscar la promoción con el id_promo de la reserva.

    Queria traer los datos de la promoción para hacer entendible el listado de reservas
    con información como el nombre, etc
   
    */
    //  -----------------------------------------------
    console.log(reservas);
    // Implementado con for of que funciona
    /*
    for (const reserva of reservas) {
      var id = reserva.id_promo;
      console.log(id);
      var promocion = await promocionesModel.buscarPromocionPorId(id);
      console.log(promocion);
      reserva.nombrePromo = promocion.nombre;
      console.log(reserva);
      
    }
    */
    
    // Código enviado por Flavia Ursino
    reservas = await Promise.all(
      reservas.map(async reserva => {
        var id = reserva.id_promo;
        var promocion = await promocionesModel.buscarPromocionPorId(id);
        var nombrePromo = promocion.nombre;

        var cliente = await clientesModel.buscarClientePorId(reserva.id_cliente);
        var tituloCliente = cliente.apellido + ", " + cliente.nombres;
        var estadoReserva = '';
        var tituloEstado = '';
        var iconoEstado = '';
        
        switch (reserva.estado) {
          case 0:
            estadoReserva = 'Inactiva';
            tituloEstado = 'Reserva inactiva';
            iconoEstado = 'fa-circle-xmark';
           break;
          case 1:
            estadoReserva = 'Activa';
            tituloEstado = 'Reserva activa';
            iconoEstado = 'fa-cart-shopping';
            break;
          case 2:
            estadoReserva = 'Entregada';
            tituloEstado = 'Reserva entregada';
            iconoEstado = 'fa-house-circle-check';
            break;
          default:
            estadoReserva = 'Error';
            tituloEstado = 'Error en código de estado';
            iconoEstado = 'fa-circle-exclamation';
            break;
        }

        if (promocion.id_img) {
          const imagen = cloudinary.image(promocion.id_img, {
            width: 70,
            height: 70,
            crop: 'fill'
          });

          return {
            ...reserva,
            estadoReserva,
            tituloEstado,
            iconoEstado,
            tituloCliente,
            nombrePromo,
            imagen
          }

        } else {
          return {
            ...reserva,
            estadoReserva,
            tituloEstado,
            iconoEstado,
            tituloCliente,
            nombrePromo,
            imagen: ''
          }
        }
      })
    );
   
   // Fin código con problemas
   // ------------------------------------------

    res.render('admin/reservas', { 
      layout: 'admin/layout',
      usuario: req.session.nombre,
      reservas,
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

/* GET agregar reserva. */
router.get('/agregar', async (req, res, next) => {
  if (req.session.nombre != "") {
    let title = "FarmaVE-Reservas";
    var cantidad = await reservasModel.cantidadReservas();
    var estado = "";
    
    if (req.session.tipo == 1) {
      var info = true;
      var mensajeInfo = "No tiene la autorización para agregar una reserva.";
      var estado = "disabled";
    }

    var clientes = await clientesModel.buscarClientesActivos();
    var promociones = await promocionesModel.buscarPromocionesActivas();

    res.render('admin/reserva/agregar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      id_usuario: req.session.id_usuario,
      cantidad,
      clientes,
      promociones,
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

/* POST agregar reserva a la DB. */
router.post('/agregar', async (req, res, next) => {
  try {
    if (req.body.id_cliente != 0 && req.body.id_promo != 0 &&
        req.body.cantidad != "") {
        var promocion = await promocionesModel.buscarPromocionPorId(req.body.id_promo);
        var cantPromo = promocion.cantidad;
        var cantReserva = req.body.cantidad;
        if (cantPromo >= cantReserva) {
          await reservasModel.agregarReserva(req.body);
          var cantidadPromo = cantPromo - cantReserva;
          await promocionesModel.modificarCantidadPromocionPorId(cantidadPromo, req.body.id_promo);
          res.redirect('/admin/reservas');
        } else {
          var cantidad = await reservasModel.cantidadReservas();
          var estado = "";
          
          let title = "FarmaVE-Reservas";
          var clientes = await clientesModel.buscarClientesActivos();
          var promociones = await promocionesModel.buscarPromocionesActivas();
          res.render('admin/reserva/agregar', {
            layout: 'admin/layout',
            cantidad,
            clientes,
            promociones,
            estado,
            error: true,
            mensaje: 'Superó la cantidad de promociones.',
            title 
          });
        }
          
    } else {
      var cantidad = await reservasModel.cantidadReservas();
      var estado = "";
      
      let title = "FarmaVE-Reservas";
      var clientes = await clientesModel.buscarClientesActivos();
      var promociones = await promocionesModel.buscarPromocionesActivas();
      res.render('admin/reserva/agregar', {
        layout: 'admin/layout',
        cantidad,
        clientes,
        promociones,
        estado,
        error: true,
        mensaje: 'Todos los campos son requeridos.',
        title 
      });
    }
  } catch (error) {
    console.log(error);
    var cantidad = await reservasModel.cantidadReservas();
    var estado = "";
    
    let title = "FarmaVE-Reservas";
    var clientes = await clientesModel.buscarClientesActivos();
    var promociones = await promocionesModel.buscarPromocionesActivas();

    res.render('admin/reserva/agregar', {
      layout: 'admin/layout',
      cantidad,
      clientes,
      promociones,
      error: true,
      mensaje: 'No se cargó la reserva.',
      title
    });
  }
})

/* POST reservar a la DB. */
router.post('/reservar', async (req, res, next) => {
  try {
    var promocion = await promocionesModel.buscarPromocionPorId(req.body.id_promo);
    var cantPromo = promocion.cantidad;
    var cantReserva = req.body.cantidad;
    var cliente = await clientesModel.buscarClientePorIdUsuario(req.session.id_usuario);
    
    let objRes = {
      id_cliente: cliente.id,  
      id_promo: promocion.id,
      cantidad: cantReserva,
      estado: 1
    }
    
    await reservasModel.agregarReserva(objRes);
    var cantidadPromo = cantPromo - cantReserva;
    await promocionesModel.modificarCantidadPromocionPorId(cantidadPromo, req.body.id_promo);
    
    /* Aviso por mail */
    const mail = {
      to: 'alvaroguiffrey@gmail.com',
      subject: 'Reserva de Promociones',
      html: `Hola ${cliente.nombres} <br> nos contactamos para
      confirmar la reserva de la promoción: ${promocion.nombre}.<br> Por cualquier duda
      comuníquese por nuestras vias de contactos.<br> ¡GRACIAS por su confianza!.<br><br>
      Farmacia Villa Elisa SRL`
    }

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transport.sendMail(mail);
    // Fin aviso por mail

    res.redirect('/admin/promociones');
     
  } catch (error) {
    console.log(error);
    //window.alert('No se reservo la promoción. Verificar.')
    res.redirect('/admin/promociones');
    
  }
})

/* GET listar p/cliente. */
router.get('/listarPorCliente', async function(req, res, next) {
  if (req.session || req.session.nombre != "") {
    var cantidad = await reservasModel.cantidadReservas();
             
    let title = "FarmaVE-Reservas";
    var estado = "";
    
    if (req.session.tipo == 1) {
      var info = true;
      var mensajeInfo = "No tiene la autorización para listar reservas.";
      estado = "disabled";
    }

    var clientes = await clientesModel.buscarClientes();

    res.render('admin/reserva/selClienteListar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      id_usuario: req.session.id_usuario,
      cantidad,
      clientes,
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
});

/* POST listar por cliente. */
router.post('/listarPorCliente', async (req, res, next) => {
  if (req.session || req.session.nombre != "") {
    var cantidad = await reservasModel.cantidadReservas();
    let title = "FarmaVE-Reservas";
    let error = false;
    let mensaje = '';
    if (req.body.id_cliente == 0) {
      error = true;
      mensaje = 'No seleccionó un cliente a listar';
      
    } else {
      var cliente = await clientesModel.buscarClientePorId(req.body.id_cliente)
      var tituloCliente = cliente.apellido + ", " + cliente.nombres;
      
      if (req.body.estado == 9) {
        var reservas = await reservasModel.buscarReservasDeCliente(req.body.id_cliente);
      } else {
        var reservas = await reservasModel.buscarReservasDeClientePorEstado(req.body.id_cliente, req.body.estado);
      }
       
      var tituloListEstado = '';
      switch (req.body.estado) {
        case "0":
          tituloListEstado = '* Reservas Inactivas';
          break;
        case "1":
          tituloListEstado = 'Reservas Activas p/Entregar';
          break;
        case "2":
          tituloListEstado = 'Reservas Entregadas';
          break; 
        case "9": 
          tituloListEstado = 'Todas las Reservas';
          break;    
        default:
          tituloListEstado = 'Estado no definido';
          break;
      }

      var autEntregar = autEditar = autEliminar = false;
      switch (req.session.tipo) {
        case 3:
          autEntregar = autEditar = autEliminar = true;
          break;
        case 2:
          autEntregar = autEditar = autEliminar = true;
          break;
        default:
          autEditar = autEliminar = true;
          autEntregar = false;
          break;
      }

      if (req.body.estado != 1) {
        autEntregar = false;
      }
      
      reservas = await Promise.all(
        reservas.map(async reserva => {
          var id = reserva.id_promo;
          var promocion = await promocionesModel.buscarPromocionPorId(id);
          var nombrePromo = promocion.nombre;

          var estadoReserva = '';
          var tituloEstado = '';
          var iconoEstado = '';
          switch (reserva.estado) {
            case 0:
              estadoReserva = 'Inactiva';
              tituloEstado = 'Reserva inactiva';
              iconoEstado = 'fa-circle-xmark';
              break;
            case 1:
              estadoReserva = 'Activa';
              tituloEstado = 'Reserva activa';
              iconoEstado = 'fa-cart-shopping';
              break;
            case 2:
              estadoReserva = 'Entregada';
              tituloEstado = 'Reserva entregada';
              iconoEstado = 'fa-house-circle-check';
              break;
            default:
              estadoReserva = 'Error';
              tituloEstado = 'Error en código de estado';
              iconoEstado = 'fa-circle-exclamation';
              break;
          }

          if (promocion.id_img) {
            const imagen = cloudinary.image(promocion.id_img, {
              width: 70,
              height: 70,
              crop: 'fill'
            });

            return {
              ...reserva,
              tituloCliente,
              estadoReserva,
              tituloEstado,
              iconoEstado,
              nombrePromo,
              imagen
            }

          } else {
            return {
              ...reserva,
              tituloCliente,
              estadoReserva,
              tituloEstado,
              iconoEstado,
              nombrePromo,
              imagen: ''
            }
          }
        })
      );
      
    }
    res.render('admin/reserva/reservasCliente', { 
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cliente,
      reservas,
      cantidad,
      autEntregar,
      autEditar,
      autEliminar,
      tituloListEstado,
      error,
      mensaje,
      title
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});

/* GET ver reserva. */
router.get('/ver/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var cantidad = await reservasModel.cantidadReservas();
    var reserva = await reservasModel.buscarReservaPorId(req.params.id);
    let title = "FarmaVE-Reservas";

    var estadoReserva = '';
    var tituloEstado = '';
    var iconoEstado = '';
    switch (reserva.estado) {
      case 0:
        estadoReserva = 'Inactiva';
        tituloEstado = 'Reserva inactiva';
        iconoEstado = 'fa-circle-xmark';
        break;
      case 1:
        estadoReserva = 'Activa';
        tituloEstado = 'Reserva activa';
        iconoEstado = 'fa-cart-shopping';
        break;
      case 2:
        estadoReserva = 'Entregada';
        tituloEstado = 'Reserva entregada';
        iconoEstado = 'fa-house-circle-check';
        break;
      default:
        estadoReserva = 'Error';
        tituloEstado = 'Error en código de estado';
        iconoEstado = 'fa-circle-exclamation';
        break;
    }
        
    let tieneImg = false;
    let imagen = '';

    var promocion = await promocionesModel.buscarPromocionPorId(reserva.id_promo)
    if (promocion.id_img) {
      tieneImg = true;
      imagen = cloudinary.url(promocion.id_img, {
        width: 300,
        height: 300,
        crop: 'fill'
      });
    }

    var cliente = await clientesModel.buscarClientePorId(reserva.id_cliente);

    res.render('admin/reserva/ver', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      idReserva: req.params.id,
      cantidad,
      reserva,
      estadoReserva,
      tituloEstado,
      iconoEstado,
      promocion,
      cliente,
      imagen,
      tieneImg,
      title
      
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});

/* GET editar reserva. */
router.get('/editar/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var cantidad = await reservasModel.cantidadReservas();
    var reserva = await reservasModel.buscarReservaPorId(req.params.id);
    let title = "FarmaVE-Reservas";

    var estado = 'disabled';
    var info = false;
    var mensajeInfo = "";
    if (req.session.tipo == 3 || req.session.tipo == 3) {
      estado = '';
    } else {
      info = true;
      mensajeInfo = "No puede modificar una Reserva";
    }

    var estadoReserva = '';
    var tituloEstado = '';
    var iconoEstado = '';
    var estado1, estado0 = '';
    switch (reserva.estado) {
      case 0:
        estadoReserva = 'Inactiva';
        tituloEstado = 'Reserva inactiva';
        iconoEstado = 'fa-circle-xmark';
        estado0 = 'selected';
        break;
      case 1:
        estadoReserva = 'Activa';
        tituloEstado = 'Reserva activa';
        iconoEstado = 'fa-cart-shopping';
        estado1 = 'selected';
        break;
      case 2:
        estadoReserva = 'Entregada';
        tituloEstado = 'Reserva entregada';
        iconoEstado = 'fa-house-circle-check';
        estado = 'disabled';
        info = true;
        mensajeInfo = "No puede modificar una Reserva entregada.";
        break;
      default:
        estadoReserva = 'Error';
        tituloEstado = 'Error en código de estado';
        iconoEstado = 'fa-circle-exclamation';
        break;
    }

        
    let tieneImg = false;
    let imagen = '';

    var promocion = await promocionesModel.buscarPromocionPorId(reserva.id_promo)
    if (promocion.id_img) {
      tieneImg = true;
      imagen = cloudinary.url(promocion.id_img, {
        width: 300,
        height: 300,
        crop: 'fill'
      });
    }

    var cantidadTope = promocion.cantidad + reserva.cantidad;

    var cliente = await clientesModel.buscarClientePorId(reserva.id_cliente);

    res.render('admin/reserva/editar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      idReserva: req.params.id,
      cantidad,
      reserva,
      estadoReserva,
      estado,
      estado1,
      estado0,
      tituloEstado,
      iconoEstado,
      info,
      mensajeInfo,
      promocion,
      cliente,
      imagen,
      tieneImg,
      cantidadTope,
      title
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});

/* POST editar a la DB. */
router.post('/editar', async (req, res, next) => {
  try {
    var cantidad = await reservasModel.cantidadReservas();
    var reserva = await reservasModel.buscarReservaPorId(req.body.idReserva);
    let title = "FarmaVE-Reservas";

    if (req.body.cantidad != reserva.cantidad || req.body.estado != 9) {
      let objRes = {
        id_cliente: reserva.id_cliente,  
        id_promo: reserva.id_promo,
        cantidad: req.body.cantidad,
        estado: req.body.estado
      } 
      await reservasModel.modificarReservaPorId(objRes, req.body.idReserva);

      if (req.body.cantidad != reserva.cantidad) {
        var cantidadModi = req.body.cantidad - reserva.cantidad;
        var promocion = await promocionesModel.buscarPromocionPorId(reserva.id_promo);
        var cantidadNueva = promocion.cantidad - cantidadModi;
        await promocionesModel.modificarCantidadPromocionPorId(cantidadNueva, reserva.id_promo);
      }
    }
    
    res.redirect('/admin/reservas');
     
  } catch (error) {
    console.log(error);
    
    res.redirect('/admin/reservas');
  }
})


/* GET eliminar reserva. */
router.get('/eliminar/:id', async (req, res, next) => {
  var mensaje = "";
  if (req.session.nombre != "") {
    var autEliminar = false;
    mensaje = "No tiene autorización para ELIMINAR una Reserva.";
    
    if (req.session.tipo == 3) {
      autEliminar = true;
    } 

    var id = req.params.id;
      
    let reserva = await reservasModel.buscarReservaPorId(id);
    let cliente = await clientesModel.buscarClientePorId(reserva.id_cliente);

    console.log(cliente.id);
    console.log(cliente.id_usuario);
    console.log(req.session.id_usuario);

    if (req.session.tipo == 1 && req.session.id_usuario == cliente.id_usuario) {
      autEliminar = true;
    } 

    if (req.session.tipo == 2 && req.session.id_usuario == cliente.id_usuario) {
      autEliminar = true;
    } 

    if (reserva.estado == 2) {
      autEliminar = false;
      mensaje = "No se puede ELIMINAR una Reserva entregada.";
    }

    if (autEliminar) {
        var promocion = await promocionesModel.buscarPromocionPorId(reserva.id_promo);
        var cantPromo = promocion.cantidad;
        var cantReserva = reserva.cantidad;
        cantPromo += cantReserva;
        await promocionesModel.modificarCantidadPromocionPorId(cantPromo, promocion.id) 
        await reservasModel.eliminarReservaPorId(id);
        res.redirect('/admin/reservas'); 
    } else {
      var reservas = '';
      if (req.session.tipo == 1) {
        cliente = await clientesModel.buscarClientePorIdUsuario(req.session.id_usuario);
        reservas = await reservasModel.buscarReservasDeCliente(cliente.id);
      } else {
        reservas = await reservasModel.buscarReservas();
      }
      var cantidad = await reservasModel.cantidadReservas();
      let title = "FarmaVE-Reservas";

      var autEditar = autEliminar = false;
      switch (req.session.tipo) {
        case 3:
          autEditar = autEliminar = true;
          break;
        case 2:
          autEditar = autEliminar = false;
          break;
        default:
          autEditar = autEliminar = true;
          break;
      }
  
      reservas = await Promise.all(
        reservas.map(async reserva => {
          var id = reserva.id_promo;
          var promocion = await promocionesModel.buscarPromocionPorId(id);
          var nombrePromo = promocion.nombre;

          var cliente = await clientesModel.buscarClientePorId(reserva.id_cliente);
          var tituloCliente = cliente.apellido + ", " + cliente.nombres;
          var estadoReserva = '';
          var tituloEstado = '';
          var iconoEstado = '';
          switch (reserva.estado) {
            case 0:
              estadoReserva = 'Inactiva';
              tituloEstado = 'Reserva inactiva';
              iconoEstado = 'fa-circle-xmark';
              break;
            case 1:
              estadoReserva = 'Activa';
              tituloEstado = 'Reserva activa';
              iconoEstado = 'fa-cart-shopping';
              break;
            case 2:
              estadoReserva = 'Entregada';
              tituloEstado = 'Reserva entregada';
              iconoEstado = 'fa-house-circle-check';
              break;
            default:
              estadoReserva = 'Error';
              tituloEstado = 'Error en código de estado';
              iconoEstado = 'fa-circle-exclamation';
              break;
          }

          if (promocion.id_img) {
            const imagen = cloudinary.image(promocion.id_img, {
              width: 70,
              height: 70,
              crop: 'fill'
            });

            return {
              ...reserva,
              estadoReserva,
              tituloEstado,
              iconoEstado,
              tituloCliente,
              nombrePromo,
              imagen
            }

          } else {
            return {
              ...reserva,
              estadoReserva,
              tituloEstado,
              iconoEstado,
              tituloCliente,
              nombrePromo,
              imagen: ''
            }
          }
        })
      );
   
      res.render('admin/reservas', { 
        layout: 'admin/layout',
        usuario: req.session.nombre,
        error: true,
        mensaje,
        reservas,
        cantidad,
        autEditar,
        autEliminar,
        title
      });
    }
        
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});

/* POST entregar a la DB. */
router.post('/entregar', async (req, res, next) => {
  try {
    console.log(req.body);
    if (Object.keys(req.body).length > 0) {
      console.log(req.body);
      for (var dato in req.body){
        if (req.body.hasOwnProperty(dato)) {
          console.log(req.body[dato]);
          var estado = 2;
          var id = req.body[dato];
          await reservasModel.modificarReservaEstadoPorId(estado, id);
        }
      }
      res.redirect('/admin/reservas'); 
    } else {

      console.log('body vacio');
      res.redirect('/admin/reservas');
    }
    
  } catch (error) {
    console.log(error);
    res.redirect('/admin/reservas');
    
  }
  
})


module.exports = router;
