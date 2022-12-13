import React from 'react';
import { FaInfoCircle, FaPhone, FaMailBulk, FaMobile, FaWhatsapp, 
  FaInstagram, FaFacebook } from 'react-icons/fa';

import '../styles/pages/ContactoPage.css';

const ContactoPage = (props) => {
    return (
        <main className="contenedor">
          <div className="columna contacto">
            <h2>Complete el siguiente formulario</h2>
            <form action="" method="" className="formulario">
              <p>
                <label>Nombre</label>
                <input type="text" name="nombre"/>
              </p>
              <p>
                <label>Email</label>
                <input type="email" name="email"/>
              </p>
              <p>
                <label>Teléfono</label>
                <input type="tel" name="telefono"/>
              </p>
              <p>
                <label>Comentario</label>
                <textarea name="mensaje"></textarea>
              </p>
              <p className="centrar"><input type="submit"
                  value="Enviar"/>
              </p>
            </form>
          </div>
          
          <div className="columna datos">
            <h2>Otras vias de contacto</h2>
            <div className="medios">
            <p><FaInfoCircle/> Tambien puede contactarse con nosotros
                por los siguientes medios:</p>
            </div>
            <div>
            <ul>
              <li><FaPhone/> Teléfono: 03447 480002</li>
              <li><FaMobile/> Celular: 03447 15491836</li>
              <li><FaWhatsapp/> WhatsApp: 3447491836</li>
              <li><FaMailBulk/> Email: farmaciavillaelisa@gmail.com</li>
              <li><FaFacebook/> Facebook</li> 
              <li><FaInstagram/> Instagram</li>
            </ul>
            </div>
          </div>
          
        </main>
    );
}

export default ContactoPage;
