var express = require('express');
var router = express.Router();
var novedadesModel = require('./../../models/novedadesModel');
var usuariosModel = require('./../../models/usuariosModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

/* GET admin novedades. */
router.get('/', async function(req, res, next) {
  if (req.session || req.session.nombre != "") {
    var novedades = await novedadesModel.buscarNovedades();
    var cantidad = await novedadesModel.cantidadNovedades();
    let title = "FarmaVE-Novedades";

    var autEditar = autEliminar = false;
    switch (req.session.tipo) {
      case 3:
        autEditar = autEliminar = true;
        btAgregar = true;
        break;
      case 2:
        autEditar = true;
        btAgregar = true;
        break;
      default:
        autEditar = autEliminar = false;
        btAgregar = false;
        break;
    }
    
    novedades = novedades.map(novedad => {
      if (novedad.id_img) {
        const imagen = cloudinary.image(novedad.id_img, {
          width: 70,
          height: 70,
          crop: 'fill'
        });
       
        return {
          ...novedad,
          imagen
        }
      } else {
        return {
          ...novedad,
          imagen: ''
        }
      }
    });

    res.render('admin/novedades', { 
      layout: 'admin/layout',
      usuario: req.session.nombre,
      novedades,
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

/* GET agregar novedad. */
router.get('/agregar', async (req, res, next) => {
  if (req.session.nombre != "") {
    var cantidad = await novedadesModel.cantidadNovedades();
    var estado = "";
    let title = "FarmaVE-Novedades";
    
    if (req.session.tipo == 1) {
      var info = true;
      var mensajeInfo = "No tiene la autorización para agregar una Novedad.";
      var estado = "disabled";
    }

    res.render('admin/agregar', {
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

/* POST agregar novedad a la DB. */
router.post('/agregar', async (req, res, next) => {
  try {
    var id_img = '';

    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      id_img = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.titulo != "" && req.body.subtitulo != "" &&
        req.body.cuerpo != "") {
      await novedadesModel.agregarNovedad({
        ...req.body,
        id_img
      });
      res.redirect('/admin/novedades');  
    } else {
      let title = "FarmaVE-Novedades";

      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        mensaje: 'Todos los campos son requeridos.',
        title 
      });
    }
  } catch (error) {
    let title = "FarmaVE-Novedades";
    
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      mensaje: 'No se cargó la novedad.',
      title 
    });
  }
})

/* GET ver novedad. */
router.get('/ver/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var cantidad = await novedadesModel.cantidadNovedades();
    var novedad = await novedadesModel.buscarNovedadPorId(req.params.id);
    var autor = await usuariosModel.buscarUsuarioPorId(novedad.id_usuario);
    let title = "FarmaVE-Novedades";
    
    let tieneImg = false;
    let imagen = '';
    if (novedad.id_img) {
      tieneImg = true;
      imagen = cloudinary.url(novedad.id_img, {
        width: 300,
        height: 300,
        crop: 'fill'
      });
  
    }
    
    res.render('admin/ver', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      idNovedad: req.params.id,
      cantidad,
      novedad,
      imagen,
      tieneImg,
      autor,
      title
    });
  } else {
    res.render('admin/login/login', {
      layout: 'admin/layout',
      error: true
    });
  }
})

/* GET eliminar novedad. */
router.get('/eliminar/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    if (req.session.tipo == 3) {
      var id = req.params.id;

      let novedad = await novedadesModel.buscarNovedadPorId(id);
      if (novedad.id_img) {
        await (destroy(novedad.id_img));
      }

      await novedadesModel.eliminarNovedadPorId(id);
      res.redirect('/admin/novedades'); 
    } else {
      var novedades = await novedadesModel.buscarNovedades();
      var cantidad = await novedadesModel.cantidadNovedades();
      let title = "FarmaVE-Novedades";

      res.render('admin/novedades', {
        layout: 'admin/layout',
        error: true,
        mensaje: "No tiene autorización para ELIMINAR una Novedad.",
        novedades,
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

/* GET editar novedad. */
router.get('/editar/:id', async (req, res, next) => {
  if (req.session.nombre != "") {
    var id = req.params.id;
    var cantidad = await novedadesModel.cantidadNovedades();
    var novedad = await novedadesModel.buscarNovedadPorId(id);
    var autor = await usuariosModel.buscarUsuarioPorId(novedad.id_usuario);
    var estado = "";
    let title = "FarmaVE-Novedades";
    
    if (autor.usuario != req.session.nombre) {
      var info = true;
      var mensajeInfo = "No puede EDITAR esta Novedad, no es el autor.";
      var estado = "disabled";
    }
        
    console.log(req.params.id);
    
    res.render('admin/editar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      novedad,
      autor,
      idNovedad: req.params.id,
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

/* POST editar novedad. */
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
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      cuerpo: req.body.cuerpo,
      id_usuario: req.body.idUsuario,
      id_img
    }
    await novedadesModel.modificarNovedadPorId(obj, req.body.id);
    res.redirect('/admin/novedades');

  } catch (error) {
    console.log(error);
    var id = req.body.id;
    var cantidad = await novedadesModel.cantidadNovedades();
    var novedad = await novedadesModel.buscarNovedadPorId(id);
    var autor = await usuariosModel.buscarUsuarioPorId(novedad.id_usuario);
    var estado = "";
    var mensaje = "No se pudo modificar esta Novedad.";
    let title = "FarmaVE-Novedades";
         
    res.render('admin/editar', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      cantidad,
      novedad,
      autor,
      idNovedad: req.body.id,
      error: true,
      mensaje,
      estado,
      title
    });
  }
  
})

module.exports = router;
