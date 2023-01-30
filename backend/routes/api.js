var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');
var novedadesModel = require('./../models/novedadesModel');
var promocionesModel = require('./../models/promocionesModel');

/* Novedades */
router.get('/novedades', async function (req, res, next) {
    let novedades = await novedadesModel.buscarNovedades();

    novedades = novedades.map(novedades => {
        if (novedades.id_img) {
           
            const imagen = cloudinary.url(novedades.id_img, {
                width: 300,
                height: 300,
                crop: 'fill'
            });
              
            return {
                ...novedades,
                imagen
            }
        } else {
            return {
                ...novedades,
                imagen: ''
              }
        }
    });

    res.json(novedades);
});

/* Promociones */
router.get('/promociones', async function (req, res, next) {
    let promociones = await promocionesModel.buscarPromociones();

    promociones = promociones.map(promociones => {
        if (promociones.id_img) {
           
            const imagen = cloudinary.url(promociones.id_img, {
                width: 200,
                height: 200,
                crop: 'fill'
            });
              
            return {
                ...promociones,
                imagen
            }
        } else {
            return {
                ...promociones,
                imagen: ''
              }
        }
    });

    res.json(promociones);
});

/* Envio de mail */
router.post('/contacto', async (req, res) => {
    const mail = {
        to: 'alvaroguiffrey@gmail.com',
        subject: 'Contacto web',
        html: `${req.body.nombre} se contacto a traves de
        la web y quiere más información a este correo:
        ${req.body.email} <br> Además, hizo el siguiente
        comentario: ${req.body.mensaje} <br> Su tel es:
        ${req.body.telefono}`
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

    res.status(201).json({
        error: false,
        message: 'Mensaje enviado'
    });
});

module.exports = router;
