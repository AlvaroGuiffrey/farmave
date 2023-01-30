var express = require('express');
var router = express.Router();
var promocionesModel = require('./../../models/promocionesModel');
var usuariosModel = require('./../../models/usuariosModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

/* GET admin promociones. */
router.get('/', async function(req, res, next) {
  if (req.session || req.session.nombre != "") {
    var promociones = await promocionesModel.buscarPromociones();
    var cantidad = await promocionesModel.cantidadPromociones();
    let title = "FarmaVE-Promociones";
    
    var autEditar = autEliminar = false;
    switch (req.session.tipo) {
      case 3:
        autEditar = autEliminar = true;
        btAgregar = true;
        break;
      case 2:
        autEditar = autEliminar = false;
        btAgregar = true;
        break;
      default:
        autEditar = autEliminar = false;
        btAgregar = false;
        break;
    }
    
    promociones = promociones.map(promocion => {
      if (promocion.id_img) {
        const imagen = cloudinary.image(promocion.id_img, {
          width: 70,
          height: 70,
          crop: 'fill'
        });
       
        return {
          ...promocion,
          imagen
        }
      } else {
        return {
          ...promocion,
          imagen: ''
        }
      }
    });
    
    res.render('admin/promociones', { 
      layout: 'admin/layout',
      usuario: req.session.nombre,
      promociones,
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

/* GET agregar promocion. */
router.get('/agregar', async (req, res, next) => {
  if (req.session.nombre != "") {
    let title = "FarmaVE-Promociones";
    var cantidad = await promocionesModel.cantidadPromociones();
    var estado = "";
    
    if (req.session.tipo == 1) {
      var info = true;
      var mensajeInfo = "No tiene la autorización para agregar una promoción.";
      var estado = "disabled";
    }

    res.render('admin/promocion/agregar', {
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

/* POST agregar promocion a la DB. */
router.post('/agregar', async (req, res, next) => {
  try {
    var id_img = '';

    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      id_img = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.nombre != "" && req.body.detalle != "" &&
        req.body.cantidad != "" && req.body.precio != "") {
        await promocionesModel.agregarPromocion({
          ...req.body,
          id_img
        });
        res.redirect('/admin/promociones');  
    } else {
      res.render('admin/promocion/agregar', {
        layout: 'admin/layout',
        error: true,
        mensaje: 'Todos los campos son requeridos.' 
      });
    }
  } catch (error) {
    console.log(error);
    let title = "FarmaVE-Promociones";
    res.render('admin/promocion/agregar', {
      layout: 'admin/layout',
      error: true,
      mensaje: 'No se cargó la promoción.',
      title
    });
  }
})


/* GET ver promoción. */
router.get('/ver/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var cantidad = await promocionesModel.cantidadPromociones();
    var promocion = await promocionesModel.buscarPromocionPorId(req.params.id);
    let title = "FarmaVE-Promociones";
        
    let tieneImg = false;
    let imagen = '';
    if (promocion.id_img) {
      tieneImg = true;
      imagen = cloudinary.url(promocion.id_img, {
        width: 300,
        height: 300,
        crop: 'fill'
      });
    }

    var btReservar = false;

    if (req.session.tipo == 1) {
      btReservar = true;
    }
    
    res.render('admin/promocion/ver', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      idPromocion: req.params.id,
      cantidad,
      promocion,
      imagen,
      tieneImg,
      btReservar,
      title
      
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* GET eliminar promoción. */
router.get('/eliminar/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    if (req.session.tipo == 3) {
      var id = req.params.id;
      
      let promocion = await promocionesModel.buscarPromocionPorId(id);
      if (promocion.id_img) {
        await (destroy(promocion.id_img));
      }

      await promocionesModel.eliminarPromocionPorId(id);
      res.redirect('/admin/promociones'); 
    } else {
      var promociones = await promocionesModel.buscarPromociones();
      var cantidad = await promocionesModel.cantidadPromociones();
      let title = "FarmaVE-Promociones";

      res.render('admin/promociones', {
        layout: 'admin/layout',
        error: true,
        mensaje: "No tiene autorización para ELIMINAR una Promoción.",
        promociones,
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

/* GET editar promocion. */
router.get('/editar/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var id = req.params.id;
    var cantidad = await promocionesModel.cantidadPromociones();
    var promocion = await promocionesModel.buscarPromocionPorId(id);
    var estado = "";
    let title = "FarmaVE-Promociones";
    
    if (req.session.tipo != 3) {
      var info = true;
      var mensajeInfo = "No puede EDITAR esta Promoción, no es administrador.";
      var estado = "disabled";
    }
        
    console.log(req.params.id);
    
    res.render('admin/promocion/editar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      promocion,
      idPromocion: req.params.id,
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

/* POST editar promoción. */
router.post('/editar', async (req, res, next) => {
  try {
    let id_img = req.body.imgOriginal;
    let borrar_img_vieja = false;
    
    if (req.body.imgBorrar === "1") {
      id_img = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        id_img = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
       
    if (borrar_img_vieja && req.body.imgOriginal) {
      await (destroy(req.body.imgOriginal));
    }
    

    let obj = {
      nombre: req.body.nombre,
      detalle: req.body.detalle,
      id_img,
      cantidad: req.body.cantidad,
      precio: req.body.precio,
      estado: req.body.estado
    }
    
    await promocionesModel.modificarPromocionPorId(obj, req.body.id);
    res.redirect('/admin/promociones');

  } catch (error) {
    console.log(error);
    var id = req.body.id;
    var cantidad = await promocionesModel.cantidadPromociones();
    var promocion = await promocionesModel.buscarPromocionPorId(id);
    var estado = "";
    var mensaje = "No se pudo modificar esta Promoción.";
    let title = "FarmaVE-Promociones";
         
    res.render('admin/promocion/editar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      promocion,
      idPromocion: req.body.id,
      error: true,
      mensaje,
      estado,
      title
    });
  }
  
})

module.exports = router;
