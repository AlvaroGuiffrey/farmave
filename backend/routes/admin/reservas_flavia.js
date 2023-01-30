var express = require('express');
var router = express.Router();
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
    var reservas = await reservasModel.buscarReservas();
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
  
    /* Codigo con problemas: no puedo buscar la promoción con el id_promo de la reserva.

    Queria traer los datos de la promoción para hacer entendible el listado de reservas
    con información como el nombre, etc
   
    */
    //  -----------------------------------------------
    console.log(reservas)
    
    reservas = await Promise.all(
      reservas.map(async reserva => {
        var id = reserva.id_promo;
        var promocion = await promocionesModel.buscarPromocionPorId(id);
        var nombrePromo = promocion.nombre;

        if (promocion.id_img) {
          const imagen = cloudinary.image(promocion.id_img, {
            width: 70,
            height: 70,
            crop: 'fill'
          });

          return {
            ...reserva,
            nombrePromo,
            imagen
          }

        } else {
          return {
            ...reserva,
            nombrePromo,
            imagen: ''
          }
        }
      })
    )
    
    console.log(reservas)

   // Fin código con problemas
   // ------------------------------------------

    res.render('admin/reservas', { 
      layout: 'admin/layout',
      usuario: req.session.nombre,
      reservas,
      cantidad,
      autEditar,
      autEliminar,
      title
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});



module.exports = router;
